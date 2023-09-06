import * as React from "react";
import { connect } from "react-redux";
import { ReduxDispatch, IApplicationState, } from "mapguide-react-layout/lib/api/common";

import { getViewer } from 'mapguide-react-layout/lib/api/runtime'
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import { Style, Stroke, Fill } from 'ol/style';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import './multizones.css';
import VectorSource from "ol/source/Vector";
import VectorLayer from 'ol/layer/Vector'
import Geometry from 'ol/geom/Geometry';


export interface ISelectMultiZonesOwnProps { }
export interface ISelectMultiZonesProps { }
export interface ISelectMultiZonesDispatch { }

function mapDispatchToProps(dispatch: ReduxDispatch): Partial<ISelectMultiZonesDispatch> {
	return {};
}

function mapStateToProps(state: Readonly<IApplicationState>): Partial<ISelectMultiZonesProps> {
	return {};
}

class Zone {
	private minX: number;
	private minY: number;
	private maxX: number;
	private maxY: number;
	private mapProj: string;
	private codeEPSG: string;
	private zone: string;
	//mapCapturerLayer: VectorLayer<VectorSource<Geometry>>;
	//selectable  ???


	constructor(minX: number, minY: number, maxX: number, maxY: number, mapProj: string, codeEPSG: string, zone: string) {
		this.minX = minX;
		this.minY = minY;
		this.maxX = maxX;
		this.maxY = maxY;
		this.mapProj = mapProj;
		this.codeEPSG = codeEPSG
		this.zone = zone;
		//this.setZone(zone);
	}

	draw(couche: VectorLayer<VectorSource<Geometry>>, style: Style) {

		const feature: Feature = new Feature({
			geometry: new Polygon([[[this.minX, this.minY], [this.minX, this.maxY], [this.maxX, this.maxY], [this.maxX, this.minY], [this.minX, this.minY]]]),
		});


		// EPSG de base utilisé pour l'ensemble des multizones (les limites des zones sont basées sur WGS84)
		if (!(this.mapProj == "EPSG:4326")) {
			feature.getGeometry()?.transform("EPSG:4326", this.mapProj);
		}

		feature.set("idZone", this.zone); // feature.get("idZone") 
		feature.setId(this.codeEPSG);
		feature.setStyle(style);
		couche.getSource()?.addFeature(feature);
	}

}

const styleMZ = new Style({
	stroke: new Stroke({ color: '#FF0000', width: 1 }),
	fill: new Fill({
		color: [0, 0, 0.0, 0.0]
	})
})

//let xmlDoc: Document | null = null; // responseXML: Document | null selon https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.xmlhttprequest.html#response
let xmlDoc: Document | null;
let tagObj: HTMLCollectionOf<Element>;
let listMZ: Element[];
let options: Object;

export const SelectMultiZones = (props: any) => {

	const [xmlIn, setXmlIn] = React.useState(true); // le fichier XML ne doit être lu qu'une seule fois lors d'une session Mapguide

	if (xmlIn) {
		if (typeof window.DOMParser != "undefined") {
			let xmlhttp: XMLHttpRequest = new XMLHttpRequest();
			xmlhttp.open("GET", "./resources/mz.xml", false);
			if (xmlhttp.overrideMimeType) {
				xmlhttp.overrideMimeType('text/xml');
			}
			xmlhttp.send();
			if (xmlhttp.status !== 200) {
				alert("Fichier mz.xml est manquant");
			} else {
				xmlDoc = xmlhttp.responseXML;
				if (xmlDoc != null) {
					tagObj = xmlDoc.getElementsByTagName("mz"); // tag "mz" dans fichier XML
					listMZ = Array.from(tagObj);
					options = listMZ.map((op, i) => eval(`React.createElement("option", { value: "${i + 1}" }, "${op.attributes[0].nodeValue}")`))
				}
			}
		}
		setXmlIn(false); // le fichier est lu une fois lors d'une session mapguide ou si le fichier n'est pas trouvé alors affichage d'un message
	}

	const mzChangeHandler = (e: React.ChangeEvent<any>) => {
		e.preventDefault();
		const viewer: any = getViewer();
		viewer.getLayerSetGroup(props.mapName).scratchLayer.values_.source.clear();
		//viewer.getLayerSetGroup(props.mapName).scratchLayer.getSource.clear(); non fonctionnel

		let regis = false;
		let listEPSG: Element[] = Array.from(tagObj[Number(e.target.value) - 1].getElementsByTagName("epsg"));
		//let listEPSG: HTMLCollectionOf<Element>[] = [...tagObj[Number(e.target.value) - 1].getElementsByTagName("epsg")];


		listEPSG.map((op: any) => {
			let xmin: number = Number(op.childNodes[1].textContent);
			let ymin: number = Number(op.childNodes[3].textContent);
			let xmax: number = Number(op.childNodes[5].textContent);
			let ymax: number = Number(op.childNodes[7].textContent);
			let zone: string = op.childNodes[9].textContent;
			let proj4_defs: string = op.childNodes[11].textContent;
			let epsg: string = op.attributes["code"].nodeValue;
			new Zone(xmin, ymin, xmax, ymax, props.mapProj, epsg, zone).draw(viewer.getLayerSetGroup(props.mapName).scratchLayer, styleMZ);
			if (!proj4.defs["EPSG:" + epsg]) {
				proj4.defs("EPSG:" + epsg, proj4_defs);
				regis = true;
			}

		})

		regis ? register(proj4) : null;

		props.onNewMZ(e.target.value);

	}

	return <div>
		<label htmlFor="multi_zones_names"></label>
		<select className="selMZ" id="multi_zones_names" value={props.mz} onChange={mzChangeHandler}>
			<option value="0">Choose a multi zones...</option>
			{options}
		</select>
	</div>;
};


export default connect(mapStateToProps, mapDispatchToProps)(SelectMultiZones);


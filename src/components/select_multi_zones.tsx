import * as React from "react";
import { connect } from "react-redux";
import { useEffect, useState } from 'react';
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
let mz_val: string;


let loadedNadgrids : any= {};

function getNadgrids(nadgrids:string) {
  // Format details: http://proj.maptools.org/gen_parms.html
  if (nadgrids === undefined) { return null; }
  var grids = nadgrids.split(',');
  return grids.map(parseNadgridString);
}

function parseNadgridString(value:any) {
  if (value.length === 0) {
    return null;
  }
  var optional = value[0] === '@';
  if (optional) {
    value = value.slice(1);
  }
  if (value === 'null') {
    return {name: 'null', mandatory: !optional, grid: null, isNull: true};
  }
  return {
    name: value,
    mandatory: !optional,
    grid: loadedNadgrids[value] || null,
    isNull: false
  };
}


export const SelectMultiZones = (props: any) => {

	const [xmlIn, setXmlIn] = React.useState(true); // le fichier XML ne doit être lu qu'une seule fois lors d'une session Mapguide

	// poduire liste des MZ
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
		mz_val = e.target.value;
		//props.onNewMZ(e.target.value);
		//	}


		//	useEffect(() => {

		//const viewer: any = getViewer();
		viewer.getLayerSetGroup(props.mapName).scratchLayer.values_.source.clear();

		let regis = false;

		if (mz_val && mz_val != "0") { // mz_val pas undefined et plus grand que "0" cat "0" est le message de choix au début de la liste des MZ

			let listEPSG: Element[] = Array.from(tagObj[Number(mz_val) - 1].getElementsByTagName("epsg"));

			listEPSG.map((op: any) => {
				let xmin: number = Number(op.childNodes[1].textContent);
				let ymin: number = Number(op.childNodes[3].textContent);
				let xmax: number = Number(op.childNodes[5].textContent);
				let ymax: number = Number(op.childNodes[7].textContent);
				let zone: string = op.childNodes[9].textContent;
				let proj4_defs: string = op.childNodes[11].textContent;
				let epsg: string = op.attributes["code"].nodeValue;
				new Zone(xmin, ymin, xmax, ymax, props.mapProj, epsg, zone).draw(viewer.getLayerSetGroup(props.mapName).scratchLayer, styleMZ);


				//123xxx	
				if (!proj4.defs["EPSG:" + epsg]) {//si la projection existe dans proj4 alors ne pas l'ajouter à proj4

					let pos_nad: number = proj4_defs.search("nadgrids=");
					if (pos_nad != -1) { // la chaîne de caractères "nadgrids=" existe dans proj_defs donc un fichier gsb sera lu si existant et le contenu assigné à proj4.nadgrid

						let pos_units: number = proj4_defs.search("units=");
						let gsb_file = proj4_defs.substring(pos_nad + 9, pos_units - 2);
						proj4_defs = proj4_defs.replace(gsb_file, "@" + gsb_file + ",null"); // la clé de nasgrid est gsb_file, ajoutde @ pour nasgrid absent

						//let t = getNadgrids(proj4.defs);

						fetch('resources/' + gsb_file)
							.then((res) => {
								if (res.ok) return res.arrayBuffer();
								else throw new Error("Status code error :" + res.status);
							})
							//.then((response) => response.arrayBuffer())
							.then((fileData) => {
								if (!proj4.defs["EPSG:" + epsg]) {
									proj4.nadgrid(gsb_file, fileData); // gsb_file est la clé de nasgrid
									proj4.defs("EPSG:" + epsg, proj4_defs);
									register(proj4);
									console.log("Chargement de projection et de " + gsb_file + " dans nadgrid pour " + "EPSG:" + epsg);
								}
							})
							.catch((error) => {
								console.log(error + " (fichier " + gsb_file + " semble manquant.)");
							});

					} else {

						if (!proj4.defs["EPSG:" + epsg]) {
							proj4.defs("EPSG:" + epsg, proj4_defs);
							register(proj4);
							console.log("Chargement de projection pour " + "EPSG:" + epsg);
						}
					}

				}
			}



			)

			//regis ? register(proj4) : null;

		}


		props.onNewMZ(e.target.value);

	}
	//}, [mz_val]);
	//});

	return <div>
		<label htmlFor="multi_zones_names"></label>
		<select className="selMZ" id="multi_zones_names" value={props.mz} onChange={mzChangeHandler}>
			<option value="0">Choose a multi zones...</option>
			{options}
		</select>
	</div>;
};


export default connect(mapStateToProps, mapDispatchToProps)(SelectMultiZones);


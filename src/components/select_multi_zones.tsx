import * as React from "react";
import { connect } from "react-redux";
import { ReduxDispatch, IApplicationState, } from "mapguide-react-layout/lib/api/common";

import { getViewer } from 'mapguide-react-layout/lib/api/runtime'
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import { Style, Stroke, Fill } from 'ol/style';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';


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
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
	mapProj: string;
	codeEPSG: string;
	zone: string;

	//selectable  ???



	constructor(minX: number, minY: number, maxX: number, maxY: number, mapProj: string, codeEPSG: string, zone: string) {
		this.minX = minX;
		this.minY = minY;
		this.maxX = maxX;
		this.maxY = maxY;
		this.mapProj = mapProj;
		this.codeEPSG = codeEPSG
		this.setZone(zone);
	}


	setZone(zone: any) {
		this.zone = zone;
	}


	getZone(zone: any) {
		return this.zone;
	}


	drawZone(couche: any, style: Style) {

		const feature: any = new Feature({
			geometry: new Polygon([[[this.minX, this.minY], [this.minX, this.maxY], [this.maxX, this.maxY], [this.maxX, this.minY], [this.minX, this.minY]]]),
		});


		// EPSG de base utilisé pou l'ensemble des multizones
		if (!(this.mapProj == "EPSG:4326")) {
			feature.values_.geometry.transform("EPSG:4326", this.mapProj);
		}

		feature.set("idZone", this.zone); // feature.get("idZone") 
		feature.setId(this.codeEPSG);
		feature.setStyle(style);
		couche.values_.source.addFeature(feature);

	}

}




export const SelectMultiZones = (props: any) => {

	var style = new Style({
		stroke: new Stroke({ color: '#FF0000', width: 1 }),
		fill: new Fill({
			color: [0, 0, 0.0, 0.0]
		})
	})


	const mzChangeHandler = (e: React.ChangeEvent<any>) => {
		e.preventDefault();

		const viewer: any = getViewer();
		viewer.getLayerSetGroup(props.mapName).scratchLayer.values_.source.clear();
		let i: number;

		let regis = false;
		switch (e.target.value) {

			case "0":
				viewer.getLayerSetGroup(props.mapName).scratchLayer.values_.source.clear();
				break;
			case "1":
				//Québec MTM NAD83(CSRS)    
				viewer.getLayerSetGroup(props.mapName).scratchLayer.values_.source.clear();

				const zone3 = new Zone(-60.0000, 50.1000, -57.1000, 52.0000, props.mapProj, "EPSG:2945", "3");
				zone3.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);

				const zone4 = new Zone(-63.0000, 47.1300, -60.0000, 52.0000, props.mapProj, "EPSG:2946", "4");
				zone4.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);

				const zone5 = new Zone(-66.0000, 47.8800, -63.0000, 60.5200, props.mapProj, "EPSG:2947", "5");
				zone5.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);

				const zone6 = new Zone(-69.0000, 47.1000, -66.0000, 59.1000, props.mapProj, "EPSG:2948", "6");
				zone6.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);

				const zone7 = new Zone(-72.0000, 44.9900, -69.0000, 61.9000, props.mapProj, "EPSG:2949", "7");
				zone7.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);

				const zone8 = new Zone(-75.0000, 44.9900, -72.0000, 62.5600, props.mapProj, "EPSG:2950", "8");
				zone8.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);

				const zone9 = new Zone(-78.0000, 45.2800, -75.0000, 62.5600, props.mapProj, "EPSG:2951", "9");
				zone9.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);

				const zone10 = new Zone(-79.7600, 46.1300, -78.0000, 62.5000, props.mapProj, "EPSG:2952", "10");
				zone10.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);


				if (!proj4.defs[`EPSG:2945`]) {
					let v = `+proj=tmerc +lat_0=0 +lon_0=-58.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=-0.991,1.9072,0.5129,-1.25033e-07,-4.6785e-08,-5.6529e-08,0 +units=m +no_defs +type=crs`;
					proj4.defs(`EPSG:2945`, v);
					regis = true;

				}

				if (!proj4.defs[`EPSG:2946`]) {
					let v = `+proj=tmerc +lat_0=0 +lon_0=-61.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=-0.991,1.9072,0.5129,-1.25033e-07,-4.6785e-08,-5.6529e-08,0 +units=m +no_defs +type=crs`;
					proj4.defs(`EPSG:2946`, v);
					regis = true;
				}

				if (!proj4.defs[`EPSG:2947`]) {
					let v = `+proj=tmerc +lat_0=0 +lon_0=-64.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=-0.991,1.9072,0.5129,-1.25033e-07,-4.6785e-08,-5.6529e-08,0 +units=m +no_defs +type=crs`;
					proj4.defs(`EPSG:2947`, v);
					regis = true;

				}

				if (!proj4.defs[`EPSG:2948`]) {
					let v = `+proj=tmerc +lat_0=0 +lon_0=-67.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=-0.991,1.9072,0.5129,-1.25033e-07,-4.6785e-08,-5.6529e-08,0 +units=m +no_defs +type=crs`;
					proj4.defs(`EPSG:2948`, v);
					regis = true;
				}

				if (!proj4.defs[`EPSG:2949`]) {
					let v = `+proj=tmerc +lat_0=0 +lon_0=-70.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=-0.991,1.9072,0.5129,-1.25033e-07,-4.6785e-08,-5.6529e-08,0 +units=m +no_defs +type=crs`;
					proj4.defs(`EPSG:2949`, v);
					regis = true;

				}

				if (!proj4.defs[`EPSG:2950`]) {
					let v = `+proj=tmerc +lat_0=0 +lon_0=-73.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=-0.991,1.9072,0.5129,-1.25033e-07,-4.6785e-08,-5.6529e-08,0 +units=m +no_defs +type=crs`;
					proj4.defs(`EPSG:2950`, v);
					regis = true;
				}

				if (!proj4.defs[`EPSG:2951`]) {
					let v = `+proj=tmerc +lat_0=0 +lon_0=-76.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=-0.991,1.9072,0.5129,-1.25033e-07,-4.6785e-08,-5.6529e-08,0 +units=m +no_defs +type=crs`;
					proj4.defs(`EPSG:2951`, v);
					regis = true;

				}

				if (!proj4.defs[`EPSG:2952`]) {
					let v = `+proj=tmerc +lat_0=0 +lon_0=-79.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=-0.991,1.9072,0.5129,-1.25033e-07,-4.6785e-08,-5.6529e-08,0 +units=m +no_defs +type=crs`;
					proj4.defs(`EPSG:2952`, v);
					regis = true;
				}

				regis ? register(proj4) : null;


				break;


			case "2":
				//Canada UTM NAD83(CSRS)
				viewer.getLayerSetGroup(props.mapName).scratchLayer.values_.source.clear();
				/*
								const zone3 = new Zone(-60.0000, 50.1000, -57.1000, 52.0000, props.mapProj, "EPSG:2945", "3");
								zone3.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);
				
								const zone4 = new Zone(-63.0000, 47.1300, -60.0000, 52.0000, props.mapProj, "EPSG:2946", "4");
								zone4.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);
				
								const zone5 = new Zone(-66.0000, 47.8800, -63.0000, 60.5200, props.mapProj, "EPSG:2947", "5");
								zone5.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);
				
								const zone6 = new Zone(-69.0000, 47.1000, -66.0000, 59.1000, props.mapProj, "EPSG:2948", "6");
								zone6.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);
				
								const zone7 = new Zone(-72.0000, 44.9900, -69.0000, 61.9000, props.mapProj, "EPSG:2949", "7");
								zone7.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);
				
								const zone8 = new Zone(-75.0000, 44.9900, -72.0000, 62.5600, props.mapProj, "EPSG:2950", "8");
								zone8.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);
				
								const zone9 = new Zone(-78.0000, 45.2800, -75.0000, 62.5600, props.mapProj, "EPSG:2951", "9");
								zone9.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);
				
								const zone10 = new Zone(-79.7600, 46.1300, -78.0000, 62.5000, props.mapProj, "EPSG:2952", "10");
								zone10.drawZone(viewer.getLayerSetGroup(props.mapName).scratchLayer, style);
				
				*/
				for (i = -57; i >= -81; i = i - 3) {
					const feature: any = new Feature({
						geometry: new LineString([[i, 44], [i, 65]]),
					});

					if (!(props.mapProj == "EPSG:4326")) {
						feature.values_.geometry.transform("EPSG:4326", props.mapProj);
					}
					feature.setStyle(style);
					viewer.getLayerSetGroup(props.mapName).scratchLayer.values_.source.addFeature(feature);
				}

				if (!proj4.defs[`EPSG:2945`]) {
					let v = `+proj=tmerc +lat_0=0 +lon_0=-58.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=-0.991,1.9072,0.5129,-1.25033e-07,-4.6785e-08,-5.6529e-08,0 +units=m +no_defs +type=crs`;
					proj4.defs(`EPSG:2945`, v);
					regis = true;
				}

				break;

			default:

		}

		props.onNewMZ(e.target.value);
		//alert(e.target.value);
	}



	return <div>
		<label htmlFor="multi_zones_names">Choose a multi zones:</label>
		<select name="multi_zones_names" id="multi_zones_names" value={props.mz} onChange={mzChangeHandler}>
			<option value="0">Aucun</option>
			<option value="2">Canada UTM NAD83(CSRS)</option>
			<option value="1">Québec MTM NAD83(CSRS)</option>
		</select>
	</div>;
};



export default connect(mapStateToProps, mapDispatchToProps)(SelectMultiZones);
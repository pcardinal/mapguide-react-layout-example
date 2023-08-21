import * as React from "react";
import { connect } from "react-redux";
import { ReduxDispatch, IApplicationState, } from "mapguide-react-layout/lib/api/common";

import { getViewer } from 'mapguide-react-layout/lib/api/runtime'
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { Style, Stroke } from 'ol/Style';
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



export const SelectMultiZones = (props: any) => {

	var style = new Style({
		stroke: new Stroke({ color: '#FF0000', width: 1 }),
	})


	const mzChangeHandler = (e: React.ChangeEvent<any>) => {
		e.preventDefault();
		const viewer: any = getViewer();
		viewer.getLayerSetGroup(props.map_name).scratchLayer.values_.source.clear();

		switch (e.target.value) {
			case "0":
				viewer.getLayerSetGroup(props.map_name).scratchLayer.values_.source.clear();
				break;
			case "1":
				let i: number;
				for (i = -57; i >= -81; i = i - 3) {
					const feature: any = new Feature({
						//geometry: new LineString([[-87.7, 30], [-87.7, 70]]),  //44 sud, 65 nord
						geometry: new LineString([[i, 30], [i, 70]]),  //44 sud, 65 nord
					});

					if (!(props.map_proj == "EPSG:4326")) {
						feature.values_.geometry.transform("EPSG:4326", props.map_proj);
					}
					feature.setStyle(style);
					viewer.getLayerSetGroup(props.map_name).scratchLayer.values_.source.addFeature(feature);
				}

				//let proj4;
				let regis = false;
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


				regis ? register(proj4) : null;


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
			<option value="1">MTM</option>
			<option value="2">UTM</option>
		</select>
	</div>;
};



export default connect(mapStateToProps, mapDispatchToProps)(SelectMultiZones);
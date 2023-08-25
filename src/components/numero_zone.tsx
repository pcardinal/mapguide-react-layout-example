import * as React from "react";
import { connect } from "react-redux";
import { ReduxDispatch, IApplicationState, } from "mapguide-react-layout/lib/api/common";

import { getViewer } from 'mapguide-react-layout/lib/api/runtime'
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { Style, Stroke } from 'ol/Style';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';


export interface INumeroZoneOwnProps { }
export interface INumeroZoneProps { }
export interface INumeroZoneDispatch { }

function mapDispatchToProps(dispatch: ReduxDispatch): Partial<INumeroZoneDispatch> {
	return {};
}

function mapStateToProps(state: Readonly<IApplicationState>): Partial<INumeroZoneProps> {
	return {};
}



export const NumeroZone = (props: any) => {
	return <div>
		<h3> Zone: {props.zone}</h3>
	</div>;
};



export default connect(mapStateToProps, mapDispatchToProps)(NumeroZone);
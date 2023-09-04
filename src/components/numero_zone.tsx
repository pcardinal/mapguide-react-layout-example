import * as React from "react";
import { connect } from "react-redux";
import { ReduxDispatch, IApplicationState, } from "mapguide-react-layout/lib/api/common";

import './multizones.css';

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
	return <div className="noZone" >
		<h3> Zone: {props.zone}</h3>
	</div>;
};



export default connect(mapStateToProps, mapDispatchToProps)(NumeroZone);
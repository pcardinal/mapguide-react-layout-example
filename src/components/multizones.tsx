import * as React from "react";
import { connect } from "react-redux";
import { ReduxDispatch, IApplicationState } from "mapguide-react-layout/lib/api/common";
import { CoordinateTrackerContainer } from "mapguide-react-layout/lib/containers/coordinate-tracker"; //pc
import { SelectMultiZones } from "./select_multi_zones";
import { NumeroZone } from "./numero_zone";
import { useActiveMapProjection, useActiveMapState } from 'mapguide-react-layout/lib/containers/hooks-mapguide';
import { useCurrentMouseCoordinates, useActiveMapName } from 'mapguide-react-layout/lib/containers/hooks';
import * as olProj from "ol/proj";
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import getPixelFromCoordinate from 'ol/Map';

import Fill from 'ol/style/Fill.js';
import { getViewer } from 'mapguide-react-layout/lib/api/runtime'
import { MouseTrackingTooltip } from 'mapguide-react-layout/lib/components/tooltips/mouse'
import { FeatureQueryTooltip } from 'mapguide-react-layout/lib/components/tooltips/feature'
//import * as MapActions from "mapguide-react-layout/lib/actions/map";
//import { ICustomApplicationState } from "../reducers/multizones";


export interface IMultiZonesComponentOwnProps { }
export interface IMultiZonesComponentProps { }
export interface IMultiZonesComponentDispatch { }

export type MultiZonesComponentProps = Partial<IMultiZonesComponentOwnProps> & Partial<IMultiZonesComponentProps> & Partial<IMultiZonesComponentDispatch>;

function mapDispatchToProps(dispatch: ReduxDispatch): Partial<IMultiZonesComponentDispatch> {
    return {

    };
}

function mapStateToProps(state: Readonly<IApplicationState>): Partial<IMultiZonesComponentProps> {
    return {

    };
}

const MultiZonesComponent = (props: any) => {
    const [mz, setMZ] = React.useState("0");

    let mapName: any = useActiveMapName();
    if (((window as any)[mapName]) !== mz) {
        if ((window as any)[mapName] == undefined) (window as any)[mapName] = "0";
        setMZ((window as any)[mapName]);
    }


    const onNewMultiZonesHandler = (mz: any) => {
        setMZ(mz);
        (window as any)[mapName] = mz;
    };

    //let proj: any;
    let mapProj: any = useActiveMapProjection();  //projection par defaut

    const viewer: any = getViewer();

    let selected: any = null;
    let proj: any;
    const mouseXY: any = useCurrentMouseCoordinates();

    if (mouseXY) {
        let pix = viewer._map.getPixelFromCoordinate(mouseXY);
        viewer._map.forEachFeatureAtPixel(pix, function (feature: any) {
            //setSelected(f);
            //selected = f;
            //selectStyle.getFill().setColor(f.get('COLOR') || '#eeeeee');
            //f.setStyle(selectStyle);
            proj = feature.id_;
            //return true;
        });
    }
    
    /*
    if (selected) {
        //status.innerHTML = selected.get('ECO_NAME');
        proj = selected.id_;
        //setProj(selected.id_)
    }
*/

    let zone;
    let x = 1;

    return <div>
        <SelectMultiZones mz={mz} mapProj={mapProj} mapName={mapName} onNewMZ={onNewMultiZonesHandler} />
        <CoordinateTrackerContainer projections={[proj]} />
        <NumeroZone zone={zone} />
    </div>;

};

export default connect(mapStateToProps, mapDispatchToProps)(MultiZonesComponent);

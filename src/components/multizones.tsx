import * as React from "react";
import { connect } from "react-redux";
import { ReduxDispatch, IApplicationState } from "mapguide-react-layout/lib/api/common";
import { CoordinateTrackerContainer } from "mapguide-react-layout/lib/containers/coordinate-tracker"; //pc
import { SelectMultiZones } from "./select_multi_zones";
import { NumeroZone } from "./numero_zone";
import { useActiveMapProjection, useActiveMapState } from 'mapguide-react-layout/lib/containers/hooks-mapguide';
import { useCurrentMouseCoordinates, useActiveMapName } from 'mapguide-react-layout/lib/containers/hooks';

import { getViewer } from 'mapguide-react-layout/lib/api/runtime'


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

    const viewer: any = getViewer();
    let proj: any = useActiveMapProjection();  //projection de la carte active 
    let zone;
    let mapProj = proj; 
    const mouseXY: any = useCurrentMouseCoordinates();

    if (mouseXY) {
        let pix = viewer._map.getPixelFromCoordinate(mouseXY); // pixel du feature sous la souris
        viewer._map.forEachFeatureAtPixel(pix, function (feature: any) {
            proj = feature.getId();
            zone = feature.get("idZone"); 
        });
    }
    

    return <div>
        <SelectMultiZones mz={mz} mapProj={mapProj} mapName={mapName} onNewMZ={onNewMultiZonesHandler} />
        <CoordinateTrackerContainer projections={[proj]} />
        <NumeroZone zone={zone} />
    </div>;

};

export default connect(mapStateToProps, mapDispatchToProps)(MultiZonesComponent);

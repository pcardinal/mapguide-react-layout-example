import * as React from "react";
import { connect } from "react-redux";
import { ReduxDispatch, IApplicationState } from "mapguide-react-layout/lib/api/common";
import { CoordinateTrackerContainer } from "mapguide-react-layout/lib/containers/coordinate-tracker"; //pc
import { SelectMultiZones } from "./select_multi_zones";
import { useActiveMapProjection, useActiveMapState } from 'mapguide-react-layout/lib/containers/hooks-mapguide';
import { useCurrentMouseCoordinates, useActiveMapName } from 'mapguide-react-layout/lib/containers/hooks';
import * as olProj from "ol/proj";
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

    let map_name: any = useActiveMapName();
    if (((window as any)[map_name]) !== mz) {
        if ((window as any)[map_name] == undefined) (window as any)[map_name] = "0";
        setMZ((window as any)[map_name]);
    }


    const onNewMultiZonesHandler = (mz: any) => {
        setMZ(mz);
        (window as any)[map_name] = mz;
    };

    let proj: any;
    proj = useActiveMapProjection();  //projection par defaut

    const mousexy: any = useCurrentMouseCoordinates();

    switch (mz) {
        case "0":
            //setProjMap(useActiveMapProjection());
            //proj_prec[0] = proj;
            break;
        case "1":

            let mousex;
            let mousey;

            // calculer la position de la souris par rapport aux zones
            // MTM (SCRS) Québec
            if (proj == "EPSG:4326") {
                mousex = mousexy[0];
                mousey = mousexy[1];
            } else {
                let mouseproj = olProj.transform(mousexy, proj, "EPSG:4326")
                mousex = mouseproj[0];
                mousey = mouseproj[1];
            }


            if ((parseInt(mousex) <= -57) && (parseInt(mousex) >= -81) && (parseInt(mousey) > 30) && (parseInt(mousey) < 70)) {
                let zone = Math.trunc((Math.abs(parseInt(mousex)) - 57) / 3) + 3;

                switch (zone) {
                    case 1:
                        //setProjMap("EPSG:26898");
                        //proj_prec[0] =
                        proj = "EPSG:26898";

                        break;
                    case 2:
                        //setProjMap("EPSG:26899");
                        //proj_prec[0] =
                        proj = "EPSG:26899";
                        break;
                    default:
                        //setProjMap("EPSG:29" + (42 + zone)); // 2945 à 2952
                        //proj_prec[0] = 
                        proj = "EPSG:29" + (42 + zone); // 2945 à 2952
                }

                //setProjMap(proj);
            }

            break;

        default:

    }




    return <div>
        <SelectMultiZones mz={mz} map_proj={proj} map_name={map_name} onNewMZ={onNewMultiZonesHandler} />
        <CoordinateTrackerContainer projections={[proj]} />
    </div>;

};

export default connect(mapStateToProps, mapDispatchToProps)(MultiZonesComponent);

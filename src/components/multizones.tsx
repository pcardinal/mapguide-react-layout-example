import * as React from "react";
import { connect } from "react-redux";
import { ReduxDispatch, IApplicationState, Coordinate2D } from "mapguide-react-layout/lib/api/common";
import { CoordinateTrackerContainer } from "mapguide-react-layout/lib/containers/coordinate-tracker"; //pc
import { useActiveMapProjection } from 'mapguide-react-layout/lib/containers/hooks-mapguide';
import { useCurrentMouseCoordinates, useActiveMapName } from 'mapguide-react-layout/lib/containers/hooks';
import { getViewer } from 'mapguide-react-layout/lib/api/runtime'
import Feature from 'ol/Feature';
import { SelectMultiZones } from "./select_multi_zones";
import { NumeroZone } from "./numero_zone";
import './multizones.css';
export interface IMultiZonesComponentOwnProps { }
export interface IMultiZonesComponentProps { }
export interface IMultiZonesComponentDispatch { }
import { useRef } from 'react';

export type MultiZonesComponentProps = Partial<IMultiZonesComponentOwnProps> & Partial<IMultiZonesComponentProps> & Partial<IMultiZonesComponentDispatch>;

function mapDispatchToProps(dispatch: ReduxDispatch): Partial<IMultiZonesComponentDispatch> {
    return {
    }
}

function mapStateToProps(state: Readonly<IApplicationState>): Partial<IMultiZonesComponentProps> {
    return {
    }
}

const memoryState :any = {};


function useMemoryState(key: any, initialState : any) {
  const [state, setState] = React.useState(() => {
    const hasMemoryValue = Object.prototype.hasOwnProperty.call(memoryState, key);
    if (hasMemoryValue) {
      return memoryState[key]
    } else {
      return typeof initialState === 'function' ? initialState() : initialState;
    }
  });

  function onChange(nextState:any) {
    memoryState [key] = nextState;
    setState(nextState);
  }

  return [state, onChange];
}



//const [todos, setTodos] = useMemoryState('todos', ['Buy milk']);


const MultiZonesComponent = (props: unknown) => {

    const [mz, setMZ] = React.useState("0");

    let mapName = "";
    let activeMapName = useActiveMapName();
    if (typeof activeMapName == "string") { mapName = activeMapName }

    if (((window as any)[mapName]) !== mz) {
        if ((window as any)[mapName] == undefined) (window as any)[mapName] = "0";
        setMZ((window as any)[mapName]);
    }


    const [todos, setTodos] = useMemoryState(mapName, [mz]);
 

    

    const onNewMultiZonesHandler = (mz: string) => {
        setMZ(mz);
       //actmap[mapName] = useRef(mz);
        (window as any)[mapName] = mz;
    }
    let proj = "";
    
    let mapProj: string | undefined = useActiveMapProjection();  //projection de la carte active   
    /*
    if (mapProj) { proj = mapProj }
*/
    const mouseXY: Coordinate2D | undefined = useCurrentMouseCoordinates();
    let zone = "";

    /*let testx = useMapProviderContext();*/ //bug avec module
    /*const viewerx: IMapViewer | undefined = getViewer();*/
    const viewer: any = getViewer();

    if (mouseXY) {  // vérifier si la souris est dans view (map) sinon problème d'affichage
        let pix: [number, number] = viewer._map.getPixelFromCoordinate(mouseXY); // pixel du feature sous la souris
        viewer._map.forEachFeatureAtPixel(pix, function (feature: Feature) {
            let proj_feature = feature.getId();
            if (typeof proj_feature == "string") {  proj = "EPSG:" + proj_feature }
            zone = feature.get("idZone");
        });
    }

    // event pour afficher le numéro de la zone balayée par la souris
    const onZoomToMZ = () => {
        if (mz !== "0") {
            let layerExtent = viewer.getLayerSetGroup(mapName).scratchLayer.values_.source.getExtent();
            viewer.getLayerSetGroup(mapName).getView().fit(layerExtent);
        }
    }

    //proj = proj + "EPSG:4326";    
    //<CoordinateTrackerContainer projections="EPSG:4326" />
    //<CoordinateTrackerContainer projections={[proj]} />
    //<CoordinateTrackerContainer projections={[proj , "EPSG:4326" ]} />
    
    return <div>
        <SelectMultiZones mz={mz} mapProj={mapProj} mapName={mapName} onNewMZ={onNewMultiZonesHandler} />
        <CoordinateTrackerContainer projections={[proj , "EPSG:4326" ]} />

    
        <NumeroZone zone={zone} />
        <button className="zoomToMZ" onClick={onZoomToMZ}>ZoomToMZ</button>
    </div>;

};

export default connect(mapStateToProps, mapDispatchToProps)(MultiZonesComponent);

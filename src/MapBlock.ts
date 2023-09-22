import * as warMap from "./WarMap"
import * as basic from "./Basic"
//----------------------------------------------------------------
export class MapBlock{
    public mapOwner:warMap.WarMap;
    public position:basic.Position;
    //------------------------------------------------------------
    constructor(mapOwner:warMap.WarMap, position:basic.Position){
        this.mapOwner = mapOwner;
        this.position = position;
        mapOwner.addBlock( this );
    }//-----------------------------------------------------------
}//===============================================================
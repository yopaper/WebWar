import * as basic from "./Basic.js"
import { MapBlock } from "./MapBlock.js";
//------------------------------------------------------------
export const BLOCK_SIZE = 30;
//------------------------------------------------------------
export class Grid{
    public gridSize:number;
    //--------------------------------------------------------
    constructor(gridSize:number){
        this.gridSize = gridSize;
    }//-------------------------------------------------------
    public realToIndex(position:basic.Position):basic.Position{
        return new basic.Position(
            Math.round( position.x / this.gridSize ),
            Math.round( position.y / this.gridSize )
        );
    }//-------------------------------------------------------
    public indexToReal(index:basic.Position):basic.Position{
        return new basic.Position(
            index.x * this.gridSize,
            index.y * this.gridSize
        );
    }//-------------------------------------------------------
}//===========================================================

export var mapBlockGrid:Grid = new Grid(BLOCK_SIZE);
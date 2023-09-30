import * as basic from "./Basic.js"
import { MapBlock } from "./MapBlock.js";
//------------------------------------------------------------
export const BLOCK_SIZE = 30;
export const INDEXER_GRID_SIZE = BLOCK_SIZE*5;
//------------------------------------------------------------
export class Grid{
    public gridSize:number;
    //--------------------------------------------------------
    constructor(gridSize:number){
        this.gridSize = gridSize;
    }//-------------------------------------------------------
    public realToIndex(position:basic.Vector2):basic.Vector2Int{
        return new basic.Vector2Int(
            Math.round( position.getX() / this.gridSize ),
            Math.round( position.getY() / this.gridSize )
        );
    }//-------------------------------------------------------
    public indexToReal(index:basic.Vector2Int):basic.Vector2{
        return new basic.Vector2(
            index.getX() * this.gridSize,
            index.getY() * this.gridSize
        );
    }//-------------------------------------------------------
}//===========================================================

export const mapBlockGrid:Grid = new Grid(BLOCK_SIZE);
export const unitIndexerGrid:Grid = new Grid(INDEXER_GRID_SIZE);
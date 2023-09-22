import * as warMap from "./WarMap.js"
import * as basic from "./Basic.js"
import * as canvas from "./CanvasHandler.js"
import * as grid from "./Grid.js"

//----------------------------------------------------------------
export class MapBlock{
    public mapOwner:warMap.WarMap;
    public indexPosition:basic.Position;
    //------------------------------------------------------------
    constructor(mapOwner:warMap.WarMap, position:basic.Position){
        this.mapOwner = mapOwner;
        this.indexPosition = position;
        mapOwner.addBlock( this );
    }//-----------------------------------------------------------
    public realPosition():basic.Position{
        return grid.mapBlockGrid.indexToReal( this.indexPosition );
    }//-----------------------------------------------------------
    public getAdjacentBlockWithOffset(offset:basic.Position):MapBlock|null{
        var index = this.indexPosition.getOffset( offset.x, offset.y );
        return this.mapOwner.getBlock( index );
    }//-----------------------------------------------------------
    public draw():void{
        var pos1 = this.realPosition().getOffset(-grid.BLOCK_SIZE/2, -grid.BLOCK_SIZE/2);
        var pos2 = pos1.getOffset(grid.BLOCK_SIZE, grid.BLOCK_SIZE);
        canvas.drawRect( pos1, pos2, "#DDDDDD", "#BBBBBB", 1 );
    }//-----------------------------------------------------------
}//===============================================================
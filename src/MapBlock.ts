import * as warMap from "./WarMap.js"
import * as basic from "./Basic.js"
import * as canvas from "./CanvasHandler.js"
import * as grid from "./Grid.js"
import * as path from "./PathHandler.js"

//----------------------------------------------------------------
export class MapBlock{
    public mapOwner:warMap.WarMap;
    public indexPosition:basic.Vector2;
    //------------------------------------------------------------
    constructor(mapOwner:warMap.WarMap, position:basic.Vector2){
        this.mapOwner = mapOwner;
        this.indexPosition = position;
        mapOwner.addBlock( this );
    }//-----------------------------------------------------------
    public realPosition():basic.Vector2{
        return grid.mapBlockGrid.indexToReal( this.indexPosition );
    }//-----------------------------------------------------------
    public randomPositionOn():basic.Vector2{
        return this.realPosition().getOffset(
            (Math.random()*2-1)*grid.BLOCK_SIZE/2.25,
            (Math.random()*2-1)*grid.BLOCK_SIZE/2.25
        );
    }//-----------------------------------------------------------
    public getAdjacentBlockWithOffset(offset:basic.Vector2):MapBlock|null{
        var index = this.indexPosition.getOffset( offset.x, offset.y );
        return this.mapOwner.getBlockWithPosition( index );
    }//-----------------------------------------------------------
    public getPath():path.BlockPath{
        return this.mapOwner.pathHandler.getBlockPath( this.indexPosition.x, this.indexPosition.y )as path.BlockPath;
    }//-----------------------------------------------------------
    public draw():void{
        canvas.drawRectCenter(
            this.realPosition(), new basic.Vector2(grid.BLOCK_SIZE, grid.BLOCK_SIZE),
            "#DDDDDD", "#BBBBBB", 1 );
    }//-----------------------------------------------------------
}//===============================================================
import * as warMap      from "./WarMap.js"
import * as basic       from "./Basic.js"
import * as mapBlock    from "./MapBlock.js"
import * as canvas      from "./CanvasHandler.js"
import { BLOCK_SIZE }   from "./Grid.js"

export class PathHandler{
    public mapOwner:warMap.WarMap;
    private pathTable:basic.Table2D<BlockPath> = new basic.Table2D();
    //---------------------------------------------------------------
    constructor(mapOwner:warMap.WarMap){
        this.mapOwner = mapOwner;
    }//--------------------------------------------------------------
    public getBlockPath(x:number, y:number):BlockPath|null{
        if( this.mapOwner.getBlock(x, y)==null )return null;
        if( this.pathTable.Get(x, y)==null ){
            this.pathTable.Set(x, y, new BlockPath(this, new basic.Vector2(x, y)));
        }
        return this.pathTable.Get(x, y);
    }//--------------------------------------------------------------
    public getBlockPathWithPosition(position:basic.Vector2):BlockPath|null{
        return this.getBlockPath( position.x, position.y );
    }//--------------------------------------------------------------
    public getDistance(start:{x:number, y:number}, target:{x:number, y:number}):number|null{
        if( this.mapOwner.getBlock(start.x, start.y)==null )return null;
        if( this.mapOwner.getBlock(target.x, target.y)==null )return null;
        var path = this.getBlockPath( target.x, target.y );
        if( path==null )return null;
        return path.getDistance(start.x, start.y)as number|null;
    }//--------------------------------------------------------------
}//==================================================================

export class BlockPath{
    public handlerOwner:PathHandler;
    public mapOwner:warMap.WarMap;
    public indexPosition : basic.Vector2;
    private maxDistance : number = 0;
    private distTable : basic.Table2D<number> = new basic.Table2D();
    //---------------------------------------------------------------
    constructor(handlerOwner:PathHandler, indexPosition:basic.Vector2){
        console.log(`建立(${indexPosition.x}, ${indexPosition.y})距離表`);
        this.handlerOwner = handlerOwner;
        this.mapOwner = handlerOwner.mapOwner;
        this.indexPosition = indexPosition;
        this.buildTable();
    }//--------------------------------------------------------------
    // 取得該點至此的距離
    public getDistance(x:number, y:number):number|null{
        return this.distTable.Get(x, y);
    }//--------------------------------------------------------------
    // 用Vector取得該點至此的距離
    public getDistanceWithPosition(position:basic.Vector2):number|null{
        return this.getDistance( position.x, position.y );
    }//--------------------------------------------------------------
    // 取得該點至此的下一步
    public getNextStepToThis(position:basic.Vector2):basic.Vector2|null{
        var currentDist = this.getDistanceWithPosition(position);
        if( currentDist==null )return null;
        var adjacentPosList = position.getAdjacent();
        var nextPosList:basic.Vector2[] = [];
        for(var i=0; i<adjacentPosList.length; i++){
            var adjPos = adjacentPosList[i];
            if( this.getDistanceWithPosition(adjPos)!=currentDist-1 )continue;
            nextPosList.push( adjPos );
        }
        if( nextPosList.length<=0 )return null;
        return nextPosList[ basic.randomInt(0, nextPosList.length-1) ];
    }//--------------------------------------------------------------
    // 取得該點至此的下一個方塊
    public getNextBlockToThis(position:basic.Vector2):mapBlock.MapBlock|null{
        var nextStep = this.getNextStepToThis(position);
        if( nextStep==null )return null;
        return this.mapOwner.getBlockWithPosition( nextStep );
    }//--------------------------------------------------------------
    public getMapBlock():mapBlock.MapBlock{
        return this.mapOwner.getBlockWithPosition(this.indexPosition)as mapBlock.MapBlock;
    }//--------------------------------------------------------------
    public distanceDebugDraw():void{
        var keyList = this.distTable.GetAllKeys();
        for(var i=0; i<keyList.length; i++){
            var key = keyList[i];
            var dist = this.distTable.Get( key.x, key.y )as number;
            var pos = this.mapOwner.getBlock( key.x, key.y )?.realPosition()as basic.Vector2;
            var distRate = dist / this.maxDistance;
            var color = basic.hToColor(distRate);
            canvas.drawRectCenter( pos, new basic.Vector2(BLOCK_SIZE*0.9, BLOCK_SIZE*0.9),
            null, color, 1 );
        }
    }//--------------------------------------------------------------
    private buildTable():void{
        var indexToProcess:{x:number, y:number}[] = [ {x:this.indexPosition.x, y:this.indexPosition.y} ];
        var procedssedIndex:basic.Table2D<boolean> = new basic.Table2D();
        this.distTable.Set( this.indexPosition.x, this.indexPosition.y, 0 );
        //...........................................................
        var addIndex = (index:{x:number, y:number}):void=>{
            if( procedssedIndex.Get(index.x ,index.y)!=null || this.distTable.Get(index.x, index.y)!=null )return;
            indexToProcess.push( index );
            procedssedIndex.Set( index.x, index.y, true );
        };//..........................................................
        var process = (index:{x:number, y:number}):void=>{
            if( this.mapOwner.getBlock(index.x, index.y)==null )return;
            var adjacentList = new basic.Vector2(index.x, index.y).getAdjacentDict();
            var minDist:number|null = null;
            for(var i=0; i<adjacentList.length; i++){
                var adjacent = adjacentList[i];
                addIndex( adjacent );
                var adjDist = this.distTable.Get( adjacent.x, adjacent.y );
                if( adjDist==null )continue;
                if( minDist==null || adjDist < minDist ){
                    minDist = adjDist;
                }
            }
            if( minDist == null )return;
            this.distTable.Set( index.x, index.y, minDist + 1 );
            if( minDist + 1 > this.maxDistance )
                this.maxDistance = minDist + 1;
        };//..........................................................
        while( indexToProcess.length > 0 ){
            process( indexToProcess[0] );
            indexToProcess.splice(0, 1);
        }
        console.log( "建立完成!" );
    }//--------------------------------------------------------------
}//==================================================================
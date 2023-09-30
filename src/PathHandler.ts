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
            this.pathTable.Set(x, y, new BlockPath(this, new basic.Vector2Int(x, y)));
        }
        return this.pathTable.Get(x, y);
    }//--------------------------------------------------------------
    public getBlockPathWithVector(position:basic.Vector2Int):BlockPath|null{
        return this.getBlockPath( position.getX(), position.getY() );
    }//--------------------------------------------------------------
    public getDistance(start:basic.Vector2Int, target:basic.Vector2Int):basic.MapBlockDistance{
        if( this.mapOwner.getBlock(start.getX(), start.getY())==null )
            return basic.MapBlockDistance.inaccessible();
        if( this.mapOwner.getBlock(target.getX(), target.getY())==null )
        return basic.MapBlockDistance.inaccessible();
        var path = this.getBlockPath( target.getX(), target.getY() );
        if( path==null )return basic.MapBlockDistance.inaccessible();
        return path.getDistance(start.getX(), start.getY());
    }//--------------------------------------------------------------
}//==================================================================

export class BlockPath{
    public handlerOwner:PathHandler;
    public mapOwner:warMap.WarMap;
    public indexPosition : basic.Vector2Int;
    private maxDistance : number = 0;
    private distTable : basic.Table2D<number> = new basic.Table2D();
    //---------------------------------------------------------------
    constructor(handlerOwner:PathHandler, indexPosition:basic.Vector2Int){
        console.log(`建立(${indexPosition.getX()}, ${indexPosition.getY()})距離表`);
        this.handlerOwner = handlerOwner;
        this.mapOwner = handlerOwner.mapOwner;
        this.indexPosition = indexPosition.copy();
        this.buildTable();
    }//--------------------------------------------------------------
    // 取得該點至此的距離
    public getDistance(x:number, y:number):basic.MapBlockDistance{
        var dist = this.distTable.Get(x, y);
        if( dist != null )return new basic.MapBlockDistance(dist);
        return new basic.MapBlockDistance(Number.POSITIVE_INFINITY);
    }//--------------------------------------------------------------
    // 用Vector取得該點至此的距離
    public getDistanceWithPosition(position:basic.Vector2Int):basic.MapBlockDistance{
        return this.getDistance( position.getX(), position.getY() );
    }//--------------------------------------------------------------
    // 取得該點至此的下一步
    public getNextStepToThis(position:basic.Vector2Int):basic.Vector2Int|null{
        var currentDist = this.getDistanceWithPosition(position).getBlockDistance();
        if( currentDist==null )return null;
        var adjacentPosList = position.getAdjacent();
        var nextPosList:basic.Vector2Int[] = [];
        for(var i=0; i<adjacentPosList.length; i++){
            var adjPos = adjacentPosList[i];
            if( this.getDistanceWithPosition(adjPos).getBlockDistance()!=currentDist-1 )continue;
            nextPosList.push( adjPos );
        }
        if( nextPosList.length<=0 )return null;
        return nextPosList[ basic.randomInt(0, nextPosList.length-1) ];
    }//--------------------------------------------------------------
    // 取得該點至此的下一個方塊
    public getNextBlockToThis(position:basic.Vector2Int):mapBlock.MapBlock|null{
        var nextStep = this.getNextStepToThis(position);
        if( nextStep==null )return null;
        return this.mapOwner.getBlockWithIndex( nextStep );
    }//--------------------------------------------------------------
    public getMapBlock():mapBlock.MapBlock{
        return this.mapOwner.getBlockWithIndex(this.indexPosition)as mapBlock.MapBlock;
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
        var indexToProcess:{x:number, y:number}[] = [ {x:this.indexPosition.getX(), y:this.indexPosition.getY()} ];
        var procedssedIndex:basic.Table2D<boolean> = new basic.Table2D();
        this.distTable.Set( this.indexPosition.getX(), this.indexPosition.getY(), 0 );
        //...........................................................
        var addIndex = (index:{x:number, y:number}):void=>{
            if( procedssedIndex.Get(index.x ,index.y)!=null || this.distTable.Get(index.x, index.y)!=null )return;
            indexToProcess.push( index );
            procedssedIndex.Set( index.x, index.y, true );
        };//..........................................................
        var process = (index:{x:number, y:number}):void=>{
            if( this.mapOwner.getBlock(index.x, index.y)==null )return;
            var adjacentList = new basic.Vector2Int(index.x, index.y).getAdjacentDict();
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
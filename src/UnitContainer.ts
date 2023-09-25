import * as warMap  from "./WarMap.js";
import * as unit    from "./BasicUnit.js";
import * as basic   from "./Basic.js";
import * as grid    from "./Grid.js";
import * as canvas  from "./CanvasHandler.js"
import * as unitUtils   from "./UnitUtils.js"

const DEBUG_ENABLE = false;

export class UnitContainer{
    public mapOwner:warMap.WarMap;
    private indexerTable:basic.Table2D< unit.Unit[] > = new basic.Table2D();
    private unitsList:unit.Unit[] = [];
    //-----------------------------------------------------
    constructor( mapOwner:warMap.WarMap ){
        this.mapOwner = mapOwner;
    }//----------------------------------------------------
    public update():void{
        this.removeDeadUnit();
        this.clearIndexer();
        this.indexerLoadUnits();
        for(var i=0; i<this.unitsList.length; i++){
            this.unitsList[i].update();
        }
        this.debugDraw();
    }//----------------------------------------------------
    public addUnit(unit:unit.Unit):void{
        if( this.unitsList.indexOf(unit)>=0 )return;
        this.unitsList.push(unit);
    }//----------------------------------------------------
    public getUnits():unit.Unit[]{
        return Array.from( this.unitsList );
    }//----------------------------------------------------
    public getUnitsOn(index:basic.Vector2):unit.Unit[]{
        var units = this.indexerTable.Get(index.x, index.y);
        if( units==null )return[];
        return Array.from( units );
    }//----------------------------------------------------
    public getUnitsInRange(center:basic.Vector2, range:number):unit.Unit[]{
        var units:unit.Unit[] = [];
        for(var dx=-range; dx<=range; dx++){
            for(var dy=-range; dy<=range; dy++){
                units = units.concat(this.getUnitsOn(center.getOffset(dx, dy)));
            }
        }
        return units;
    }//----------------------------------------------------
    private removeDeadUnit():void{
        unitUtils.removeDeadUnitFromArray( this.unitsList );
    }//----------------------------------------------------
    private indexerLoadUnits():void{
        var checkArray = ( index:basic.Vector2 ):void=>{
            if( this.indexerTable.Get( index.x, index.y )!=null )return;
            this.indexerTable.Set( index.x, index.y, [] );
        }//................................................
        for(var i=0; i<this.unitsList.length; i++){
            var unit = this.unitsList[i];
            var unitIndexerIndex = grid.unitIndexerGrid.realToIndex( unit.position );
            checkArray( unitIndexerIndex );
            this.indexerTable.Get( unitIndexerIndex.x, unitIndexerIndex.y )?.push( unit );
        }
    }//----------------------------------------------------
    private clearIndexer():void{
        this.indexerTable.clear();
    }//----------------------------------------------------
    private debugDraw():void{
        if(!DEBUG_ENABLE)return;
        var indexList = this.indexerTable.GetAllKeys();
        for(var i=0; i<indexList.length; i++){
            var index = indexList[i];
            var units = this.indexerTable.Get( index.x, index.y );
            var indexerPosition = grid.unitIndexerGrid.indexToReal(
                new basic.Vector2(index.x, index.y) );
            if( units==null )continue;
            for(var j=0; j<units.length; j++){
                var unit = units[j];
                canvas.drawLine( unit.position, indexerPosition, "#FFFF00", 1 );
            }
        }
    }//----------------------------------------------------
}//========================================================
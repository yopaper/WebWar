import * as unit from "./BasicUnit.js"
import * as unitContainer from "./UnitContainer.js"
import * as basic from "./Basic.js"

abstract class TargetFinder{
    protected target:unit.Unit|null = null;
    //----------------------------------------------
    public getTarget():unit.Unit|null{
        return this.target;
    }//---------------------------------------------
    public targetIndexPosition():basic.Vector2Int|null{
        if( this.target==null )return null;
        return this.target.mapBlockIndex();
    }//---------------------------------------------
    public abstract update():void;
}//=================================================

// 基礎的單位目標搜尋器
export abstract class UnitTargetFinder extends TargetFinder{
    public unitOwner:unit.Unit;
    //----------------------------------------------
    constructor( unitOwner:unit.Unit ){
        super();
        this.unitOwner = unitOwner;
    }//---------------------------------------------
    public override update(): void {
        if( this.target!=null && this.loseTargetCondition() ){
            this.target = null;
        }else if(this.target==null){
            this.findTarget();
        }
    }//---------------------------------------------
    public getUnitContainer():unitContainer.UnitContainer{
        return this.unitOwner.mapOwner.unitContainer;
    }//---------------------------------------------
    protected abstract filterCondition(unit:unit.Unit):boolean;
    //----------------------------------------------
    protected abstract loseTargetCondition():boolean;
    //----------------------------------------------
    protected abstract findTarget():void;
}//=================================================

// 搜尋最近目標的搜尋器
abstract class ClosestTargetFinder  extends UnitTargetFinder{
    protected indexerRange:number;
    constructor( unitOwner:unit.Unit, indexerRange:number ){
        super(unitOwner);
        this.indexerRange = indexerRange;
    }//---------------------------------------------
    protected override findTarget():void{
        var aroundUnits = this.getUnitContainer().getUnitsInRange( this.unitOwner.unitIndexerIndex(), this.indexerRange );
        var filtedUnits = aroundUnits.filter( (unit, index, array)=>{ return this.filterCondition(unit); } );
        var closestUnits:unit.Unit[] = [];
        var minDist:number = Number.POSITIVE_INFINITY;
        for(var i=0; i<filtedUnits.length; i++){
            var unit = filtedUnits[i];
            var dist = this.unitOwner.position.euclideanDistance(unit.position);
            var dist = this.unitOwner.indexDistanceWithUnit(unit).getBlockDistance();
            if( dist == minDist ){
                closestUnits.push( unit );
            }else if( dist < minDist ){
                closestUnits.splice(0, closestUnits.length);
                closestUnits.push( unit );
                minDist = dist;
            }
        }
        if( closestUnits.length<=0 )return;
        this.target = closestUnits[ basic.randomInt(0, closestUnits.length-1) ];
    }//---------------------------------------------
}//=================================================

// 搜尋整張地圖的搜尋器
abstract class GlobalTargetFinder   extends UnitTargetFinder{
    protected override findTarget(): void {
        var filtedUnits = this.getUnitContainer().getUnits(
        ).filter( (unit, index, array)=>{return this.filterCondition(unit);} );
        if( filtedUnits.length<=0 )return;
        this.target = filtedUnits[ basic.randomInt(0, filtedUnits.length-1) ];
    }//---------------------------------------------
}//=================================================

// 搜尋最近敵人的搜尋器
export class AttackTargetFinder     extends ClosestTargetFinder{
    protected findRange:basic.MapBlockDistance;
    //----------------------------------------------
    constructor(unitOwner:unit.Unit, findRange:basic.MapBlockDistance, indexerRange:number){
        super( unitOwner, indexerRange );
        this.findRange = findRange;
    }//---------------------------------------------
    protected override filterCondition(unit: unit.Unit): boolean {
        var dist = this.unitOwner.indexDistanceWithUnit( unit ).getBlockDistance();
        return( !this.unitOwner.team.same(unit.team) && dist<=this.findRange.getBlockDistance() );
    }//---------------------------------------------
    protected loseTargetCondition(): boolean {
        if( this.target==null )return false;
        var dist = this.unitOwner.indexDistanceWithUnit(this.target).getBlockDistance();
        return( dist>this.findRange.getBlockDistance() || this.target.hp.dead() ||
            this.unitOwner.team.same(this.target.team) );
    }//---------------------------------------------
}//=================================================

// 搜尋隨機敵方重要單位的搜尋器
export class MainTargetFinder       extends GlobalTargetFinder{
    protected override filterCondition(unit: unit.Unit): boolean {
        return( !this.unitOwner.team.same(unit.team) && unit.unitRank()>=2 );
    }//---------------------------------------------
    protected loseTargetCondition(): boolean {
        if( this.target==null )return false;
        var lose = ( this.unitOwner.team.same(this.target.team) || this.target.hp.dead() );
        console.log(lose);
        return lose;
    }//---------------------------------------------
}//=================================================
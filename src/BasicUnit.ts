import * as basic       from "./Basic.js";
import * as warMap      from "./WarMap.js";
import * as grid        from "./Grid.js";
import * as mapBlock    from "./MapBlock.js";
import * as unitTeam    from "./UnitTeam.js";
import * as unitSpawner from "./UnitSpawner.js";
import * as unitMover   from "./UnitMover.js";
import * as unitAttack  from "./UnitAttacker.js";
import * as unitHp      from "./UnitHp.js";
import * as unitBehavior    from "./UnitBehavior.js";
import * as targetFinder    from "./TargetFinder.js";
//==========================================================
export abstract class Unit{
    public mapOwner:warMap.WarMap;
    public hp:unitHp.UnitHp;
    public team:unitTeam.UnitTeam;
    public position:basic.Vector2;
    public mover:unitMover.UnitMover;
    public attacker:unitAttack.UnitAttacker;
    public behavior:unitBehavior.UnitBehavior;
    public spawners:unitSpawner.UnitSpawner[];
    public targetFinders:targetFinder.UnitTargetFinder[];
    //------------------------------------------------------
    constructor( mapOwner:warMap.WarMap, team:unitTeam.UnitTeam, position:basic.Vector2 ){
        this.mapOwner = mapOwner;
        this.team = team;
        this.hp = this.hpSource();
        this.position = position.copy();
        this.spawners = this.spawnersSource();
        this.mover = this.moverSource();
        this.attacker = this.attackerSource();
        this.behavior = this.behaviorSource();
        this.targetFinders = this.targetFindersSource();
        mapOwner.unitContainer.addUnit(this);
    }//-----------------------------------------------------
    public update():void{
        this.draw();
        this.hp.update();
        this.mover.update();
        this.attacker.update();
        this.behavior.update();
        for(var i=0; i<this.targetFinders.length; i++)
            this.targetFinders[i].update();
        for(var i=0; i<this.spawners.length; i++)
            this.spawners[i].update();
    }//-----------------------------------------------------
    public mapBlockIndex():basic.Vector2Int{
        return grid.mapBlockGrid.realToIndex( this.position );
    }//-----------------------------------------------------
    public unitIndexerIndex():basic.Vector2{
        return grid.unitIndexerGrid.realToIndex( this.position );
    }//-----------------------------------------------------
    public standedBlock():mapBlock.MapBlock{
        return this.mapOwner.getBlockWithIndex( this.mapBlockIndex() )as mapBlock.MapBlock;
    }//-----------------------------------------------------
    public getTarget():Unit|null{
        for(var i=0; i<this.targetFinders.length; i++){
            var target = this.targetFinders[i].getTarget();
            if( target!=null )return target;
        }
        return null;
    }//-----------------------------------------------------
    public targetIndexPosition():basic.Vector2Int|null{
        for(var i=0; i<this.targetFinders.length; i++){
            var target = this.targetFinders[i].targetIndexPosition();
            if( target!=null )return target;
        }
        return null;
    }//-----------------------------------------------------
    public indexDistanceWithIndex(indexPosition:basic.Vector2Int):basic.MapBlockDistance{
        return this.mapOwner.pathHandler.getDistance(
            this.mapBlockIndex(), indexPosition
        );
    }//-----------------------------------------------------
    public indexDistanceWithUnit(unit:Unit):basic.MapBlockDistance{
        return this.indexDistanceWithIndex( unit.mapBlockIndex() );
    }//-----------------------------------------------------
    public abstract unitRank():number;
    //------------------------------------------------------
    protected abstract draw():void;
    //------------------------------------------------------
    protected abstract hpSource():unitHp.UnitHp;
    //------------------------------------------------------
    protected abstract moverSource():unitMover.UnitMover;
    //------------------------------------------------------
    protected abstract attackerSource():unitAttack.UnitAttacker;
    //------------------------------------------------------
    protected abstract behaviorSource():unitBehavior.UnitBehavior;
    //------------------------------------------------------
    protected abstract targetFindersSource():targetFinder.UnitTargetFinder[];
    //------------------------------------------------------
    protected spawnersSource():unitSpawner.UnitSpawner[]{
        return [];
    }//-----------------------------------------------------
}//=========================================================

export abstract class BuildingUnit extends Unit{
    constructor( mapOwner:warMap.WarMap, team:unitTeam.UnitTeam, indexPosition:basic.Vector2Int ){
        super(mapOwner, team, grid.mapBlockGrid.indexToReal( indexPosition ));
    }//-----------------------------------------------------
    protected override moverSource(): unitMover.UnitMover {
        return new unitMover.StaticUnitMover(this);
    }//-----------------------------------------------------
}//=========================================================
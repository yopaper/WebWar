import * as canvas          from "./CanvasHandler.js"
import * as basic           from "./Basic.js"
import * as gameUnit        from "./GameUnit.js"
import * as unitSpawner     from "./UnitSpawner.js";
import * as unit            from "./BasicUnit.js";
import * as unitAttack      from "./UnitAttacker.js";
import * as behavior        from "./UnitBehavior.js";
import * as targetFinder    from "./TargetFinder.js";
import * as unitHp          from "./UnitHp.js";
import * as grid            from "./Grid.js"

//---------------------------------------------------
export class SmallBarracks extends unit.BuildingUnit{
    public override unitRank(): number {
        return 2;
    }//-----------------------------------------------
    protected override draw(): void {
        canvas.drawRectCenter(this.position, new basic.Vector2(12, 12),
        this.team.getMainColor(), this.team.getSubColor(), 1);
        canvas.drawRectCenter(this.position, new basic.Vector2(6, 6),
        this.team.getMainColorWithRate(this.hp.hpRate()), null, null);
    }//-----------------------------------------------
    protected hpSource(): unitHp.UnitHp {
        return new unitHp.UnitHp(200, 1);
    }//-----------------------------------------------
    protected override spawnersSource(): unitSpawner.UnitSpawner[] {
        return [
            new unitSpawner.UnitSpawner(this, (spawner)=>{
            var spawnedUnit = new gameUnit.Fighter(this.mapOwner, this.team,
                this.standedBlock().randomPositionOn());
                return spawnedUnit;
            }, 5, 1, 3, 3),
            new unitSpawner.UnitSpawner(this, (spawner)=>{
                var spawnedUnit = new gameUnit.Shooter(this.mapOwner, this.team,
                this.standedBlock().randomPositionOn());
                return spawnedUnit;
            }, 5, 1, 3, 3),
        ];
    }//-----------------------------------------------
    protected attackerSource(): unitAttack.UnitAttacker {
        return new unitAttack.StaticAttacker(this);
    }//-----------------------------------------------
    protected behaviorSource(): behavior.UnitBehavior {
        return new behavior.TargetPriorityBehavior(this);
    }//-----------------------------------------------
    protected targetFindersSource(): targetFinder.UnitTargetFinder[] {
        return [];
    }//-----------------------------------------------

}//===================================================

export class LargeBarracks extends unit.BuildingUnit{
    public override unitRank(): number {
        return 2;
    }//-----------------------------------------------
    protected override draw(): void {
        canvas.drawRectCenter(this.position, new basic.Vector2(18, 18),
        this.team.getMainColor(), this.team.getSubColor(), 1);
        canvas.drawRectCenter(this.position, new basic.Vector2(8, 8),
        this.team.getMainColorWithRate(this.hp.hpRate()), null, null);
    }//-----------------------------------------------
    protected hpSource(): unitHp.UnitHp {
        return new unitHp.UnitHp(600, 1);
    }//-----------------------------------------------
    protected override spawnersSource(): unitSpawner.UnitSpawner[] {
        return [
            new unitSpawner.UnitSpawner(this, (spawner)=>{
            var spawnedUnit = new gameUnit.Fighter(this.mapOwner, this.team,
                this.standedBlock().randomPositionOn());
                return spawnedUnit;
            }, 20, 4, 8, 12),
            new unitSpawner.UnitSpawner(this, (spawner)=>{
                var spawnedUnit = new gameUnit.Shooter(this.mapOwner, this.team,
                this.standedBlock().randomPositionOn());
                return spawnedUnit;
            }, 20, 4, 8, 12),
        ];
    }//-----------------------------------------------
    protected attackerSource(): unitAttack.UnitAttacker {
        return new unitAttack.StaticAttacker(this);
    }//-----------------------------------------------
    protected behaviorSource(): behavior.UnitBehavior {
        return new behavior.TargetPriorityBehavior(this);
    }//-----------------------------------------------
    protected targetFindersSource(): targetFinder.UnitTargetFinder[] {
        return [];
    }//-----------------------------------------------

}//===================================================

export class Tower extends unit.BuildingUnit{
    public override unitRank(): number {
        return 2;
    }//-----------------------------------------------
    protected override draw(): void {
        canvas.drawCircle( this.position, 7 ,
            this.team.getMainColor(), {strokeColor:this.team.getSubColor(), strokeWidth:1} );
        canvas.drawCircle( this.position, 3 ,
            this.team.getMainColorWithRate(this.hp.hpRate()),
            {strokeColor:this.team.getSubColor(), strokeWidth:1} );
        canvas.drawCircle( this.position, 9 , undefined,
                {strokeColor:this.team.getMainColorWithRate(this.hp.shieldRate()), strokeWidth:1} );
    }//-----------------------------------------------
    protected hpSource(): unitHp.UnitHp {
        return new unitHp.UnitHpWithShield(500, 2, 750);
    }//-----------------------------------------------
    protected override spawnersSource(): unitSpawner.UnitSpawner[] {
        return [];
    }//-----------------------------------------------
    protected attackerSource(): unitAttack.UnitAttacker {
        return new unitAttack.NormalAttacker(this,
            {attackCoolDown:1, attackDamage:12, attackDistance:grid.BLOCK_SIZE*3});
    }//-----------------------------------------------
    protected behaviorSource(): behavior.UnitBehavior {
        return new behavior.TargetPriorityBehavior(this);
    }//-----------------------------------------------
    protected targetFindersSource(): targetFinder.UnitTargetFinder[] {
        return [new targetFinder.AttackTargetFinder(this,
            new basic.MapBlockDistance(3), 1)];
    }//-----------------------------------------------
}//===================================================
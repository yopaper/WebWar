import * as canvas from "./CanvasHandler.js"
import * as basic from "./Basic.js"
import * as gameUnit from "./GameUnit.js"
import * as unitSpawner from "./UnitSpawner.js";
import * as unit from "./BasicUnit.js";
import * as unitAttack from "./UnitAttacker.js";
import * as behavior from "./UnitBehavior.js";
import * as targetFinder from "./TargetFinder.js";
import * as unitHp from "./UnitHp.js";

//---------------------------------------------------
export class SmallBarracks extends unit.BuildingUnit{
    public override unitRank(): number {
        return 2;
    }//-----------------------------------------------
    protected override draw(): void {
        canvas.drawRectCenter(this.position, new basic.Vector2(18, 18),
        this.team.getMainColor(), this.team.getSubColor(), 2);
        canvas.drawRectCenter(this.position, new basic.Vector2(8, 8),
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
            }, 5, 1, 2, 3),
            new unitSpawner.UnitSpawner(this, (spawner)=>{
                var spawnedUnit = new gameUnit.Shooter(this.mapOwner, this.team,
                this.standedBlock().randomPositionOn());
                return spawnedUnit;
            }, 5, 1, 2, 3),
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
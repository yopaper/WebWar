import * as canvas from "./CanvasHandler.js";
import * as basic from "./Basic.js";
import * as gameUnit from "./GameUnit.js";
import * as unitSpawner from "./UnitSpawner.js";
import * as unit from "./BasicUnit.js";
import * as unitAttack from "./UnitAttacker.js";
import * as behavior from "./UnitBehavior.js";
import * as unitHp from "./UnitHp.js";
export class SmallBarracks extends unit.BuildingUnit {
    unitRank() {
        return 2;
    }
    draw() {
        canvas.drawRectCenter(this.position, new basic.Vector2(18, 18), this.team.getMainColor(), this.team.getSubColor(), 2);
        canvas.drawRectCenter(this.position, new basic.Vector2(8, 8), this.team.getMainColorWithRate(this.hp.hpRate()), null, null);
    }
    hpSource() {
        return new unitHp.UnitHp(200, 1);
    }
    spawnersSource() {
        return [
            new unitSpawner.UnitSpawner(this, (spawner) => {
                var spawnedUnit = new gameUnit.Fighter(this.mapOwner, this.team, this.standedBlock().randomPositionOn());
                return spawnedUnit;
            }, 1, 1, 5, 5),
            new unitSpawner.UnitSpawner(this, (spawner) => {
                var spawnedUnit = new gameUnit.Shooter(this.mapOwner, this.team, this.standedBlock().randomPositionOn());
                return spawnedUnit;
            }, 1, 1, 5, 5),
        ];
    }
    attackerSource() {
        return new unitAttack.StaticAttacker(this);
    }
    behaviorSource() {
        return new behavior.TargetPriorityBehavior(this);
    }
    targetFindersSource() {
        return [];
    }
}

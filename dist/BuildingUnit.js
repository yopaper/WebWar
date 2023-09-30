import * as canvas from "./CanvasHandler.js";
import * as basic from "./Basic.js";
import * as gameUnit from "./GameUnit.js";
import * as unitSpawner from "./UnitSpawner.js";
import * as unit from "./BasicUnit.js";
import * as unitAttack from "./UnitAttacker.js";
import * as behavior from "./UnitBehavior.js";
import * as targetFinder from "./TargetFinder.js";
import * as unitHp from "./UnitHp.js";
import * as grid from "./Grid.js";
export class SmallBarracks extends unit.BuildingUnit {
    unitRank() {
        return 2;
    }
    draw() {
        canvas.drawRectCenter(this.position, new basic.Vector2(12, 12), this.team.getMainColor(), this.team.getSubColor(), 1);
        canvas.drawRectCenter(this.position, new basic.Vector2(6, 6), this.team.getMainColorWithRate(this.hp.hpRate()), null, null);
    }
    hpSource() {
        return new unitHp.UnitHp(200, 1);
    }
    spawnersSource() {
        return [
            new unitSpawner.UnitSpawner(this, (spawner) => {
                var spawnedUnit = new gameUnit.Fighter(this.mapOwner, this.team, this.standedBlock().randomPositionOn());
                return spawnedUnit;
            }, 5, 1, 3, 3),
            new unitSpawner.UnitSpawner(this, (spawner) => {
                var spawnedUnit = new gameUnit.Shooter(this.mapOwner, this.team, this.standedBlock().randomPositionOn());
                return spawnedUnit;
            }, 5, 1, 3, 3),
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
export class LargeBarracks extends unit.BuildingUnit {
    unitRank() {
        return 2;
    }
    draw() {
        canvas.drawRectCenter(this.position, new basic.Vector2(18, 18), this.team.getMainColor(), this.team.getSubColor(), 1);
        canvas.drawRectCenter(this.position, new basic.Vector2(8, 8), this.team.getMainColorWithRate(this.hp.hpRate()), null, null);
    }
    hpSource() {
        return new unitHp.UnitHp(600, 1);
    }
    spawnersSource() {
        return [
            new unitSpawner.UnitSpawner(this, (spawner) => {
                var spawnedUnit = new gameUnit.Fighter(this.mapOwner, this.team, this.standedBlock().randomPositionOn());
                return spawnedUnit;
            }, 20, 4, 8, 12),
            new unitSpawner.UnitSpawner(this, (spawner) => {
                var spawnedUnit = new gameUnit.Shooter(this.mapOwner, this.team, this.standedBlock().randomPositionOn());
                return spawnedUnit;
            }, 20, 4, 8, 12),
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
export class Tower extends unit.BuildingUnit {
    unitRank() {
        return 2;
    }
    draw() {
        canvas.drawCircle(this.position, 7, this.team.getMainColor(), { strokeColor: this.team.getSubColor(), strokeWidth: 1 });
        canvas.drawCircle(this.position, 3, this.team.getMainColorWithRate(this.hp.hpRate()), { strokeColor: this.team.getSubColor(), strokeWidth: 1 });
        canvas.drawCircle(this.position, 9, undefined, { strokeColor: this.team.getMainColorWithRate(this.hp.shieldRate()), strokeWidth: 1 });
    }
    hpSource() {
        return new unitHp.UnitHpWithShield(300, 1, 100);
    }
    spawnersSource() {
        return [];
    }
    attackerSource() {
        return new unitAttack.NormalAttacker(this, { attackCoolDown: 1, attackDamage: 12, attackDistance: grid.BLOCK_SIZE * 3 });
    }
    behaviorSource() {
        return new behavior.TargetPriorityBehavior(this);
    }
    targetFindersSource() {
        return [new targetFinder.AttackTargetFinder(this, new basic.MapBlockDistance(3), 1)];
    }
}

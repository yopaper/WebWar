import * as unit from "./BasicUnit.js";
import * as canvas from "./CanvasHandler.js";
import * as basic from "./Basic.js";
import * as unitMover from "./UnitMover.js";
import * as unitAttack from "./UnitAttacker.js";
import * as unitBehavior from "./UnitBehavior.js";
import * as targetFinder from "./TargetFinder.js";
import * as unitHp from "./UnitHp.js";
import * as grid from "./Grid.js";
export class Fighter extends unit.Unit {
    draw() {
        canvas.drawRectCenter(this.position, new basic.Vector2(5, 5), this.team.getMainColor(), this.team.getSubColor(), 1);
        canvas.drawRectCenter(this.position, new basic.Vector2(3, 3), this.team.getMainColorWithRate(this.hp.hpRate()), null, null);
    }
    unitRank() {
        return 0;
    }
    hpSource() {
        return new unitHp.UnitHp(50, 0);
    }
    moverSource() {
        return new unitMover.NormalUnitMover(this, 1.2);
    }
    attackerSource() {
        return new unitAttack.NormalAttacker(this, {
            attackDamage: 5, attackCoolDown: 1, attackDistance: grid.BLOCK_SIZE * 0.5
        });
    }
    behaviorSource() {
        return new unitBehavior.TargetPriorityBehavior(this);
    }
    targetFindersSource() {
        return [
            new targetFinder.AttackTargetFinder(this, new basic.MapBlockDistance(3), 1),
            new targetFinder.MainTargetFinder(this),
        ];
    }
}
export class Shooter extends unit.Unit {
    draw() {
        canvas.drawDiamond(this.position, new basic.Vector2(7, 7), this.team.getMainColor(), { strokeColor: this.team.getSubColor(), strokeWidth: 1 });
        canvas.drawDiamond(this.position, new basic.Vector2(3, 3), this.team.getMainColorWithRate(this.hp.hpRate()));
    }
    unitRank() {
        return 0;
    }
    hpSource() {
        return new unitHp.UnitHp(40, 0);
    }
    moverSource() {
        return new unitMover.NormalUnitMover(this, 1.2);
    }
    attackerSource() {
        return new unitAttack.NormalAttacker(this, {
            attackDamage: 5, attackCoolDown: 1, attackDistance: grid.BLOCK_SIZE * 2
        });
    }
    behaviorSource() {
        return new unitBehavior.TargetPriorityBehavior(this);
    }
    targetFindersSource() {
        return [
            new targetFinder.AttackTargetFinder(this, new basic.MapBlockDistance(3), 1),
            new targetFinder.MainTargetFinder(this),
        ];
    }
}

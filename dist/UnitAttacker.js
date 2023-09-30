import * as canvas from "./CanvasHandler.js";
export class UnitAttacker {
    constructor(unitOwner) {
        this.unitOwner = unitOwner;
    }
}
export class StaticAttacker extends UnitAttacker {
    constructor(unitOwner) {
        super(unitOwner);
    }
    update() { }
    isAttacking() {
        return false;
    }
}
export class NormalAttacker extends UnitAttacker {
    constructor(unitOwner, attackerInfo) {
        super(unitOwner);
        this.attackCoolDown = 0;
        this.attackDamage = attackerInfo.attackDamage;
        this.attackDistance = attackerInfo.attackDistance;
        this.attackCoolDownMax = attackerInfo.attackCoolDown;
    }
    isAttacking() {
        var target = this.unitOwner.getTarget();
        if (target == null)
            return false;
        var dist = this.unitOwner.position.euclideanDistance(target.position);
        return (dist <= this.attackDistance || this.unitOwner.mapBlockIndex().equal(target.mapBlockIndex()));
    }
    update() {
        this.coolDownCount();
        this.attackTarget();
    }
    coolDownCount() {
        if (this.attackCoolDown <= 0)
            return;
        this.attackCoolDown -= 1 / 30;
    }
    attackTarget() {
        var target = this.unitOwner.getTarget();
        if (!this.isAttacking())
            return;
        if (target == null)
            return;
        if (this.attackCoolDown > 0)
            return;
        this.attackCoolDown = this.attackCoolDownMax;
        target.hp.damage(this.attackDamage);
        canvas.drawLine(this.unitOwner.position, target.position, this.unitOwner.team.getMainColor(), 0);
    }
}

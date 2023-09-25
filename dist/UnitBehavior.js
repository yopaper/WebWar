export class UnitBehavior {
    constructor(unitOwner) {
        this.unitOwner = unitOwner;
    }
}
export class TargetPriorityBehavior extends UnitBehavior {
    constructor(unitOwner, idleAction) {
        super(unitOwner);
        this.idleAction = idleAction;
    }
    update() {
        var target = this.unitOwner.targetIndexPosition();
        if (target != null) {
            this.unitOwner.mover.setTarget(target);
        }
        else if (this.idleAction != undefined) {
            this.idleAction();
        }
    }
}

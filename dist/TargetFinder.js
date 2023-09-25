import * as basic from "./Basic.js";
class TargetFinder {
    constructor() {
        this.target = null;
    }
    getTarget() {
        return this.target;
    }
    targetIndexPosition() {
        if (this.target == null)
            return null;
        return this.target.mapBlockIndex();
    }
}
export class UnitTargetFinder extends TargetFinder {
    constructor(unitOwner) {
        super();
        this.unitOwner = unitOwner;
    }
    update() {
        if (this.target != null && this.loseTargetCondition()) {
            this.target = null;
        }
        else {
            this.findTarget();
        }
    }
    getUnitContainer() {
        return this.unitOwner.mapOwner.unitContainer;
    }
}
class ClosestTargetFinder extends UnitTargetFinder {
    constructor(unitOwner, indexerRange) {
        super(unitOwner);
        this.indexerRange = indexerRange;
    }
    findTarget() {
        var aroundUnits = this.getUnitContainer().getUnitsInRange(this.unitOwner.unitIndexerIndex(), this.indexerRange);
        var filtedUnits = aroundUnits.filter((unit, index, array) => { return this.filterCondition(unit); });
        var closestUnits = [];
        var minDist = Number.POSITIVE_INFINITY;
        for (var i = 0; i < filtedUnits.length; i++) {
            var unit = filtedUnits[i];
            var dist = this.unitOwner.position.euclideanDistance(unit.position);
            if (dist == minDist) {
                closestUnits.push(unit);
            }
            else if (dist < minDist) {
                closestUnits.splice(0, closestUnits.length);
                closestUnits.push(unit);
                minDist = dist;
            }
        }
        if (closestUnits.length <= 0)
            return;
        this.target = closestUnits[basic.randomInt(0, closestUnits.length - 1)];
    }
}
class GlobalTargetFinder extends UnitTargetFinder {
    findTarget() {
        var filtedUnits = this.getUnitContainer().getUnits().filter((unit, index, array) => { return this.filterCondition(unit); });
        if (filtedUnits.length <= 0)
            return;
        this.target = filtedUnits[basic.randomInt(0, filtedUnits.length - 1)];
    }
}
export class AttackTargetFinder extends ClosestTargetFinder {
    constructor(unitOwner, findRange, indexerRange) {
        super(unitOwner, indexerRange);
        this.findRange = findRange;
    }
    filterCondition(unit) {
        var dist = this.unitOwner.position.euclideanDistance(unit.position);
        return (!this.unitOwner.team.same(unit.team) && dist <= this.findRange);
    }
    loseTargetCondition() {
        if (this.target == null)
            return false;
        var dist = this.unitOwner.indexDistanceWithUnit(this.target);
        return (dist == null || dist > this.findRange || this.target.hp.dead() ||
            this.unitOwner.team.same(this.target.team));
    }
}
export class MainTargetFinder extends GlobalTargetFinder {
    filterCondition(unit) {
        return (!this.unitOwner.team.same(unit.team) && unit.unitRank() >= 2);
    }
    loseTargetCondition() {
        if (this.target == null)
            return false;
        return (this.unitOwner.team.same(this.target.team) || this.target.hp.dead());
    }
}

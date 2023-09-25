import * as grid from "./Grid.js";
import * as unitMover from "./UnitMover.js";
export class Unit {
    constructor(mapOwner, team, position) {
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
    }
    update() {
        this.draw();
        this.mover.update();
        this.attacker.update();
        this.behavior.update();
        for (var i = 0; i < this.targetFinders.length; i++)
            this.targetFinders[i].update();
        for (var i = 0; i < this.spawners.length; i++)
            this.spawners[i].update();
    }
    mapBlockIndex() {
        return grid.mapBlockGrid.realToIndex(this.position);
    }
    unitIndexerIndex() {
        return grid.unitIndexerGrid.realToIndex(this.position);
    }
    standedBlock() {
        return this.mapOwner.getBlockWithPosition(this.mapBlockIndex());
    }
    getTarget() {
        for (var i = 0; i < this.targetFinders.length; i++) {
            var target = this.targetFinders[i].getTarget();
            if (target != null)
                return target;
        }
        return null;
    }
    targetIndexPosition() {
        for (var i = 0; i < this.targetFinders.length; i++) {
            var target = this.targetFinders[i].targetIndexPosition();
            if (target != null)
                return target;
        }
        return null;
    }
    indexDistanceWithIndex(indexPosition) {
        return this.mapOwner.pathHandler.getDistance(this.mapBlockIndex(), indexPosition);
    }
    indexDistanceWithUnit(unit) {
        return this.indexDistanceWithIndex(unit.mapBlockIndex());
    }
    spawnersSource() {
        return [];
    }
}
export class BuildingUnit extends Unit {
    constructor(mapOwner, team, indexPosition) {
        super(mapOwner, team, grid.mapBlockGrid.indexToReal(indexPosition));
    }
    moverSource() {
        return new unitMover.StaticUnitMover(this);
    }
}

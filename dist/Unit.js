import * as grid from "./Grid.js";
export class Unit {
    constructor(mapOwner, team, position) {
        this.mapOwner = mapOwner;
        this.team = team;
        this.position = position;
        this.spawners = this.spawnersSource();
        mapOwner.unitContainer.addUnit(this);
    }
    update() {
        this.draw();
        for (var i = 0; i < this.spawners.length; i++)
            this.spawners[i].update();
    }
    indexPosition() {
        return grid.mapBlockGrid.realToIndex(this.position);
    }
    standedBlock() {
        return this.mapOwner.getBlockWithPosition(this.indexPosition());
    }
    spawnersSource() {
        return [];
    }
}
export class BuildingUnit extends Unit {
    constructor(mapOwner, team, indexPosition) {
        super(mapOwner, team, grid.mapBlockGrid.indexToReal(indexPosition));
        mapOwner.unitContainer.addBuilding(this);
    }
}

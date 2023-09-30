import * as basic from "./Basic.js";
import * as grid from "./Grid.js";
import * as canvas from "./CanvasHandler.js";
import * as unitUtils from "./UnitUtils.js";
const DEBUG_ENABLE = false;
export class UnitContainer {
    constructor(mapOwner) {
        this.indexerTable = new basic.Table2D();
        this.unitsList = [];
        this.mapOwner = mapOwner;
    }
    update() {
        this.removeDeadUnit();
        this.clearIndexer();
        this.indexerLoadUnits();
        for (var i = 0; i < this.unitsList.length; i++) {
            this.unitsList[i].update();
        }
        this.debugDraw();
    }
    addUnit(unit) {
        if (this.unitsList.indexOf(unit) >= 0)
            return;
        this.unitsList.push(unit);
    }
    getUnits() {
        return Array.from(this.unitsList);
    }
    getUnitsOn(index) {
        var units = this.indexerTable.Get(index.getX(), index.getY());
        if (units == null)
            return [];
        return Array.from(units);
    }
    getUnitsInRange(center, range) {
        var units = [];
        for (var dx = -range; dx <= range; dx++) {
            for (var dy = -range; dy <= range; dy++) {
                units = units.concat(this.getUnitsOn(center.getOffset(dx, dy)));
            }
        }
        return units;
    }
    removeDeadUnit() {
        unitUtils.removeDeadUnitFromArray(this.unitsList);
    }
    indexerLoadUnits() {
        var _a;
        var checkArray = (index) => {
            if (this.indexerTable.GetWithVector(index) != null)
                return;
            this.indexerTable.SetWithVector(index, []);
        };
        for (var i = 0; i < this.unitsList.length; i++) {
            var unit = this.unitsList[i];
            var unitIndexerIndex = grid.unitIndexerGrid.realToIndex(unit.position);
            checkArray(unitIndexerIndex);
            (_a = this.indexerTable.GetWithVector(unitIndexerIndex)) === null || _a === void 0 ? void 0 : _a.push(unit);
        }
    }
    clearIndexer() {
        this.indexerTable.clear();
    }
    debugDraw() {
        if (!DEBUG_ENABLE)
            return;
        var indexList = this.indexerTable.GetAllKeys();
        for (var i = 0; i < indexList.length; i++) {
            var index = indexList[i];
            var units = this.indexerTable.Get(index.x, index.y);
            var indexerPosition = grid.unitIndexerGrid.indexToReal(new basic.Vector2Int(index.x, index.y));
            if (units == null)
                continue;
            for (var j = 0; j < units.length; j++) {
                var unit = units[j];
                canvas.drawLine(unit.position, indexerPosition, "#FFFF00", 1);
            }
        }
    }
}

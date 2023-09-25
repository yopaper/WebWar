import * as basic from "./Basic.js";
import * as canvas from "./CanvasHandler.js";
import { BLOCK_SIZE } from "./Grid.js";
export class PathHandler {
    constructor(mapOwner) {
        this.pathTable = new basic.Table2D();
        this.mapOwner = mapOwner;
    }
    getBlockPath(x, y) {
        if (this.mapOwner.getBlock(x, y) == null)
            return null;
        if (this.pathTable.Get(x, y) == null) {
            this.pathTable.Set(x, y, new BlockPath(this, new basic.Vector2(x, y)));
        }
        return this.pathTable.Get(x, y);
    }
    getBlockPathWithPosition(position) {
        return this.getBlockPath(position.x, position.y);
    }
    getDistance(start, target) {
        if (this.mapOwner.getBlock(start.x, start.y) == null)
            return null;
        if (this.mapOwner.getBlock(target.x, target.y) == null)
            return null;
        var path = this.getBlockPath(target.x, target.y);
        if (path == null)
            return null;
        return path.getDistance(start.x, start.y);
    }
}
export class BlockPath {
    constructor(handlerOwner, indexPosition) {
        this.maxDistance = 0;
        this.distTable = new basic.Table2D();
        console.log(`建立(${indexPosition.x}, ${indexPosition.y})距離表`);
        this.handlerOwner = handlerOwner;
        this.mapOwner = handlerOwner.mapOwner;
        this.indexPosition = indexPosition;
        this.buildTable();
    }
    getDistance(x, y) {
        return this.distTable.Get(x, y);
    }
    getDistanceWithPosition(position) {
        return this.getDistance(position.x, position.y);
    }
    getNextStepToThis(position) {
        var currentDist = this.getDistanceWithPosition(position);
        if (currentDist == null)
            return null;
        var adjacentPosList = position.getAdjacent();
        var nextPosList = [];
        for (var i = 0; i < adjacentPosList.length; i++) {
            var adjPos = adjacentPosList[i];
            if (this.getDistanceWithPosition(adjPos) != currentDist - 1)
                continue;
            nextPosList.push(adjPos);
        }
        if (nextPosList.length <= 0)
            return null;
        return nextPosList[basic.randomInt(0, nextPosList.length - 1)];
    }
    getNextBlockToThis(position) {
        var nextStep = this.getNextStepToThis(position);
        if (nextStep == null)
            return null;
        return this.mapOwner.getBlockWithPosition(nextStep);
    }
    getMapBlock() {
        return this.mapOwner.getBlockWithPosition(this.indexPosition);
    }
    distanceDebugDraw() {
        var _a;
        var keyList = this.distTable.GetAllKeys();
        for (var i = 0; i < keyList.length; i++) {
            var key = keyList[i];
            var dist = this.distTable.Get(key.x, key.y);
            var pos = (_a = this.mapOwner.getBlock(key.x, key.y)) === null || _a === void 0 ? void 0 : _a.realPosition();
            var distRate = dist / this.maxDistance;
            var color = basic.hToColor(distRate);
            canvas.drawRectCenter(pos, new basic.Vector2(BLOCK_SIZE * 0.9, BLOCK_SIZE * 0.9), null, color, 1);
        }
    }
    buildTable() {
        var indexToProcess = [{ x: this.indexPosition.x, y: this.indexPosition.y }];
        var procedssedIndex = new basic.Table2D();
        this.distTable.Set(this.indexPosition.x, this.indexPosition.y, 0);
        var addIndex = (index) => {
            if (procedssedIndex.Get(index.x, index.y) != null || this.distTable.Get(index.x, index.y) != null)
                return;
            indexToProcess.push(index);
            procedssedIndex.Set(index.x, index.y, true);
        };
        var process = (index) => {
            if (this.mapOwner.getBlock(index.x, index.y) == null)
                return;
            var adjacentList = new basic.Vector2(index.x, index.y).getAdjacentDict();
            var minDist = null;
            for (var i = 0; i < adjacentList.length; i++) {
                var adjacent = adjacentList[i];
                addIndex(adjacent);
                var adjDist = this.distTable.Get(adjacent.x, adjacent.y);
                if (adjDist == null)
                    continue;
                if (minDist == null || adjDist < minDist) {
                    minDist = adjDist;
                }
            }
            if (minDist == null)
                return;
            this.distTable.Set(index.x, index.y, minDist + 1);
            if (minDist + 1 > this.maxDistance)
                this.maxDistance = minDist + 1;
        };
        while (indexToProcess.length > 0) {
            process(indexToProcess[0]);
            indexToProcess.splice(0, 1);
        }
        console.log("建立完成!");
    }
}

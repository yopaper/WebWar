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
            this.pathTable.Set(x, y, new BlockPath(this, new basic.Vector2Int(x, y)));
        }
        return this.pathTable.Get(x, y);
    }
    getBlockPathWithVector(position) {
        return this.getBlockPath(position.getX(), position.getY());
    }
    getDistance(start, target) {
        if (this.mapOwner.getBlock(start.getX(), start.getY()) == null)
            return basic.MapBlockDistance.inaccessible();
        if (this.mapOwner.getBlock(target.getX(), target.getY()) == null)
            return basic.MapBlockDistance.inaccessible();
        var path = this.getBlockPath(target.getX(), target.getY());
        if (path == null)
            return basic.MapBlockDistance.inaccessible();
        return path.getDistance(start.getX(), start.getY());
    }
}
export class BlockPath {
    constructor(handlerOwner, indexPosition) {
        this.maxDistance = 0;
        this.distTable = new basic.Table2D();
        console.log(`建立(${indexPosition.getX()}, ${indexPosition.getY()})距離表`);
        this.handlerOwner = handlerOwner;
        this.mapOwner = handlerOwner.mapOwner;
        this.indexPosition = indexPosition.copy();
        this.buildTable();
    }
    getDistance(x, y) {
        var dist = this.distTable.Get(x, y);
        if (dist != null)
            return new basic.MapBlockDistance(dist);
        return new basic.MapBlockDistance(Number.POSITIVE_INFINITY);
    }
    getDistanceWithPosition(position) {
        return this.getDistance(position.getX(), position.getY());
    }
    getNextStepToThis(position) {
        var currentDist = this.getDistanceWithPosition(position).getBlockDistance();
        if (currentDist == null)
            return null;
        var adjacentPosList = position.getAdjacent();
        var nextPosList = [];
        for (var i = 0; i < adjacentPosList.length; i++) {
            var adjPos = adjacentPosList[i];
            if (this.getDistanceWithPosition(adjPos).getBlockDistance() != currentDist - 1)
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
        return this.mapOwner.getBlockWithIndex(nextStep);
    }
    getMapBlock() {
        return this.mapOwner.getBlockWithIndex(this.indexPosition);
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
        var indexToProcess = [{ x: this.indexPosition.getX(), y: this.indexPosition.getY() }];
        var procedssedIndex = new basic.Table2D();
        this.distTable.Set(this.indexPosition.getX(), this.indexPosition.getY(), 0);
        var addIndex = (index) => {
            if (procedssedIndex.Get(index.x, index.y) != null || this.distTable.Get(index.x, index.y) != null)
                return;
            indexToProcess.push(index);
            procedssedIndex.Set(index.x, index.y, true);
        };
        var process = (index) => {
            if (this.mapOwner.getBlock(index.x, index.y) == null)
                return;
            var adjacentList = new basic.Vector2Int(index.x, index.y).getAdjacentDict();
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

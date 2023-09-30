import * as basic from "./Basic.js";
import * as canvas from "./CanvasHandler.js";
import * as grid from "./Grid.js";
export class MapBlock {
    constructor(mapOwner, indexPosition) {
        this.mapOwner = mapOwner;
        this.indexPosition = indexPosition;
        mapOwner.addBlock(this);
    }
    realPosition() {
        return grid.mapBlockGrid.indexToReal(this.indexPosition);
    }
    randomPositionOn() {
        return this.realPosition().getOffset((Math.random() * 2 - 1) * grid.BLOCK_SIZE / 2.25, (Math.random() * 2 - 1) * grid.BLOCK_SIZE / 2.25);
    }
    getAdjacentBlockWithOffset(offset) {
        var index = this.indexPosition.getOffset(offset.getX(), offset.getY());
        return this.mapOwner.getBlockWithIndex(index);
    }
    getPath() {
        return this.mapOwner.pathHandler.getBlockPath(this.indexPosition.getX(), this.indexPosition.getY());
    }
    draw() {
        canvas.drawRectCenter(this.realPosition(), new basic.Vector2(grid.BLOCK_SIZE, grid.BLOCK_SIZE), "#DDDDDD", "#BBBBBB", 1);
    }
}

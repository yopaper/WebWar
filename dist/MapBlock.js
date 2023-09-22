import * as canvas from "./CanvasHandler.js";
import * as grid from "./Grid.js";
export class MapBlock {
    constructor(mapOwner, position) {
        this.mapOwner = mapOwner;
        this.indexPosition = position;
        mapOwner.addBlock(this);
    }
    realPosition() {
        return grid.mapBlockGrid.indexToReal(this.indexPosition);
    }
    draw() {
        var pos1 = this.realPosition().getOffset(-grid.BLOCK_SIZE / 2, -grid.BLOCK_SIZE / 2);
        var pos2 = pos1.getOffset(grid.BLOCK_SIZE, grid.BLOCK_SIZE);
        canvas.drawRect(pos1, pos2, "#DDDDDD", "#BBBBBB", 1);
    }
}

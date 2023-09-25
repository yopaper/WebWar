import * as basic from "./Basic.js";
import * as path from "./PathHandler.js";
import { UnitContainer } from "./UnitContainer.js";
export class WarMap {
    constructor() {
        this.pathHandler = new path.PathHandler(this);
        this.unitContainer = new UnitContainer(this);
        this.blocksTable = new basic.Table2D();
    }
    update() {
        this.drawAllBlock();
        this.unitContainer.update();
    }
    getBlocks() {
        return this.blocksTable.GetAllValues();
    }
    getBlockWithPosition(position) {
        return this.blocksTable.Get(position.x, position.y);
    }
    getBlock(x, y) {
        return this.blocksTable.Get(x, y);
    }
    addBlock(block) {
        this.blocksTable.Set(block.indexPosition.x, block.indexPosition.y, block);
    }
    drawAllBlock() {
        var blocks = this.blocksTable.GetAllValues();
        for (var i = 0; i < blocks.length; i++) {
            blocks[i].draw();
        }
    }
}

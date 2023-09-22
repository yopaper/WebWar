export class WarMap {
    constructor() {
        this.blocksTable = {};
        this.blocksList = [];
    }
    getBlocks() {
        return Array.from(this.blocksList);
    }
    getBlock(position) {
        if (!(position.x in this.blocksTable))
            return null;
        if (!(position.y in this.blocksTable[position.x]))
            return null;
        return this.blocksTable[position.x][position.y];
    }
    addBlock(block) {
        var position = block.position;
        if (!(position.x in this.blocksTable))
            this.blocksTable[position.x] = {};
        this.blocksTable[position.x][position.y] = block;
    }
}

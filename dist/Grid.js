import * as basic from "./Basic.js";
export const BLOCK_SIZE = 30;
export class Grid {
    constructor(gridSize) {
        this.gridSize = gridSize;
    }
    realToIndex(position) {
        return new basic.Position(Math.round(position.x / this.gridSize), Math.round(position.y / this.gridSize));
    }
    indexToReal(index) {
        return new basic.Position(index.x * this.gridSize, index.y * this.gridSize);
    }
}
export var mapBlockGrid = new Grid(BLOCK_SIZE);

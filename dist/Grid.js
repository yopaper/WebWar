import * as basic from "./Basic.js";
export const BLOCK_SIZE = 30;
export const INDEXER_GRID_SIZE = BLOCK_SIZE * 5;
export class Grid {
    constructor(gridSize) {
        this.gridSize = gridSize;
    }
    realToIndex(position) {
        return new basic.Vector2(Math.round(position.x / this.gridSize), Math.round(position.y / this.gridSize));
    }
    indexToReal(index) {
        return new basic.Vector2(index.x * this.gridSize, index.y * this.gridSize);
    }
}
export const mapBlockGrid = new Grid(BLOCK_SIZE);
export const unitIndexerGrid = new Grid(INDEXER_GRID_SIZE);

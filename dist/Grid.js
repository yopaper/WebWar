import * as basic from "./Basic.js";
export const BLOCK_SIZE = 30;
export const INDEXER_GRID_SIZE = BLOCK_SIZE * 5;
export class Grid {
    constructor(gridSize) {
        this.gridSize = gridSize;
    }
    realToIndex(position) {
        return new basic.Vector2Int(Math.round(position.getX() / this.gridSize), Math.round(position.getY() / this.gridSize));
    }
    indexToReal(index) {
        return new basic.Vector2(index.getX() * this.gridSize, index.getY() * this.gridSize);
    }
}
export const mapBlockGrid = new Grid(BLOCK_SIZE);
export const unitIndexerGrid = new Grid(INDEXER_GRID_SIZE);

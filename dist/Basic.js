export class Position {
    constructor(x, y) {
        this.x = Math.round(x);
        this.y = Math.round(y);
    }
    getOffset(deltax, deltay) {
        return new Position(this.x + deltax, this.y + deltay);
    }
}

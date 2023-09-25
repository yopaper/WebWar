export function hToColor(h) {
    h = h * Math.PI;
    var degreeToColorValue = (offset) => {
        return Math.round(255 * (Math.cos(h + offset) + 1) / 2);
    };
    var red = degreeToColorValue(0);
    var green = degreeToColorValue(Math.PI * 2 / 3);
    var blue = degreeToColorValue(Math.PI * 4 / 3);
    return `rgb(${red}, ${green}, ${blue})`;
}
export function rgbFormatToStringColor(color) {
    var getColorValue = (v) => {
        return Math.round(255 * v);
    };
    return `rgb(${getColorValue(color.r)}, ${getColorValue(color.g)}, ${getColorValue(color.b)})`;
}
export function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}
export class Vector2 {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        this.set(x, y);
    }
    copy() {
        return new Vector2(this.x, this.y);
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    setWithVector(vector) {
        this.set(vector.x, vector.y);
    }
    change(deltax, deltay) {
        this.set(this.x + deltax, this.y + deltay);
    }
    getOffset(deltax, deltay) {
        return new Vector2(this.x + deltax, this.y + deltay);
    }
    simpleDistance(position) {
        return Math.abs(position.x - this.x) + Math.abs(position.y - this.y);
    }
    euclideanDistance(position) {
        return Math.sqrt(Math.pow(position.x - this.x, 2) + Math.pow(position.y - this.y, 2));
    }
    equal(vector) {
        return (this.x == vector.x && this.y == vector.y);
    }
    getAdjacent() {
        return [this.getOffset(0, 1), this.getOffset(1, 0),
            this.getOffset(0, -1), this.getOffset(-1, 0)];
    }
    getAdjacentDict() {
        var adjacent = this.getAdjacent();
        return [adjacent[0].toDictFormat(), adjacent[1].toDictFormat(),
            adjacent[2].toDictFormat(), adjacent[3].toDictFormat()];
    }
    toDictFormat() {
        return { x: this.x, y: this.y };
    }
}
export class Table2D {
    constructor() {
        this.valueTable = new Map();
        this.keyTable = new Map();
    }
    Set(x, y, value) {
        var _a, _b, _c;
        x = Math.round(x);
        y = Math.round(y);
        var key = { x: x, y: y };
        if (!this.keyTable.has(value)) {
            this.keyTable.set(value, []);
        }
        if (((_a = this.keyTable.get(value)) === null || _a === void 0 ? void 0 : _a.indexOf(key)) < 0) {
            (_b = this.keyTable.get(value)) === null || _b === void 0 ? void 0 : _b.push(key);
        }
        if (!this.valueTable.has(x))
            this.valueTable.set(x, new Map());
        (_c = this.valueTable.get(x)) === null || _c === void 0 ? void 0 : _c.set(y, value);
    }
    Get(x, y) {
        var _a, _b;
        x = Math.round(x);
        y = Math.round(y);
        if (!this.valueTable.has(x))
            return null;
        if (!((_a = this.valueTable.get(x)) === null || _a === void 0 ? void 0 : _a.has(y)))
            return null;
        return (_b = this.valueTable.get(x)) === null || _b === void 0 ? void 0 : _b.get(y);
    }
    GetAllValues() {
        return Array.from(this.keyTable.keys());
    }
    GetAllKeys() {
        var keyList = [];
        var xList = Array.from(this.valueTable.keys());
        for (var i = 0; i < xList.length; i++) {
            var x = xList[i];
            var mapInX = this.valueTable.get(x);
            var yList = Array.from(mapInX.keys());
            for (var j = 0; j < yList.length; j++) {
                var y = yList[j];
                keyList.push({ x: x, y: y });
            }
        }
        return keyList;
    }
    RemoveValue(value) {
        var _a;
        if (!this.keyTable.has(value))
            return;
        var keyList = this.keyTable.get(value);
        for (var i = 0; i < keyList.length; i++) {
            var key = keyList[i];
            (_a = this.valueTable.get(key.x)) === null || _a === void 0 ? void 0 : _a.delete(key.y);
        }
        this.keyTable.delete(value);
    }
    clear() {
        var _a;
        var xList = Array.from(this.valueTable.keys());
        for (var i = 0; i < xList.length; i++) {
            var xMap = (_a = this.valueTable.get(xList[i])) === null || _a === void 0 ? void 0 : _a.clear();
        }
    }
}

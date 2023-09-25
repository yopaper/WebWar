import * as basic from "./Basic.js";
import * as grid from "./Grid.js";
var canvas;
var canvasOffset = new basic.Vector2(0, 0);
var canvasScale = 1;
var canvasContext;
export var mousePosition = new basic.Vector2(0, 0);
export var mouseIndex = new basic.Vector2(0, 0);
export function getCanvas() {
    return canvas;
}
export function buildCanvas(parentObject, width, height) {
    canvas = document.createElement("canvas");
    canvasContext = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    parentObject.appendChild(canvas);
    canvas.addEventListener("mousemove", mouseMove);
    console.log(`建立大小為:(${width}x${height})的Canvas`);
    return canvas;
}
export function getPosOnCanvas(position) {
    return new basic.Vector2((position.x + canvasOffset.x) * canvasScale, (position.y + canvasOffset.y) * canvasScale);
}
export function getScaleSize(size) {
    return new basic.Vector2(size.x * canvasScale, size.y * canvasScale);
}
export function startPath(position) {
    position = getPosOnCanvas(position);
    canvasContext.save();
    canvasContext.beginPath();
    canvasContext.moveTo(position.x, position.y);
}
export function lineTo(position) {
    position = getPosOnCanvas(position);
    canvasContext.lineTo(position.x, position.y);
}
export function endPath(fillColor, stroke) {
    canvasContext.closePath();
    if (fillColor != undefined) {
        canvasContext.fillStyle = fillColor;
        canvasContext.fill();
    }
    if (stroke != undefined) {
        canvasContext.lineWidth = stroke.strokeWidth;
        canvasContext.strokeStyle = stroke.strokeColor;
        canvasContext.stroke();
    }
    canvasContext.restore();
}
export function drawDiamond(position, size, fillColor, stroke) {
    size = new basic.Vector2(size.x / 2, size.y / 2);
    startPath(position.getOffset(size.x, 0));
    lineTo(position.getOffset(0, size.y));
    lineTo(position.getOffset(-size.x, 0));
    lineTo(position.getOffset(0, -size.y));
    endPath(fillColor, stroke);
}
export function drawRectCenter(position, size, fillColor, strokeColor, strokeWidth) {
    canvasContext.save();
    position = getPosOnCanvas(position);
    size = getScaleSize(size);
    position = position.getOffset(-size.x / 2, -size.y / 2);
    if (fillColor != null) {
        canvasContext.fillStyle = fillColor;
        canvasContext.fillRect(position.x, position.y, size.x, size.y);
    }
    if (strokeColor != null && strokeWidth != null) {
        canvasContext.strokeStyle = strokeColor;
        canvasContext.lineWidth = strokeWidth;
        canvasContext.strokeRect(position.x, position.y, size.x, size.y);
    }
    canvasContext.restore();
}
export function drawRect(position1, position2, fillColor, strokeColor, strokeWidth) {
    var size = new basic.Vector2(position2.x - position1.x, position2.y - position1.y);
    drawRectCenter(position1.getOffset(size.x / 2, size.y / 2), size, fillColor, strokeColor, strokeWidth);
}
export function drawLine(position1, position2, lineColor, lineWidth) {
    position1 = getPosOnCanvas(position1);
    position2 = getPosOnCanvas(position2);
    canvasContext.save();
    canvasContext.strokeStyle = lineColor;
    canvasContext.lineWidth = lineWidth;
    canvasContext.beginPath();
    canvasContext.moveTo(position1.x, position1.y);
    canvasContext.lineTo(position2.x, position2.y);
    canvasContext.stroke();
    canvasContext.closePath();
    canvasContext.restore();
}
export function clearCanvas() {
    canvasContext.save();
    canvasContext.fillStyle = "#000000";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.restore();
}
function mouseMove(e) {
    mousePosition.set(e.offsetX, e.offsetY);
    var mindex = grid.mapBlockGrid.realToIndex(mousePosition);
    mouseIndex.set(mindex.x, mindex.y);
}

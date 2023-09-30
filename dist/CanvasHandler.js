import * as basic from "./Basic.js";
import * as grid from "./Grid.js";
var canvas;
var canvasOffset = new basic.Vector2(600, 500);
var canvasScale = 1;
var canvasContext;
export var mousePosition = new basic.Vector2(0, 0);
export var mouseIndex = new basic.Vector2Int(0, 0);
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
    return new basic.Vector2((position.getX() + canvasOffset.getX()) * canvasScale, (position.getY() + canvasOffset.getY()) * canvasScale);
}
export function getScaleSize(size) {
    return new basic.Vector2(size.getX() * canvasScale, size.getY() * canvasScale);
}
export function startPath(position) {
    position = getPosOnCanvas(position);
    canvasContext.save();
    canvasContext.beginPath();
    canvasContext.moveTo(position.getX(), position.getY());
}
export function lineTo(position) {
    position = getPosOnCanvas(position);
    canvasContext.lineTo(position.getX(), position.getY());
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
    size = new basic.Vector2(size.getX() / 2, size.getY() / 2);
    startPath(position.getOffset(size.getX(), 0));
    lineTo(position.getOffset(0, size.getY()));
    lineTo(position.getOffset(-size.getX(), 0));
    lineTo(position.getOffset(0, -size.getY()));
    endPath(fillColor, stroke);
}
export function drawRectCenter(position, size, fillColor, strokeColor, strokeWidth) {
    canvasContext.save();
    position = getPosOnCanvas(position);
    size = getScaleSize(size);
    position = position.getOffset(-size.getX() / 2, -size.getY() / 2);
    if (fillColor != null) {
        canvasContext.fillStyle = fillColor;
        canvasContext.fillRect(position.getX(), position.getY(), size.getX(), size.getY());
    }
    if (strokeColor != null && strokeWidth != null) {
        canvasContext.strokeStyle = strokeColor;
        canvasContext.lineWidth = strokeWidth;
        canvasContext.strokeRect(position.getX(), position.getY(), size.getX(), size.getY());
    }
    canvasContext.restore();
}
export function drawRect(position1, position2, fillColor, strokeColor, strokeWidth) {
    var size = new basic.Vector2(position2.getX() - position1.getX(), position2.getY() - position1.getY());
    drawRectCenter(position1.getOffset(size.getX() / 2, size.getY() / 2), size, fillColor, strokeColor, strokeWidth);
}
export function drawLine(position1, position2, lineColor, lineWidth) {
    position1 = getPosOnCanvas(position1);
    position2 = getPosOnCanvas(position2);
    canvasContext.save();
    canvasContext.strokeStyle = lineColor;
    canvasContext.lineWidth = lineWidth;
    canvasContext.beginPath();
    canvasContext.moveTo(position1.getX(), position1.getY());
    canvasContext.lineTo(position2.getX(), position2.getY());
    canvasContext.stroke();
    canvasContext.closePath();
    canvasContext.restore();
}
export function drawCircle(position, size, fillColor, stroke) {
    position = getPosOnCanvas(position);
    size = size * canvasScale;
    canvasContext.save();
    canvasContext.beginPath();
    canvasContext.arc(position.getX(), position.getY(), size, 0, 2 * Math.PI);
    endPath(fillColor, stroke);
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
    mouseIndex.set(mindex.getX(), mindex.getY());
}

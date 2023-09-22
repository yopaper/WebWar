import * as basic from "./Basic";
var canvas;
var canvasOffset;
var canvasScale;
var canvasContext;
export function getCanvas() {
    return canvas;
}
export function buildCanvas(parentObject, width, height) {
    canvas = new HTMLCanvasElement();
    canvasContext = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    parentObject.appendChild(canvas);
    return canvas;
}
export function getPosOnCanvas(position) {
    return new basic.Position((position.x + canvasOffset.x) * canvasScale, (position.y + canvasOffset.y) * canvasScale);
}
export function drawRect(position1, position2, fillColor, strokeColor, strokeWidth) {
    canvasContext.save();
    position1 = getPosOnCanvas(position1);
    position2 = getPosOnCanvas(position2);
    var rectSize = new basic.Position(position2.x - position1.x, position2.y - position1.y);
    if (fillColor != null) {
        canvasContext.fillStyle = fillColor;
        canvasContext.fillRect(position1.x, position1.y, rectSize.x, rectSize.y);
    }
    if (strokeColor != null && strokeWidth != null) {
        canvasContext.strokeStyle = strokeColor;
        canvasContext.lineWidth = strokeWidth;
        canvasContext.strokeRect(position1.x, position1.y, rectSize.x, rectSize.y);
    }
    canvasContext.restore();
}
export function clearCanvas() {
    canvasContext.save();
    canvasContext.fillStyle = "#000000";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.restore();
}

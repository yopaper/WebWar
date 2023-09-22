import * as basic from "./Basic";

var canvas          : HTMLCanvasElement;
var canvasOffset    : basic.Position;
var canvasScale     : number;
var canvasContext   : CanvasRenderingContext2D;
//------------------------------------------------
export function getCanvas():HTMLCanvasElement{
    return canvas;
}//-----------------------------------------------
export function buildCanvas( parentObject:HTMLElement, width:number, height:number ):HTMLCanvasElement{
    canvas = new HTMLCanvasElement();
    canvasContext = canvas.getContext("2d")as CanvasRenderingContext2D;
    canvas.width = width;
    canvas.height = height;
    parentObject.appendChild(canvas);
    return canvas;
}//-----------------------------------------------
export function getPosOnCanvas( position:basic.Position ):basic.Position{
    return new basic.Position(
        (position.x + canvasOffset.x)*canvasScale,
        (position.y + canvasOffset.y)*canvasScale );
}//-----------------------------------------------
export function drawRect(
    position1:basic.Position, position2:basic.Position,
    fillColor:string|null, strokeColor:string|null, strokeWidth:number|null):void
    {
    canvasContext.save();
    position1 = getPosOnCanvas( position1 );
    position2 = getPosOnCanvas( position2 );
    var rectSize = new basic.Position(
        position2.x - position1.x,
        position2.y - position1.y
     );
    if( fillColor!=null ){
        canvasContext.fillStyle = fillColor;
        canvasContext.fillRect( position1.x, position1.y, rectSize.x, rectSize.y );
    }
    if( strokeColor!=null && strokeWidth!=null ){
        canvasContext.strokeStyle = strokeColor;
        canvasContext.lineWidth = strokeWidth;
        canvasContext.strokeRect( position1.x, position1.y, rectSize.x, rectSize.y );
    }
    canvasContext.restore();
}//-----------------------------------------------
export function clearCanvas():void{
    canvasContext.save();
    canvasContext.fillStyle = "#000000";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.restore();
}//-----------------------------------------------
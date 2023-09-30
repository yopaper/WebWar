import * as basic from "./Basic.js"
import * as grid from "./Grid.js"

var canvas          : HTMLCanvasElement;
var canvasOffset    : basic.Vector2 = new basic.Vector2(600, 500);
var canvasScale     : number = 1;
var canvasContext   : CanvasRenderingContext2D;

export var mousePosition    : basic.Vector2 = new basic.Vector2(0, 0);
export var mouseIndex       : basic.Vector2Int = new basic.Vector2Int(0, 0);
//------------------------------------------------
export function getCanvas():HTMLCanvasElement{
    return canvas;
}//-----------------------------------------------
export function buildCanvas( parentObject:HTMLElement, width:number, height:number ):HTMLCanvasElement{
    canvas = document.createElement("canvas");
    canvasContext = canvas.getContext("2d")as CanvasRenderingContext2D;
    canvas.width = width;
    canvas.height = height;
    parentObject.appendChild(canvas);
    canvas.addEventListener("mousemove", mouseMove);
    console.log(`建立大小為:(${width}x${height})的Canvas`);
    return canvas;
}//-----------------------------------------------
export function getPosOnCanvas( position:basic.Vector2 ):basic.Vector2{
    return new basic.Vector2(
        (position.getX() + canvasOffset.getX())*canvasScale,
        (position.getY() + canvasOffset.getY())*canvasScale );
}//-----------------------------------------------
export function getScaleSize( size:basic.Vector2 ):basic.Vector2{
    return new basic.Vector2(
        size.getX()*canvasScale,
        size.getY()*canvasScale
    );
}//-----------------------------------------------
export function startPath(position:basic.Vector2):void{
    position = getPosOnCanvas(position);
    canvasContext.save();
    canvasContext.beginPath();
    canvasContext.moveTo( position.getX(), position.getY() );
}//-----------------------------------------------
export function lineTo(position:basic.Vector2):void{
    position = getPosOnCanvas(position);
    canvasContext.lineTo( position.getX(), position.getY() );
}//-----------------------------------------------
export function endPath(fillColor?:string, stroke?:{strokeColor:string, strokeWidth:number}):void{
    canvasContext.closePath();
    if( fillColor!=undefined ){
        canvasContext.fillStyle = fillColor;
        canvasContext.fill();
    }
    if( stroke!=undefined ){
        canvasContext.lineWidth = stroke.strokeWidth;
        canvasContext.strokeStyle = stroke.strokeColor;
        canvasContext.stroke();
    }
    canvasContext.restore();
}//-----------------------------------------------
export function drawDiamond(
    position:basic.Vector2, size:basic.Vector2,
    fillColor?:string, stroke?:{strokeColor:string, strokeWidth:number}
){
    size = new basic.Vector2(size.getX()/2, size.getY()/2);
    //size = getScaleSize( size );
    startPath( position.getOffset(size.getX(), 0) );
    lineTo( position.getOffset(0, size.getY()) );
    lineTo( position.getOffset(-size.getX(), 0) );
    lineTo( position.getOffset(0, -size.getY()) );
    endPath( fillColor, stroke );
}//----------------------------------------------
export function drawRectCenter(
    position:basic.Vector2, size:basic.Vector2,
    fillColor:string|null, strokeColor:string|null, strokeWidth:number|null
    ):void{
    canvasContext.save();
    position = getPosOnCanvas(position);
    size = getScaleSize(size);
    position = position.getOffset( -size.getX()/2, -size.getY()/2 );
    if( fillColor!=null ){
        canvasContext.fillStyle = fillColor;
        canvasContext.fillRect( position.getX() ,position.getY(), size.getX(), size.getY() );
    }
    if( strokeColor!=null && strokeWidth!=null ){
        canvasContext.strokeStyle = strokeColor;
        canvasContext.lineWidth = strokeWidth;
        canvasContext.strokeRect( position.getX() ,position.getY(), size.getX(), size.getY() );
    }
    canvasContext.restore();
}//-----------------------------------------------
export function drawRect(
    position1:basic.Vector2, position2:basic.Vector2,
    fillColor:string|null, strokeColor:string|null, strokeWidth:number|null
    ):void{
    var size = new basic.Vector2( position2.getX() - position1.getX(), position2.getY() - position1.getY() );
    drawRectCenter( position1.getOffset(size.getX()/2, size.getY()/2), size, fillColor, strokeColor, strokeWidth );
}//-----------------------------------------------
export function drawLine(
    position1:basic.Vector2, position2:basic.Vector2,
    lineColor:string, lineWidth:number ):void
{
    position1 = getPosOnCanvas(position1);
    position2 = getPosOnCanvas(position2);
    canvasContext.save();
    canvasContext.strokeStyle = lineColor;
    canvasContext.lineWidth = lineWidth;
    canvasContext.beginPath();
    canvasContext.moveTo( position1.getX(), position1.getY() );
    canvasContext.lineTo( position2.getX(), position2.getY() );
    canvasContext.stroke();
    canvasContext.closePath();
    canvasContext.restore();
}//-----------------------------------------------
export function drawCircle(
    position:basic.Vector2, size:number,
    fillColor?:string, stroke?:{strokeColor:string, strokeWidth:number} ):void
{
    position = getPosOnCanvas(position);
    size = size*canvasScale;
    canvasContext.save();
    canvasContext.beginPath();
    canvasContext.arc( position.getX(), position.getY(),
    size, 0, 2*Math.PI);
    endPath( fillColor, stroke );
}//-----------------------------------------------
export function clearCanvas():void{
    canvasContext.save();
    canvasContext.fillStyle = "#000000";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.restore();
}//-----------------------------------------------
function mouseMove(e:MouseEvent){
    mousePosition.set(e.offsetX, e.offsetY);
    var mindex = grid.mapBlockGrid.realToIndex( mousePosition );
    mouseIndex.set( mindex.getX(), mindex.getY() );
}//-----------------------------------------------
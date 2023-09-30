import * as grid from "./Grid.js";

export function hToColor(h:number):string{
    h = h*Math.PI;
    var degreeToColorValue = (offset:number):number=>{
        return Math.round( 255 * ( Math.cos( h+offset )+1 ) / 2 )
    };//.............................................
    var red = degreeToColorValue(0);
    var green = degreeToColorValue(Math.PI*2/3);
    var blue = degreeToColorValue(Math.PI*4/3);
    return `rgb(${red}, ${green}, ${blue})`;
}//--------------------------------------------------
export function rgbFormatToStringColor(color:{r:number, g:number, b:number}):string{
    var getColorValue = (v:number):number=>{
        return Math.round( 255*v );
    };//.............................................
    return `rgb(${getColorValue(color.r)}, ${getColorValue(color.g)}, ${getColorValue(color.b)})`;
}//--------------------------------------------------
export function randomInt(min:number, max:number):number{
    return Math.floor( min + Math.random()*(max-min+1) )
}//--------------------------------------------------

export class Vector2{
    protected x:number=0;
    protected y:number=0;
    //-----------------------------------------------
    constructor(x:number, y:number){
        this.set(x, y);
    }//----------------------------------------------
    public getX():number{return this.x;}
    public getY():number{return this.y;}
    public copy():Vector2{
        return new Vector2(this.x, this.y);
    }//----------------------------------------------
    public set(x:number, y:number):void{
        this.x = x;
        this.y = y;
    }//----------------------------------------------
    public setWithVector(vector:Vector2):void{
        this.set(vector.x, vector.y);
    }//----------------------------------------------
    public change(deltax:number, deltay:number){
        this.set( this.x + deltax, this.y + deltay );
    }//----------------------------------------------
    public getOffset(deltax:number, deltay:number):Vector2{
        return new Vector2(this.x+deltax, this.y+deltay);
    }//----------------------------------------------
    public simpleDistance( position:Vector2 ){
        return Math.abs( position.x - this.x ) + Math.abs( position.y - this.y );
    }//----------------------------------------------
    public euclideanDistance( position:Vector2 ){
        return Math.sqrt( Math.pow( position.x - this.x, 2 ) + Math.pow( position.y - this.y, 2 ) );
    }//----------------------------------------------
    public equal( vector:Vector2 ):boolean{
        return( this.x == vector.x && this.y == vector.y );
    }//----------------------------------------------
    public toDictFormat():{x:number, y:number}{
        return {x:this.x, y:this.y};
    }//----------------------------------------------
}//==================================================

export class Vector2Int extends Vector2{
    public override set(x: number, y: number): void {
        super.set( Math.round(x), Math.round(y) );
    }//----------------------------------------------
    public override equal(vector: Vector2Int): boolean {
        return(this.x==vector.x && this.y==vector.y);
    }//----------------------------------------------
    public override copy(): Vector2Int{
        return new Vector2Int(this.x, this.y)
    }//----------------------------------------------
    public getOffset(deltax: number, deltay: number): Vector2Int {
        return new Vector2Int( this.x+deltax, this.y+deltay );
    }//----------------------------------------------
    public getAdjacent():Vector2Int[]{
        return[ this.getOffset(0, 1), this.getOffset(1, 0),
            this.getOffset(0, -1), this.getOffset(-1, 0) ];
    }//----------------------------------------------
    public getAdjacentDict():{x:number, y:number}[]{
        var adjacent = this.getAdjacent();
        return[ adjacent[0].toDictFormat(), adjacent[1].toDictFormat(),
        adjacent[2].toDictFormat(), adjacent[3].toDictFormat() ];
    }//----------------------------------------------
}//==================================================

export class Table2D<T>{
    private valueTable:Map< number, Map<number, T> > = new Map();
    private keyTable:Map<T, {x:number, y:number}[]> = new Map();
    //-----------------------------------------------
    public Set(x:number, y:number, value:T):void{
        x = Math.round(x);
        y = Math.round(y);
        var key = {x:x, y:y};
        if( !this.keyTable.has(value) ){
            this.keyTable.set( value, [] );
        }
        if( this.keyTable.get(value)?.indexOf(key)as number < 0 ){
            this.keyTable.get(value)?.push(key);
        }
        if( !this.valueTable.has( x ) )
            this.valueTable.set( x, new Map() );
        this.valueTable.get(x)?.set(y, value);
    }//----------------------------------------------
    public SetWithVector( vector:Vector2Int, value:T ):void{
        this.Set( vector.getX(), vector.getY(), value );
    }//----------------------------------------------
    public Get(x:number, y:number):T|null{
        x = Math.round(x);
        y = Math.round(y);
        if( !this.valueTable.has(x) )return null;
        if( !this.valueTable.get(x)?.has(y) )return null;
        return this.valueTable.get(x)?.get(y)as T|null;
    }//----------------------------------------------
    public GetWithVector( vector:Vector2Int ):T|null{
        return this.Get( vector.getX(), vector.getY() );
    }//----------------------------------------------
    public GetAllValues():T[]{
        return Array.from(this.keyTable.keys());
    }//----------------------------------------------
    public GetAllKeys():{x:number, y:number}[]{
        var keyList : {x:number, y:number}[] = [];
        var xList = Array.from( this.valueTable.keys() );
        for(var i=0; i<xList.length; i++){
            var x = xList[i];
            var mapInX = this.valueTable.get(x)as Map<number, T>;
            var yList = Array.from( mapInX.keys() );
            for(var j=0; j<yList.length; j++){
                var y = yList[j];
                keyList.push( {x:x, y:y} );
            }
        }
        return keyList;
    }//----------------------------------------------
    public RemoveValue(value:T):void{
        if( !this.keyTable.has(value) )return;
        var keyList = this.keyTable.get(value)as {x:number, y:number}[];
        for(var i=0; i<keyList.length; i++){
            var key = keyList[i];
            this.valueTable.get( key.x )?.delete( key.y );
        }
        this.keyTable.delete(value);
    }//----------------------------------------------
    public clear():void{
        var xList = Array.from( this.valueTable.keys() );
        for(var i=0; i<xList.length; i++){
            var xMap = this.valueTable.get(xList[i])?.clear();
        }
    }//----------------------------------------------
}//==================================================

export class Distance{
    public static inaccessible():Distance{
        return new Distance( Number.POSITIVE_INFINITY );
    }//----------------------------------------------
    protected distance:number;
    constructor(distance:number){
        this.distance = distance;
    }//----------------------------------------------
    public getDistance():number{
        return this.distance;
    }//----------------------------------------------
}//==================================================

export class MapBlockDistance extends Distance{
    public static inaccessible(): MapBlockDistance {
        return new MapBlockDistance(Number.POSITIVE_INFINITY);
    }//----------------------------------------------
    protected blockDistance:number;
    constructor(blockDistance:number){
        super(blockDistance * grid.BLOCK_SIZE);
        this.blockDistance = blockDistance;
    }//----------------------------------------------
    public getBlockDistance():number{
        return this.blockDistance;
    }//----------------------------------------------
}//==================================================
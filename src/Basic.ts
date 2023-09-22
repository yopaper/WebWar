
export class Position{
    public x:number;
    public y:number;
    constructor(x:number, y:number){
        this.x = Math.round(x);
        this.y = Math.round(y);
    }//----------------------------------------------
    public getOffset(deltax:number, deltay:number):Position{
        return new Position(this.x+deltax, this.y+deltay);
    }//----------------------------------------------
}//==================================================
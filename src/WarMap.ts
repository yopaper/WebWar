import * as mapBlock from "./MapBlock.js"
import * as basic from "./Basic.js"

export class WarMap{
    private blocksTable:{ [key:number] : { [key:number] : mapBlock.MapBlock} };
    private blocksList:mapBlock.MapBlock[];
    //---------------------------------------------
    constructor(){
        this.blocksTable = {};
        this.blocksList = [];
    }//--------------------------------------------
    // 取得所有方塊
    public getBlocks():mapBlock.MapBlock[]{
        return Array.from( this.blocksList );
    }//--------------------------------------------
    // 取得方塊
    public getBlock(position:basic.Position):mapBlock.MapBlock|null{
        if( !(position.x in this.blocksTable) )return null;
        if( !(position.y in this.blocksTable[position.x]) )return null;
        return this.blocksTable[position.x][position.y];
    }//--------------------------------------------
    // 加入方塊
    public addBlock(block:mapBlock.MapBlock):void{
        var position = block.indexPosition;
        if( !(position.x in this.blocksTable ) )
        this.blocksTable[position.x] = {};
        this.blocksTable[position.x][position.y] = block;
        this.blocksList.push( block );
    }//--------------------------------------------
    public drawAllBlock():void{
        for(var i=0; i<this.blocksList.length; i++){
            this.blocksList[i].draw();
        }
    }//--------------------------------------------
}//============================================================
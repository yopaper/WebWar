import * as mapBlock from "./MapBlock"
import * as basic from "./Basic"

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
    public addBlock(block:mapBlock.MapBlock){
        var position = block.position;
        if( !(position.x in this.blocksTable ) )
        this.blocksTable[position.x] = {};
        this.blocksTable[position.x][position.y] = block;
    }//--------------------------------------------
}//============================================================
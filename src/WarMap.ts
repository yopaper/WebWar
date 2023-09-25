import * as mapBlock        from "./MapBlock.js"
import * as basic           from "./Basic.js"
import * as path            from "./PathHandler.js"
import {UnitContainer}      from "./UnitContainer.js"

export class WarMap{
    public pathHandler:path.PathHandler = new path.PathHandler(this);
    public unitContainer:UnitContainer = new UnitContainer(this);
    private blocksTable:basic.Table2D<mapBlock.MapBlock> = new basic.Table2D();
    //---------------------------------------------
    public update():void{
        
        this.drawAllBlock();
        this.unitContainer.update();
    }//--------------------------------------------
    // 取得所有方塊
    public getBlocks():mapBlock.MapBlock[]{
        return this.blocksTable.GetAllValues();
    }//--------------------------------------------
    // 取得方塊
    public getBlockWithPosition(position:basic.Vector2):mapBlock.MapBlock|null{
        return this.blocksTable.Get(position.x, position.y);
    }//--------------------------------------------
    public getBlock(x:number, y:number):mapBlock.MapBlock|null{
        return this.blocksTable.Get(x, y);
    }//--------------------------------------------
    // 加入方塊
    public addBlock(block:mapBlock.MapBlock):void{
        this.blocksTable.Set( block.indexPosition.x, block.indexPosition.y, block );
    }//--------------------------------------------
    public drawAllBlock():void{
        var blocks = this.blocksTable.GetAllValues();
        for(var i=0; i<blocks.length; i++){
            blocks[i].draw();
        }
    }//--------------------------------------------
}//============================================================
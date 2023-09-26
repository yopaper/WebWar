import * as unit    from "./BasicUnit.js"
import * as basic   from "./Basic.js"
import * as canvas  from "./CanvasHandler.js"
import * as grid    from "./Grid.js";

const DEBUG_ENABLE = true;

export abstract class UnitMover{
    public unitOwner:unit.Unit;
    //----------------------------------------------
    constructor(unitOwner:unit.Unit){
        this.unitOwner = unitOwner;
    }//---------------------------------------------
    public abstract setTarget(indexPosition:basic.Vector2):void
    public abstract update():void;
}//=================================================

export class StaticUnitMover extends UnitMover{
    public override setTarget(indexPosition: basic.Vector2): void {}
    public override update(): void {}
}//=================================================

export class NormalUnitMover extends UnitMover{
    public moveSpeed:number;
    private enable              :boolean=false;
    private needToFindNext      :boolean=true;
    private mainTargetIndex     :basic.Vector2;
    private nextTargetIndex     :basic.Vector2;
    private nextTargetPosition  :basic.Vector2;
    //----------------------------------------------
    constructor(unitOwner:unit.Unit, moveSpeed:number){
        super(unitOwner);
        this.moveSpeed = moveSpeed;
        this.mainTargetIndex = unitOwner.mapBlockIndex();
        this.nextTargetIndex = unitOwner.mapBlockIndex();
        this.nextTargetPosition = unitOwner.position.copy();
    }//---------------------------------------------
    public override setTarget(indexPosition: basic.Vector2): void {
        if( this.mainTargetIndex.equal( indexPosition ) )return;
        this.mainTargetIndex.setWithVector( indexPosition );
        this.enable = true;
        this.needToFindNext = true;
    }//---------------------------------------------
    public override update(): void {
        if( this.enable==false )return;
        this.checkArrive();
        this.findNextStep();
        this.moveToNext();
        this.debugDraw();
    }//---------------------------------------------
    private findNextStep():void{
        if( !this.needToFindNext )return;
        this.needToFindNext = false;
        var mainTargetPath = this.unitOwner.mapOwner.pathHandler.getBlockPathWithPosition( this.mainTargetIndex );
        if( mainTargetPath == null )return;
        var nextBlock = mainTargetPath.getNextBlockToThis( this.nextTargetIndex );
        if( nextBlock==null )return;
        var nextIndex = nextBlock.indexPosition;
        var nextPosition = nextBlock.randomPositionOn();
        
        if( this.nextTargetIndex.x == nextIndex.x ){
            this.nextTargetPosition.set( this.nextTargetPosition.x, nextPosition.y );
        }else{
            this.nextTargetPosition.set( nextPosition.x, this.nextTargetPosition.y );
        }
        this.nextTargetIndex.setWithVector( nextIndex );
    }//---------------------------------------------
    private checkArrive():void{
        if( this.needToFindNext )return;
        if( !this.unitOwner.mapBlockIndex().equal( this.nextTargetIndex ) )return;
        if( this.unitOwner.position.simpleDistance( this.nextTargetPosition )>5 )return;
        if( this.unitOwner.mapBlockIndex().equal( this.mainTargetIndex ) ){
            this.enable = false;
            return;
        }
        this.needToFindNext = true;
    }//---------------------------------------------
    private moveToNext():void{
        if( this.unitOwner.attacker.isAttacking() )return;
        var posDelta = {x:this.nextTargetPosition.x - this.unitOwner.position.x,
            y:this.nextTargetPosition.y - this.unitOwner.position.y};
        var absDelta = {x:Math.abs(posDelta.x), y:Math.abs(posDelta.y)};
        var moveDelta = {
            x:Math.min(absDelta.x, this.moveSpeed),
            y:Math.min(absDelta.y, this.moveSpeed)
        };
        if( posDelta.x > 0 ){
            this.unitOwner.position.change( moveDelta.x, 0 );
        }else if( posDelta.x<0 ){
            this.unitOwner.position.change( -moveDelta.x, 0 );
        }
        if( posDelta.y > 0 ){
            this.unitOwner.position.change( 0, moveDelta.y );
        }else if( posDelta.y<0 ){
            this.unitOwner.position.change( 0, -moveDelta.y );
        }
    }//---------------------------------------------
    private debugDraw():void{
        if( !DEBUG_ENABLE )return;
        canvas.drawLine( this.unitOwner.position, this.nextTargetPosition, "#00FF00", 1 );
        canvas.drawLine( this.unitOwner.position, grid.mapBlockGrid.indexToReal( this.mainTargetIndex ), "#00FFFF", 1 );
    }//---------------------------------------------
}//=================================================
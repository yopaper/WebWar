import * as unit    from "./BasicUnit.js"
import * as basic   from "./Basic.js"
import * as canvas  from "./CanvasHandler.js"
import * as grid    from "./Grid.js";

const DEBUG_ENABLE = false;

export abstract class UnitMover{
    public unitOwner:unit.Unit;
    //----------------------------------------------
    constructor(unitOwner:unit.Unit){
        this.unitOwner = unitOwner;
    }//---------------------------------------------
    public abstract setTarget(indexPosition:basic.Vector2Int):void
    public abstract update():void;
}//=================================================

export class StaticUnitMover extends UnitMover{
    public override setTarget(indexPosition: basic.Vector2Int): void {}
    public override update(): void {}
}//=================================================

export class NormalUnitMover extends UnitMover{
    public moveSpeed:number;
    private enable              :boolean=false;
    private needToFindNext      :boolean=true;
    private mainTargetIndex     :basic.Vector2Int;
    private nextTargetIndex     :basic.Vector2Int;
    private nextTargetPosition  :basic.Vector2;
    //----------------------------------------------
    constructor(unitOwner:unit.Unit, moveSpeed:number){
        super(unitOwner);
        this.moveSpeed = moveSpeed;
        this.mainTargetIndex = unitOwner.mapBlockIndex();
        this.nextTargetIndex = unitOwner.mapBlockIndex();
        this.nextTargetPosition = unitOwner.position.copy();
    }//---------------------------------------------
    public override setTarget(indexPosition: basic.Vector2Int): void {
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
        var mainTargetPath = this.unitOwner.mapOwner.pathHandler.getBlockPathWithVector( this.mainTargetIndex );
        if( mainTargetPath == null )return;
        var currentUnitIndex = this.unitOwner.mapBlockIndex();
        var nextBlock = mainTargetPath.getNextBlockToThis( currentUnitIndex );
        if( nextBlock==null )return;
        var nextIndex = nextBlock.indexPosition;
        var nextPosition = nextBlock.randomPositionOn();
        
        if( this.nextTargetIndex.getX() == nextIndex.getX() ){
            this.nextTargetPosition.set( this.nextTargetPosition.getX(), nextPosition.getY() );
        }else if( this.nextTargetIndex.getY() == nextIndex.getY() ){
            this.nextTargetPosition.set( nextPosition.getX(), this.nextTargetPosition.getY() );
        }else{
            this.nextTargetPosition.set( nextPosition.getX(), nextPosition.getY() );
        }
        this.nextTargetIndex.setWithVector( nextIndex );
        this.needToFindNext = false;
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
        var posDelta = {x:this.nextTargetPosition.getX() - this.unitOwner.position.getX(),
            y:this.nextTargetPosition.getY() - this.unitOwner.position.getY()};
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
        canvas.drawLine( this.unitOwner.position, this.nextTargetPosition, "#00FF00", 0 );
        canvas.drawLine( this.unitOwner.position, grid.mapBlockGrid.indexToReal( this.mainTargetIndex ), "#00FFFF", 0 );
    }//---------------------------------------------
}//=================================================
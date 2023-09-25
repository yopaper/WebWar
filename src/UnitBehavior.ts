import * as unit from "./BasicUnit.js"
import * as targetFinder from "./TargetFinder.js"

//=======================================================
export abstract class UnitBehavior{
    public unitOwner: unit.Unit;
    //---------------------------------------------------
    constructor( unitOwner:unit.Unit ){
        this.unitOwner = unitOwner;
    }//--------------------------------------------------
    public abstract update():void;
}//======================================================
export class TargetPriorityBehavior extends UnitBehavior{
    protected idleAction:(()=>void)|undefined;
    //---------------------------------------------------
    constructor( unitOwner:unit.Unit, idleAction?:()=>void ){
        super( unitOwner );
        this.idleAction = idleAction;
    }//--------------------------------------------------
    public update(): void {
        var target = this.unitOwner.targetIndexPosition();
        if( target!=null ){
            this.unitOwner.mover.setTarget( target );
        }else if(this.idleAction!=undefined){
            this.idleAction();
        }
    }//--------------------------------------------------
}//======================================================

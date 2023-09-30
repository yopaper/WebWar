import * as unit from "./BasicUnit.js"
import * as canvas from "./CanvasHandler.js"

export abstract class UnitAttacker{
    public unitOwner:unit.Unit;
    //---------------------------------------------
    constructor(unitOwner:unit.Unit){
        this.unitOwner = unitOwner;
    }//--------------------------------------------
    public abstract update():void;
    public abstract isAttacking():boolean;
}//================================================

export class StaticAttacker extends UnitAttacker{
    constructor( unitOwner:unit.Unit ){
        super( unitOwner );
    }//--------------------------------------------
    public override update(): void {}
    public override isAttacking(): boolean {
        return false;
    }//--------------------------------------------
}//================================================

export class NormalAttacker extends UnitAttacker{
    protected attackDamage:         number;
    protected attackDistance:       number;
    protected attackCoolDownMax:    number;
    protected attackCoolDown:       number=0;
    //---------------------------------------------
    constructor(unitOwner:unit.Unit, attackerInfo:{attackDamage:number, attackDistance:number, attackCoolDown:number}){
        super(unitOwner);
        this.attackDamage = attackerInfo.attackDamage;
        this.attackDistance = attackerInfo.attackDistance;
        this.attackCoolDownMax = attackerInfo.attackCoolDown;
    }//--------------------------------------------
    public override isAttacking(): boolean {
        var target = this.unitOwner.getTarget();
        if( target==null )return false;
        var dist = this.unitOwner.position.euclideanDistance( target.position );
        return( dist <= this.attackDistance || this.unitOwner.mapBlockIndex().equal( target.mapBlockIndex() ) );
    }//--------------------------------------------
    public override update(): void {
        this.coolDownCount();
        this.attackTarget();
        
    }//--------------------------------------------
    protected coolDownCount():void{
        if( this.attackCoolDown<=0 )return;
            this.attackCoolDown-=1/30;
    }//--------------------------------------------
    protected attackTarget():void{
        var target = this.unitOwner.getTarget();
        if( !this.isAttacking() )return;
        if( target==null )return;
        if( this.attackCoolDown > 0 )return;
        this.attackCoolDown = this.attackCoolDownMax;
        target.hp.damage(this.attackDamage);
        canvas.drawLine( this.unitOwner.position, target.position, this.unitOwner.team.getMainColor(), 0 );
    }//--------------------------------------------

}//================================================
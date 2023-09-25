import * as unit from "./BasicUnit.js"

export class UnitHp{
    public hp:number;
    public hpMax:number;
    public hpRecoverRate:number;
    //--------------------------------------------
    constructor(hp:number, hpRecoverRate:number){
        this.hp = hp;
        this.hpMax = hp;
        this.hpRecoverRate = hpRecoverRate / 30.0;
    }//-------------------------------------------
    public update():void{
        this.hp = Math.min( this.hp+this.hpRecoverRate, this.hpMax );
    }//-------------------------------------------
    public dead():boolean{
        return this.hp<=0;
    }//-------------------------------------------
    public hpRate():number{
        return this.hp / this.hpMax;
    }//-------------------------------------------
    public damage(damage:number):void{
        this.hp -= damage;
    }//-------------------------------------------
}//===============================================
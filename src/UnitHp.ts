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
    public shieldRate():number{
        return 0;
    }//-------------------------------------------
    public damage(damage:number):void{
        this.hp -= damage;
    }//-------------------------------------------
}//===============================================
export class UnitHpWithShield extends UnitHp{
    public shield:number;
    public shieldMax:number;
    public shieldRecoverRate:number;
    public shieldRecoverDelay:number = 0;
    public shieldRecoverDelayMax:number = 5.5;
    //--------------------------------------------
    constructor(hp:number, hpRecoverRate:number, shield:number){
        super(hp, hpRecoverRate);
        this.shield = shield;
        this.shieldMax = shield;
        this.shieldRecoverRate = shield / 30 / 5;
    }//-------------------------------------------
    public update(): void {
        super.update();
        if( this.shieldRecoverDelay<=0 ){
            this.shield = Math.min( this.shield+this.shieldRecoverRate, this.shieldMax );
        }else{
            this.shieldRecoverDelay -= 1/30;
        }
    }//-------------------------------------------
    public shieldRate(): number {
        return this.shield/this.shieldMax;
    }//-------------------------------------------
    public override damage(damage: number): void {
        this.shieldRecoverDelay = this.shieldRecoverDelayMax;
        if( this.shield>0 ){
            this.shield -= damage;
            if( this.shield<0 ){
                this.hp += this.shield;
                this.shield = 0;
            }
        }else{
            this.hp -= damage;
        }
    }//-------------------------------------------
}//===============================================
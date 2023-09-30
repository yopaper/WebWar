import * as basic from "./Basic.js"

export class UnitTeam{
    public static Red:UnitTeam = new UnitTeam({r:1, g:0, b:0}, {r:0.8, g:0.3, b:0.3}, 0);
    public static Blue:UnitTeam = new UnitTeam({r:0.4, g:0.4, b:1}, {r:0.1, g:0.1, b:0.7}, 1);

    public mainColor:{r:number, g:number, b:number};
    public subColor:{r:number, g:number, b:number};
    public teamId:number;
    
    //------------------------------------------------------
    constructor(  mainColor:{r:number, g:number, b:number}, subColor:{r:number, g:number, b:number}, id:number ){
        this.mainColor = mainColor;
        this.subColor = subColor;
        this.teamId = id;
    }//-----------------------------------------------------
    public same(unitTeam:UnitTeam):boolean{
        return this.teamId == unitTeam.teamId;
    }//-----------------------------------------------------
    public getMainColorWithRate(rate:number):string{
        return basic.rgbFormatToStringColor(
            {r:this.mainColor.r*rate, g:this.mainColor.g*rate, b:this.mainColor.b*rate} );
    }//-----------------------------------------------------
    public getMainColor():string{
        return this.getMainColorWithRate(1);
    }//-----------------------------------------------------
    public getSubColorWithRate(rate:number):string{
        return basic.rgbFormatToStringColor(
            {r:this.subColor.r*rate, g:this.subColor.g*rate, b:this.subColor.b*rate}
        );
    }//-----------------------------------------------------
    public getSubColor():string{
        return this.getSubColorWithRate(1);
    }//-----------------------------------------------------
}//=========================================================
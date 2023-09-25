import * as unit from "./BasicUnit.js"
import * as unitUtils from "./UnitUtils.js"

export class UnitSpawner{
    public unitOwner:unit.Unit;
    private spawnFunction : (spawner:UnitSpawner)=>unit.Unit;
    private coolDownMax:number;
    private coolDownTimer:number;
    private spawnEnergy:number;
    private spawnEnergyMax:number;
    private spawnEnergyDelta:number;
    private chileMax:number;
    private chileUnits:unit.Unit[] = [];
    //--------------------------------------------------
    constructor( unitOwner:unit.Unit, spawnFunction:(spawner:UnitSpawner)=>unit.Unit,
    coolDownMax:number, energyDelta:number, energyMax:number, chileMax:number ){
        this.unitOwner = unitOwner;
        this.spawnFunction = spawnFunction;
        this.coolDownMax = coolDownMax;
        this.coolDownTimer = Math.random()*coolDownMax/3;
        this.spawnEnergy = 0;
        this.spawnEnergyDelta = energyDelta;
        this.spawnEnergyMax = energyMax;
        this.chileMax = chileMax;
    }//-------------------------------------------------
    public update():void{
        this.coolDownUpdate();
        this.spawnUnit();
        unitUtils.removeDeadUnitFromArray( this.chileUnits );
    }//-------------------------------------------------
    private coolDownUpdate():void{
        if( this.spawnEnergy >= this.spawnEnergyMax )return;
        this.coolDownTimer -= 1/30;
        if( this.coolDownTimer>0 )return;
        this.coolDownTimer = this.coolDownMax;
        this.spawnEnergy = Math.min( this.spawnEnergy + this.spawnEnergyDelta, this.spawnEnergyMax );
    }//-------------------------------------------------
    private spawnUnit():void{
        if( this.chileUnits.length >= this.chileMax )return;
        if( this.spawnEnergy<=0 )return;
        var spawnedUnit = this.spawnFunction(this);
        this.chileUnits.push( spawnedUnit );
        this.spawnEnergy -= 1;
    }//-------------------------------------------------
}//=====================================================
import * as unitUtils from "./UnitUtils.js";
export class UnitSpawner {
    constructor(unitOwner, spawnFunction, coolDownMax, energyDelta, energyMax, chileMax) {
        this.chileUnits = [];
        this.unitOwner = unitOwner;
        this.spawnFunction = spawnFunction;
        this.coolDownMax = coolDownMax;
        this.coolDownTimer = Math.random() * coolDownMax / 3;
        this.spawnEnergy = 0;
        this.spawnEnergyDelta = energyDelta;
        this.spawnEnergyMax = energyMax;
        this.chileMax = chileMax;
    }
    update() {
        this.coolDownUpdate();
        this.spawnUnit();
        unitUtils.removeDeadUnitFromArray(this.chileUnits);
    }
    coolDownUpdate() {
        if (this.spawnEnergy >= this.spawnEnergyMax)
            return;
        this.coolDownTimer -= 1 / 30;
        if (this.coolDownTimer > 0)
            return;
        this.coolDownTimer = this.coolDownMax;
        this.spawnEnergy = Math.min(this.spawnEnergy + this.spawnEnergyDelta, this.spawnEnergyMax);
    }
    spawnUnit() {
        if (this.chileUnits.length >= this.chileMax)
            return;
        if (this.spawnEnergy <= 0)
            return;
        var spawnedUnit = this.spawnFunction(this);
        this.chileUnits.push(spawnedUnit);
        this.spawnEnergy -= 1;
    }
}

export class UnitHp {
    constructor(hp, hpRecoverRate) {
        this.hp = hp;
        this.hpMax = hp;
        this.hpRecoverRate = hpRecoverRate / 30.0;
    }
    update() {
        this.hp = Math.min(this.hp + this.hpRecoverRate, this.hpMax);
    }
    dead() {
        return this.hp <= 0;
    }
    hpRate() {
        return this.hp / this.hpMax;
    }
    damage(damage) {
        this.hp -= damage;
    }
}

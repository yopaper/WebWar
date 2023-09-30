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
    shieldRate() {
        return 0;
    }
    damage(damage) {
        this.hp -= damage;
    }
}
export class UnitHpWithShield extends UnitHp {
    constructor(hp, hpRecoverRate, shield) {
        super(hp, hpRecoverRate);
        this.shieldRecoverDelay = 0;
        this.shieldRecoverDelayMax = 5.5;
        this.shield = shield;
        this.shieldMax = shield;
        this.shieldRecoverRate = shield / 30 / 5;
    }
    update() {
        super.update();
        if (this.shieldRecoverDelay <= 0) {
            this.shield = Math.min(this.shield + this.shieldRecoverRate, this.shieldMax);
        }
        else {
            this.shieldRecoverDelay -= 1 / 30;
        }
    }
    shieldRate() {
        return this.shield / this.shieldMax;
    }
    damage(damage) {
        this.shieldRecoverDelay = this.shieldRecoverDelayMax;
        if (this.shield > 0) {
            this.shield -= damage;
            if (this.shield < 0) {
                this.hp += this.shield;
                this.shield = 0;
            }
        }
        else {
            this.hp -= damage;
        }
    }
}

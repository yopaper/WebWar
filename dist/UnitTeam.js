import * as basic from "./Basic.js";
export class UnitTeam {
    constructor(mainColor, subColor, id) {
        this.mainColor = mainColor;
        this.subColor = subColor;
        this.teamId = id;
    }
    same(unitTeam) {
        return this.teamId == unitTeam.teamId;
    }
    getMainColorWithRate(rate) {
        return basic.rgbFormatToStringColor({ r: this.mainColor.r * rate, g: this.mainColor.g * rate, b: this.mainColor.b * rate });
    }
    getMainColor() {
        return this.getMainColorWithRate(1);
    }
    getSubColorWithRate(rate) {
        return basic.rgbFormatToStringColor({ r: this.subColor.r * rate, g: this.subColor.g * rate, b: this.subColor.b * rate });
    }
    getSubColor() {
        return this.getSubColorWithRate(1);
    }
}
UnitTeam.Red = new UnitTeam({ r: 1, g: 0, b: 0 }, { r: 0.8, g: 0.3, b: 0.3 }, 0);
UnitTeam.Blue = new UnitTeam({ r: 0.4, g: 0.4, b: 1 }, { r: 0.1, g: 0.1, b: 0.7 }, 1);

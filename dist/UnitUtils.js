export function removeDeadUnitFromArray(units) {
    var i = 0;
    while (i < units.length) {
        if (units[i].hp.dead()) {
            units.splice(i, 1);
        }
        else {
            i++;
        }
    }
}

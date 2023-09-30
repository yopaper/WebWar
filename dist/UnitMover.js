import * as canvas from "./CanvasHandler.js";
import * as grid from "./Grid.js";
const DEBUG_ENABLE = false;
export class UnitMover {
    constructor(unitOwner) {
        this.unitOwner = unitOwner;
    }
}
export class StaticUnitMover extends UnitMover {
    setTarget(indexPosition) { }
    update() { }
}
export class NormalUnitMover extends UnitMover {
    constructor(unitOwner, moveSpeed) {
        super(unitOwner);
        this.enable = false;
        this.needToFindNext = true;
        this.moveSpeed = moveSpeed;
        this.mainTargetIndex = unitOwner.mapBlockIndex();
        this.nextTargetIndex = unitOwner.mapBlockIndex();
        this.nextTargetPosition = unitOwner.position.copy();
    }
    setTarget(indexPosition) {
        if (this.mainTargetIndex.equal(indexPosition))
            return;
        this.mainTargetIndex.setWithVector(indexPosition);
        this.enable = true;
        this.needToFindNext = true;
    }
    update() {
        if (this.enable == false)
            return;
        this.checkArrive();
        this.findNextStep();
        this.moveToNext();
        this.debugDraw();
    }
    findNextStep() {
        if (!this.needToFindNext)
            return;
        var mainTargetPath = this.unitOwner.mapOwner.pathHandler.getBlockPathWithVector(this.mainTargetIndex);
        if (mainTargetPath == null)
            return;
        var currentUnitIndex = this.unitOwner.mapBlockIndex();
        var nextBlock = mainTargetPath.getNextBlockToThis(currentUnitIndex);
        if (nextBlock == null)
            return;
        var nextIndex = nextBlock.indexPosition;
        var nextPosition = nextBlock.randomPositionOn();
        if (this.nextTargetIndex.getX() == nextIndex.getX()) {
            this.nextTargetPosition.set(this.nextTargetPosition.getX(), nextPosition.getY());
        }
        else if (this.nextTargetIndex.getY() == nextIndex.getY()) {
            this.nextTargetPosition.set(nextPosition.getX(), this.nextTargetPosition.getY());
        }
        else {
            this.nextTargetPosition.set(nextPosition.getX(), nextPosition.getY());
        }
        this.nextTargetIndex.setWithVector(nextIndex);
        this.needToFindNext = false;
    }
    checkArrive() {
        if (this.needToFindNext)
            return;
        if (!this.unitOwner.mapBlockIndex().equal(this.nextTargetIndex))
            return;
        if (this.unitOwner.position.simpleDistance(this.nextTargetPosition) > 5)
            return;
        if (this.unitOwner.mapBlockIndex().equal(this.mainTargetIndex)) {
            this.enable = false;
            return;
        }
        this.needToFindNext = true;
    }
    moveToNext() {
        if (this.unitOwner.attacker.isAttacking())
            return;
        var posDelta = { x: this.nextTargetPosition.getX() - this.unitOwner.position.getX(),
            y: this.nextTargetPosition.getY() - this.unitOwner.position.getY() };
        var absDelta = { x: Math.abs(posDelta.x), y: Math.abs(posDelta.y) };
        var moveDelta = {
            x: Math.min(absDelta.x, this.moveSpeed),
            y: Math.min(absDelta.y, this.moveSpeed)
        };
        if (posDelta.x > 0) {
            this.unitOwner.position.change(moveDelta.x, 0);
        }
        else if (posDelta.x < 0) {
            this.unitOwner.position.change(-moveDelta.x, 0);
        }
        if (posDelta.y > 0) {
            this.unitOwner.position.change(0, moveDelta.y);
        }
        else if (posDelta.y < 0) {
            this.unitOwner.position.change(0, -moveDelta.y);
        }
    }
    debugDraw() {
        if (!DEBUG_ENABLE)
            return;
        canvas.drawLine(this.unitOwner.position, this.nextTargetPosition, "#00FF00", 0);
        canvas.drawLine(this.unitOwner.position, grid.mapBlockGrid.indexToReal(this.mainTargetIndex), "#00FFFF", 0);
    }
}

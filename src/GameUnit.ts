import * as unit        from "./BasicUnit.js";
import * as canvas          from "./CanvasHandler.js";
import * as basic           from "./Basic.js";
import * as unitMover       from "./UnitMover.js";
import * as unitAttack      from "./UnitAttacker.js";
import * as unitBehavior    from "./UnitBehavior.js";
import * as targetFinder    from "./TargetFinder.js";
import * as unitHp          from "./UnitHp.js";
import * as grid            from "./Grid.js"

export class Fighter extends unit.Unit{
    protected override draw(): void {
        canvas.drawRectCenter(this.position, new basic.Vector2(8, 8),
        this.team.getMainColor(), this.team.getSubColor(), 2);
        canvas.drawRectCenter(this.position, new basic.Vector2(4, 4),
        this.team.getMainColorWithRate(this.hp.hpRate()), null, null);
    }//-------------------------------------------------------
    public override unitRank(): number {
        return 0;
    }//-------------------------------------------------------
    protected hpSource(): unitHp.UnitHp {
        return new unitHp.UnitHp(50, 0);
    }//-------------------------------------------------------
    protected override moverSource(): unitMover.UnitMover {
        return new unitMover.NormalUnitMover(this, 1.2);
    }//-------------------------------------------------------
    protected override attackerSource(): unitAttack.UnitAttacker {
        return new unitAttack.NormalAttacker(this, {
            attackDamage:5, attackCoolDown:1, attackDistance:grid.BLOCK_SIZE*0.5
        });
    }//-------------------------------------------------------
    protected override behaviorSource(): unitBehavior.UnitBehavior {
        return new unitBehavior.TargetPriorityBehavior(this);
    }//-------------------------------------------------------
    protected override targetFindersSource(): targetFinder.UnitTargetFinder[] {
        return[
            new targetFinder.AttackTargetFinder(this, grid.BLOCK_SIZE*3, 1),
            new targetFinder.MainTargetFinder(this),
        ];
    }//-------------------------------------------------------
}//===========================================================

export class Shooter extends unit.Unit{
    protected override draw(): void {
        canvas.drawDiamond(this.position, new basic.Vector2(12, 12),
        this.team.getMainColor(), {strokeColor:this.team.getSubColor(), strokeWidth:2});
        canvas.drawDiamond(this.position, new basic.Vector2(6, 6),
        this.team.getMainColorWithRate(this.hp.hpRate()));
    }//-------------------------------------------------------
    public override unitRank(): number {
        return 0;
    }//-------------------------------------------------------
    protected hpSource(): unitHp.UnitHp {
        return new unitHp.UnitHp(40, 0);
    }//-------------------------------------------------------
    protected override moverSource(): unitMover.UnitMover {
        return new unitMover.NormalUnitMover(this, 1.2);
    }//-------------------------------------------------------
    protected override attackerSource(): unitAttack.UnitAttacker {
        return new unitAttack.NormalAttacker(this, {
            attackDamage:5, attackCoolDown:1, attackDistance:grid.BLOCK_SIZE*2
        });
    }//-------------------------------------------------------
    protected override behaviorSource(): unitBehavior.UnitBehavior {
        return new unitBehavior.TargetPriorityBehavior(this);
    }//-------------------------------------------------------
    protected override targetFindersSource(): targetFinder.UnitTargetFinder[] {
        return[
            new targetFinder.AttackTargetFinder(this, grid.BLOCK_SIZE*3, 1),
            new targetFinder.MainTargetFinder(this),
        ];
    }//-------------------------------------------------------
}//===========================================================
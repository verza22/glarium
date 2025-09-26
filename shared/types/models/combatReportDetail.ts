// shared/types/combatReportDetail.ts
export interface CombatReportDetail {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    combatReportId: number;
    round: number;
    typeAttack: number;
    result: number;
    attackUnitId: number;
    attackBeforeCant: number;
    attackAfterCant: number;
    defenseUnitId: number;
    defenseBeforeCant: number;
    defenseAfterCant: number;
  }
// shared/types/combatReport.ts
export interface CombatReport {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    movementRegimentId: number;
    result: number; // 0 = undefined/error, 1 = attacker win, 2 = defender win
  }
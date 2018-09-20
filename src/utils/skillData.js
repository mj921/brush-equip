import { DamageType } from './data';
export const BaseSkillData = {
    Slamming: {
        code: "Slamming",
        name: "猛击",
        baseDamage: 0,
        addition: 100,
        damageType: DamageType.Physical
    },
    ArcaneMissiles: {
        code: "ArcaneMissiles",
        name: "奥术飞弹",
        baseDamage: 0,
        addition: 100,
        damageType: DamageType.Magic
    }
}
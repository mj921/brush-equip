import { DamageType, TextDamageType } from './data';
export default class Character{
    constructor ({name = "你", hp = 100, lv = 1, minAtk = 1, maxAtk = 5, magicAtk = 3, def = 1, magicDef = 1, speed = 0, hit = 70, dodge = 0, crt = 0, crtDamage = 150, baseSkill = null, skills = []} = {}) {
        this.name = name;
        this.hp = hp;
        this.currHp = hp;
        this.lv = lv;
        this.minAtk = minAtk;
        this.maxAtk = maxAtk;
        this.magicAtk = magicAtk;
        this.def = def;
        this.magicDef = magicDef;
        this.speed = speed;
        this.intervalBase = 1;
        this.interval = Math.floor(this.intervalBase * 100 -  this.speed) / 100;
        this.hit = hit; // 命中
        this.dodge = dodge; // 闪避
        this.crt = crt; // 暴击
        this.crtDamage = crtDamage;
        this.baseSkill = baseSkill;
        this.skills = skills;
    }
    // 伤害减免
    getDamageRemission (enemy) {
        return this.def / (this.def + enemy.lv * 100);
    }
    // 伤害减免
    getMagicDamageRemission (enemy) {
        return this.magicDef / (this.magicDef + enemy.lv * 100);
    }
    // 伤害减免 (用于计算战斗力)
    getDamageRemissionByCombatPower () {
        return this.def / (this.def + this.lv * 100);
    }
    // 伤害减免 (用于计算战斗力)
    getMagicDamageRemissionByCombatPower () {
        return this.magicDef / (this.magicDef + this.lv * 100);
    }
    attack (enemy) {
        let obj = {};
        if (Math.random() * 100 < this.hit && Math.random() * 100 >= enemy.dodge) {
            let damage = 1;
            let damageName = "物理伤害";
            let skillName = "普通攻击";
            if (this.baseSkill) {
                if (this.baseSkill.damageType === DamageType.Physical) {
                    damage = this.baseSkill.getDamage(Math.random() * (this.maxAtk - this.minAtk) + this.minAtk) * (1 - enemy.getDamageRemission(this));
                } else {
                    damage = this.baseSkill.getDamage(this.magicAtk) * (1 - enemy.getMagicDamageRemission(this));
                }
                damageName = TextDamageType[this.baseSkill.damageType];
                skillName = this.baseSkill.name;
            } else {
                damage = (Math.random() * (this.maxAtk - this.minAtk) + this.minAtk) * (1 - enemy.getDamageRemission(this));
            }
            let crtFlag = false;
            if (Math.random() * 100 < this.crt) {
                damage *= (this.crtDamage / 100);
                crtFlag = true;
            }
            if (this.hit > 100 && Math.random() * 100 < (this.hit - 100)) {
                damage *= 2;
            }
            damage = damage > 1 ? Math.floor(damage) : 1;
            if (enemy.currHp > damage) {
                enemy.currHp -= damage;
            } else {
                enemy.currHp = 0;
            }
            obj.msg = `<span style='color: ${this.color || '#F67712'};'>${this.name}</span> 使用 ${skillName} 对 <span style='color: ${enemy.color || '#F67712'};'>${enemy.name}</span> 造成 <span style='color: #F32020;${crtFlag ? 'font-size: 1.4em;' : ''}'>${damage}</span> ${damageName}`;
        } else {
            obj.msg = `<span style='color: ${enemy.color || '#F67712'};'>${enemy.name}</span> 闪避了 <span style='color: ${this.color || '#F67712'};'>${this.name}</span> 的攻击`
        }
        obj.currHp = enemy.currHp;
        return obj;
    }
    toString () {
        return `hp: ${this.hp}, lv: ${this.lv}`;
    }
    getCombatPower () {
        return Math.floor(((this.maxAtk + this.minAtk) / 2 + this.magicAtk) / 2 / this.interval * this.crt * this.crtDamage / 10000 * this.hit / 100 * this.hp / (2 - this.getDamageRemissionByCombatPower() - this.getMagicDamageRemissionByCombatPower()) * 2 / (100 - this.dodge) * 30);
    }
    getOnHookDamage (enemy) {
        let damage = 1;
        if (!this.baseSkill || this.baseSkill.damageType === DamageType.Physical) {
            damage = Math.floor((this.maxAtk + this.minAtk) / 2 * (1 - enemy.getDamageRemission(this)) * this.hit / 100 * (100 - enemy.dodge) / 100 * (1 + this.crt * this.crtDamage / 10000));
        } else {
            damage = Math.floor(magicAtk * (1 - enemy.getMagicDamageRemission(this)) * this.hit / 100 * (100 - enemy.dodge) / 100 * (1 + this.crt * this.crtDamage / 10000));
        }
        return damage > 1 ? damage :1;
    }
}
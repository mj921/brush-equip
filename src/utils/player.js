import Character from './character';
import { deepCopy } from './util';
export default class Play extends Character{
    constructor ({hp = 100, lv = 1, minAtk = 1, maxAtk = 5, def = 1, speed = 1, hit = 50, dodge = 0, crt = 0, crtDamage = 150, maxExp = 100, currExp = 0, goldCoin = 0} = {}) {
        super({hp, lv, minAtk, maxAtk, def, speed, hit, dodge, crt, crtDamage});
        this.maxExp = maxExp;
        this.currExp = currExp;
        this.extraAtk = 0;
        this.extraDef = 0;
        this.extraHp = 0;
        this.baseMinAtk = this.minAtk;
        this.baseMaxAtk = this.maxAtk;
        this.baseDef = this.def;
        this.baseHp = this.hp;
        this.goldCoin = goldCoin;
        this.knapsack = [];
        this.equips = {
            Weapon: null,
            Helmet: null,
            Clothes: null,
            Belt: null,
            Glove: null,
            Shoes: null,
            Necklace: null,
            Ring: null,
            Trousers: null
        }
    }
    getExp (exp) {
        this.currExp += exp;
        if (this.currExp >= this.maxExp) {
            this.levelUp();
        }
        this.save();
    }
    levelUp () {
        this.lv++;
        this.currExp -= this.maxExp;
        this.maxExp = this.lv * this.lv * 100;
        this.save();
    }
    getEquips (equips) {
        this.knapsack = this.knapsack.concat(equips);
        this.save();
    }
    equipFn (equip) {
        if (this.equips[equip.type]) {
            let oldEquip = this.equips[equip.type];
            this.knapsack.splice(this.knapsack.indexOf(equip), 1, oldEquip);
            oldEquip.getBaseInfoCalculation().forEach(attr => {
                this[attr.code] -= attr.value;
            })
            oldEquip.extraAttr.forEach(attr => {
                this[attr.type.code] -= attr.value;
            })
        } else {
            this.knapsack.splice(this.knapsack.indexOf(equip), 1);
        }
        equip.getBaseInfoCalculation().forEach(attr => {
            this[attr.code] += attr.value;
        })
        equip.extraAttr.forEach(attr => {
            this[attr.type.code] += attr.value;
        })
        this.minAtk = Math.floor(this.baseMinAtk * (100 + this.extraAtk) / 100);
        this.maxAtk = Math.floor(this.baseMaxAtk * (100 + this.extraAtk) / 100);
        this.def = Math.floor(this.baseDef * (100 + this.extraDef) / 100);
        this.hp = Math.floor(this.baseHp * (100 + this.extraHp) / 100);
        this.equips[equip.type] = equip;
        this.save();
    }
    unloadEquip (equipType) {
        if (this.equips[equipType]) {
            this.knapsack.push(this.equips[equipType]);
            this.equips[equipType].getBaseInfoCalculation().forEach(attr => {
                this[attr.code] -= attr.value;
            })
            this.equips[equipType].extraAttr.forEach(attr => {
                this[attr.type.code] -= attr.value;
            })
            this.equips[equipType] = null;
        }
        this.minAtk = Math.floor(this.baseMinAtk * (100 + this.extraAtk) / 100);
        this.maxAtk = Math.floor(this.baseMaxAtk * (100 + this.extraAtk) / 100);
        this.def = Math.floor(this.baseDef * (100 + this.extraDef) / 100);
        this.hp = Math.floor(this.baseHp * (100 + this.extraHp) / 100);
        this.save();
    }
    sellEquip (equip) {
        this.knapsack.splice(this.knapsack.indexOf(equip), 1);
        this.save();
    }
    save () {
        let player = deepCopy(this);
        delete player.knapsack;
        delete player.equips;
        localStorage.setItem("player", JSON.stringify(player));
        localStorage.setItem("equips", JSON.stringify(this.equips));
        localStorage.setItem("knapsack", JSON.stringify(this.knapsack));
    }
    recoveryHp (hp) {
        this.currHp += hp;
        if (this.currHp > this.hp) {
            this.currHp = this.hp;
        }
    }
    autoRcoveryHp (speed, cb) {
        const _loop = () => {
            this.recoveryHp(Math.floor(speed * this.hp / 100));
            if (this.currHp < this.hp) {
                setTimeout(_loop, 100);
            } else {
                cb && cb();
            }
        }
        _loop();
    }
    getBaseInfo () {
        let arr = [];
        arr.push({
            value: this.goldCoin,
            name: "金币"
        })
        arr.push({
            value: this.minAtk + " - " + this.maxAtk,
            name: "攻击"
        })
        arr.push({
            value: this.hp,
            name: "生命"
        })
        arr.push({
            value: this.def,
            name: "防御"
        })
        arr.push({
            value: this.speed + "%",
            name: "攻击速度"
        })
        arr.push({
            value: this.hit + "%",
            name: "命中"
        })
        arr.push({
            value: this.dodge + "%",
            name: "闪避"
        })
        arr.push({
            value: this.crt + "%",
            name: "暴击率"
        })
        arr.push({
            value: this.crtDamage + "%",
            name: "暴击伤害"
        })
        return arr;
    }
}
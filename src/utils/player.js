import Character from './character';
import { deepCopy } from './util';
import { PlayLvUpAttr, EquipQuality } from './data';
export default class Player extends Character{
    constructor ({hp = 100, lv = 1, minAtk = 1, maxAtk = 5, def = 1, speed = 1, hit = 70, dodge = 0, crt = 0, crtDamage = 150, maxExp = 100, currExp = 0, goldCoin = 0, baseMinAtk = 1, baseMaxAtk = 5, baseHp = 100, baseDef = 1, extraAtk = 0, extraHp = 0, extraDef = 0, knapsackCapacity = 100} = {}) {
        super({hp, lv, minAtk, maxAtk, def, speed, hit, dodge, crt, crtDamage});
        this.maxExp = maxExp;
        this.currExp = currExp;
        this.extraAtk = extraAtk;
        this.extraDef = extraDef;
        this.extraHp = extraHp;
        this.baseMinAtk = baseMinAtk;
        this.baseMaxAtk = baseMaxAtk;
        this.baseDef = baseDef;
        this.baseHp = baseHp;
        this.calculationBaseAttr();
        this.goldCoin = goldCoin;
        this.knapsack = [];
        this.knapsackCapacity = knapsackCapacity;
        this.equips = {
            Weapon: null,
            Helmet: null,
            Necklace: null,
            Clothes: null,
            Glove: null,
            Ring: null,
            Belt: null,
            Trousers: null,
            Shoes: null
        }
        this.messageHandles = [];
        this.equipFallDownNum = localStorage.getItem("equipFallDownNum") ?
            JSON.parse(localStorage.getItem("equipFallDownNum")) :
            (() => {
                let obj = {};
                Object.keys(EquipQuality).forEach(key => {
                    obj[key] = 0;
                })
                return obj
            })();

        this.totalGoldCoin = +localStorage.getItem("totalGoldCoin") || 0;
    }
    getExp (exp) {
        this.currExp += exp;
        while (this.currExp >= this.maxExp) {
            this.levelUp();
        }
        this.save();
    }
    getGoldCoin (goldCoin) {
        this.goldCoin += goldCoin;
        this.totalGoldCoin += goldCoin;
        localStorage.setItem("goldCoin", this.goldCoin);
    }
    pay (goldCoin) {
        this.goldCoin -= goldCoin;
    }
    levelUp () {
        this.lv++;
        this.currExp -= this.maxExp;
        this.maxExp = this.lv * this.lv * 100;
        Object.keys(PlayLvUpAttr).forEach(key => {
            this[key] += PlayLvUpAttr[key];
        })
        this.calculationBaseAttr();
        this.sendMsg(`等级提升至 ${this.lv} 级`);
        this.save();
    }
    getEquips (equips, saleEquipRule) {
        equips.forEach(equip => {
            this.equipFallDownNum[equip.type]++;
        })
        localStorage.setItem("equipFallDownNum", JSON.stringify(this.equipFallDownNum));
        let goldCoin = 0;
        let saleNum = 0;
        if (saleEquipRule) {
            if (saleEquipRule === "auto") {
                let es = [];
                equips.forEach(equip => {
                    if (es.length < this.knapsackCapacity && this.getCurrEquipPower(equip) > this.getCombatPower()) {
                        es.push(equip);
                    } else {
                        goldCoin += equip.price;
                        saleNum++;
                    }
                })
                equips = es;
            } else {
                equips = equips.filter(equip => {
                    if (equip.type !== saleEquipRule) {
                        return true;
                    } else {
                        goldCoin += equip.price;
                        saleNum++;
                        return false;
                    }
                })
            }
        }
        let knapsack = this.knapsack.concat(equips);
        this.knapsack = knapsack.slice(0, this.knapsackCapacity);
        if (knapsack.length > this.knapsackCapacity) {
            saleNum += knapsack.length - this.knapsackCapacity;
            knapsack.slice(this.knapsackCapacity, knapsack.length).forEach(equip => {
                goldCoin += equip.price;
            })
            this.getGoldCoin(goldCoin);
        }
        if (saleNum > 0) {
            this.sendMsg(`出售 ${saleNum} 件装备, 共获得 ${goldCoin} 金币`);
        }
        this.save();
    }
    calculationBaseAttr () {
        this.minAtk = Math.floor(this.baseMinAtk * (100 + this.extraAtk) / 100);
        this.maxAtk = Math.floor(this.baseMaxAtk * (100 + this.extraAtk) / 100);
        this.def = Math.floor(this.baseDef * (100 + this.extraDef) / 100);
        this.hp = Math.floor(this.baseHp * (100 + this.extraHp) / 100);
        this.interval = Math.floor(this.intervalBase * 100 -  this.speed) / 100;
    }
    equipFn (equip, saveFlag = true) {
        if (this.equips[equip.type]) {
            let oldEquip = this.equips[equip.type];
            this.knapsack.splice(this.knapsack.indexOf(equip), 1, oldEquip);
            oldEquip.getBaseInfoCalculation().forEach(attr => {
                if (attr.code === "intervalBase") {
                    this.intervalBase = 1;
                } else {
                    this[attr.code] -= attr.value;
                }
            })
            oldEquip.extraAttr.forEach(attr => {
                this[attr.type.code] -= attr.value;
            })
        } else {
            this.knapsack.splice(this.knapsack.indexOf(equip), 1);
        }
        equip.getBaseInfoCalculation().forEach(attr => {
            if (attr.code === "intervalBase") {
                this.intervalBase = attr.value;
            } else {
                this[attr.code] += attr.value;
            }
        })
        equip.extraAttr.forEach(attr => {
            this[attr.type.code] += attr.value;
        })
        this.calculationBaseAttr();
        if (this.currHp > this.hp) {
            this.currHp = this.hp;
        }
        this.equips[equip.type] = equip;
        if (saveFlag) {
            this.save();
        }
    }
    unloadEquip (equipType) {
        if (this.equips[equipType]) {
            this.knapsack.push(this.equips[equipType]);
            this.equips[equipType].getBaseInfoCalculation().forEach(attr => {
                if (attr.code === "intervalBase") {
                    this.intervalBase = 1;
                } else {
                    this[attr.code] -= attr.value;
                }
            })
            this.equips[equipType].extraAttr.forEach(attr => {
                this[attr.type.code] -= attr.value;
            })
            this.equips[equipType] = null;
        }
        this.calculationBaseAttr();
        if (this.currHp > this.hp) {
            this.currHp = this.hp;
        }
        this.save();
    }
    saleEquip (equip) {
        this.knapsack.splice(this.knapsack.indexOf(equip), 1);
        this.save();
    }
    autoEquip () {
        let knapsack = [].concat(this.knapsack);
        knapsack = knapsack.filter(equip => {
            return this.getCurrEquipPower(equip) > this.getCombatPower();
        })
        knapsack.sort((a, b) => {
            return this.getCurrEquipPower(b) - this.getCurrEquipPower(a);
        })
        let equips = {
            Weapon: null,
            Helmet: null,
            Necklace: null,
            Clothes: null,
            Glove: null,
            Ring: null,
            Belt: null,
            Trousers: null,
            Shoes: null
        }
        knapsack.forEach(equip => {
            if (!equips[equip.type]) {
                equips[equip.type] = equip;
            }
        })
        Object.keys(equips).forEach(key => {
            if (equips[key]) {
                this.equipFn(equips[key]);
            }
        })
    }
    equipBaseSkill (skill) {
        this.baseSkill = skill;
        this.save();
    }
    unloadBaseSkill () {
        this.baseSkill = null;
        this.save();
    }
    save () {
        let player = deepCopy(this);
        delete player.knapsack;
        delete player.equips;
        localStorage.setItem("player", JSON.stringify(player));
        localStorage.setItem("equips", JSON.stringify(this.equips));
        localStorage.setItem("knapsack", JSON.stringify(this.knapsack));
        localStorage.setItem("baseSkill", JSON.stringify(this.baseSkill));
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
    getCurrEquipPower (equip) {
        let p = new Player(this);
        if (this.equips[equip.type]) {
            let oldEquip = this.equips[equip.type];
            oldEquip.getBaseInfoCalculation().forEach(attr => {
                p[attr.code] -= attr.value;
            })
            oldEquip.extraAttr.forEach(attr => {
                p[attr.type.code] -= attr.value;
            })
        }
        equip.getBaseInfoCalculation().forEach(attr => {
            p[attr.code] += attr.value;
        })
        equip.extraAttr.forEach(attr => {
            p[attr.type.code] += attr.value;
        })
        p.calculationBaseAttr();
        let cp = p.getCombatPower();
        p = null;
        return cp;
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
            name: "物抗"
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
    sendMsg (msg) {
        this.messageHandles.forEach(fn => {
            fn && fn(msg);
        });
    }
    receiveMsg (fn) {
        this.messageHandles.push(fn);
    }
}
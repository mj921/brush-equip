import Character from './character';
import { deepCopy } from './util';
import { PlayLvUpAttr, EquipQuality, EquipType } from './data';
export default class Player extends Character{
    /**
     * [constructor description]
     * @param  {Number} options.hp               [生命]
     * @param  {Number} options.lv               [等级]
     * @param  {Number} options.minAtk           [最小攻击]
     * @param  {Number} options.maxAtk           [最大攻击]
     * @param  {Number} options.def              [物抗]
     * @param  {Number} options.speed            [攻击速度]
     * @param  {Number} options.hit              [命中]
     * @param  {Number} options.dodge            [闪避]
     * @param  {Number} options.crt              [暴击]
     * @param  {Number} options.crtDamage        [暴击伤害]
     * @param  {Number} options.maxExp           [最大经验]
     * @param  {Number} options.currExp          [当前经验]
     * @param  {Number} options.goldCoin         [金币]
     * @param  {Number} options.baseMinAtk       [基础最小攻击]
     * @param  {Number} options.baseMaxAtk       [基础最大攻击]
     * @param  {Number} options.baseHp           [基础生命]
     * @param  {Number} options.baseDef          [基础物抗]
     * @param  {Number} options.baseMagicDef     [基础魔抗]
     * @param  {Number} options.baseMagicAtk     [基础法强]
     * @param  {Number} options.intervalBase     [基础攻击频率]
     * @param  {Number} options.extraAtk         [额外攻击]
     * @param  {Number} options.extraHp          [额外生命]
     * @param  {Number} options.extraDef         [额外物抗]
     * @param  {Number} options.extraMagicAtk    [额外法强]
     * @param  {Number} options.extraMagicDef    [额外魔抗]
     * @param  {[type]} options.knapsackCapacity [背包容量]
     * @return {[type]}                          [description]
     */
    constructor ({hp = 100, lv = 1, minAtk = 1, maxAtk = 5, def = 1, speed = 1, hit = 70, dodge = 0, crt = 0, crtDamage = 150, maxExp = 100, currExp = 0, goldCoin = 0, baseMinAtk = 1, baseMaxAtk = 5, baseHp = 100, baseDef = 1, baseMagicDef = 1, baseMagicAtk = 1, intervalBase = 1, extraAtk = 0, extraHp = 0, extraDef = 0, extraMagicAtk = 0, extraMagicDef = 0, knapsackCapacity = 100} = {}) {
        super({hp, lv, minAtk, maxAtk, def, speed, hit, dodge, crt, crtDamage});
        this.maxExp = maxExp;
        this.currExp = currExp;
        this.extraAtk = extraAtk;
        this.extraDef = extraDef;
        this.extraHp = extraHp;
        this.extraMagicAtk = extraMagicAtk;
        this.extraMagicDef = extraMagicDef;
        this.baseMinAtk = baseMinAtk;
        this.baseMaxAtk = baseMaxAtk;
        this.baseDef = baseDef;
        this.baseHp = baseHp;
        this.baseMagicDef = baseMagicDef;
        this.baseMagicAtk = baseMagicAtk;
        this.intervalBase = intervalBase;
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
        this.equipTypeFallDownNum = localStorage.getItem("equipTypeFallDownNum") ?
            JSON.parse(localStorage.getItem("equipTypeFallDownNum")) :
            (() => {
                let obj = {};
                Object.keys(EquipType).forEach(key => {
                    obj[key] = 0;
                })
                return obj
            })();
        this.equipQualityFallDownNum = localStorage.getItem("equipQualityFallDownNum") ?
            JSON.parse(localStorage.getItem("equipQualityFallDownNum")) :
            (() => {
                let obj = {};
                Object.keys(EquipQuality).forEach(key => {
                    obj[key] = 0;
                })
                return obj
            })();

        this.totalGoldCoin = +localStorage.getItem("totalGoldCoin") || 0;
    }
    // 获得经验
    getExp (exp) {
        this.currExp += exp;
        while (this.currExp >= this.maxExp) {
            this.levelUp();
        }
        this.save();
    }
    // 获得金币
    getGoldCoin (goldCoin) {
        this.goldCoin += goldCoin;
        this.totalGoldCoin += goldCoin;
        localStorage.setItem("goldCoin", this.goldCoin);
    }
    // 花费金币
    pay (goldCoin) {
        this.goldCoin -= goldCoin;
    }
    // 升级
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
    // 获得装备
    getEquips (equips, saleEquipRule) {
        equips.forEach(equip => {
            this.equipTypeFallDownNum[equip.type]++;
            this.equipQualityFallDownNum[equip.quality]++;
        })
        localStorage.setItem("equipTypeFallDownNum", JSON.stringify(this.equipTypeFallDownNum));
        localStorage.setItem("equipQualityFallDownNum", JSON.stringify(this.equipQualityFallDownNum));
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
    // 计算基础属性
    calculationBaseAttr () {
        this.minAtk = Math.floor(this.baseMinAtk * (100 + this.extraAtk) / 100);
        this.maxAtk = Math.floor(this.baseMaxAtk * (100 + this.extraAtk) / 100);
        this.def = Math.floor(this.baseDef * (100 + this.extraDef) / 100);
        this.magicDef = Math.floor(this.baseMagicDef * (100 + this.extraMagicDef) / 100);
        this.magicAtk = Math.floor(this.baseMagicAtk * (100 + this.extraMagicAtk) / 100);
        this.hp = Math.floor(this.baseHp * (100 + this.extraHp) / 100);
        this.interval = Math.floor(this.intervalBase * 100 -  this.speed) / 100;
    }
    // 装备装备
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
    // 卸下装备
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
    // 出售装备
    saleEquip (equip) {
        this.knapsack.splice(this.knapsack.indexOf(equip), 1);
        this.save();
    }
    // 一键装备
    autoEquip (n = 0) {
        let knapsack = [].concat(this.knapsack);
        knapsack = knapsack.filter(equip => {
            return this.getCurrEquipPower(equip) > this.getCombatPower();
        })
        knapsack.sort((a, b) => {
            return this.getCurrEquipPower(b) - this.getCurrEquipPower(a);
        })
        if (knapsack.length > 0) {
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
            });
            if (n < 10) {
                this.autoEquip(++n);
            }
        }
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
                if (attr.code === "intervalBase") {
                    p.intervalBase = 1;
                } else {
                    p[attr.code] -= attr.value;
                }
            })
            oldEquip.extraAttr.forEach(attr => {
                p[attr.type.code] -= attr.value;
            })
        }
        equip.getBaseInfoCalculation().forEach(attr => {
            if (attr.code === "intervalBase") {
                p.intervalBase = attr.value;
            } else {
                p[attr.code] += attr.value;
            }
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
            value: this.magicAtk,
            name: "法强"
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
            value: this.magicDef,
            name: "魔抗"
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
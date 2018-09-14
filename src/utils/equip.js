import { EquipType, EquipQuality, EquipExtraAttr, EquipPrice } from './data';
import { deepCopy, probRandom } from './util';
import EquipData from './equipData';
export default class Equip {
    // constructor ({type = "Weapon", quality = "Normal", lv = 1, minAtk = 0, maxAtk = 0, hp = 0, def = 0, speed = 0, hit = 0, dodge = 0, crt = 0, crtDamage = 0, extraAttr = []}) {
    constructor ({id = "ID1", accordingToId = true, quality = "Normal", lv = 1, minAtk = 0, maxAtk = 0, hp = 0, def = 0, speed = 0, hit = 0, dodge = 0, crt = 0, crtDamage = 0, extraAttr = [], lockFlag = false}) {
        if (accordingToId) {
            this.id = id;
            this.lv = lv;
            this.quality = quality;
            this.equipQuality = EquipQuality[quality];
            this.equipData = deepCopy(EquipData[id]);
            let growUpAttr = ["minAtk", "maxAtk", "hp", "def"];
            growUpAttr.forEach(attr => {
                if (this.equipData[attr]) {
                    this.equipData[attr][0] = this.equipData[attr][0] + this.equipData[attr][2] * (this.lv - 1);
                    this.equipData[attr][1] = this.equipData[attr][1] + this.equipData[attr][3] * (this.lv - 1);
                }
            })
            Object.keys(this.equipData).forEach(key => {
                if (this.equipData[key] instanceof Array) {
                    this.equipData[key][0] = Math.floor(this.equipData[key][0] * this.equipQuality.attrAddition);
                    this.equipData[key][1] = Math.floor(this.equipData[key][1] * this.equipQuality.attrAddition);
                }
            })
            this.type = this.equipData.type.code;
            this.equipType = this.equipData.type;
            this.minAtk = this.equipData.minAtk ? probRandom(this.equipData.minAtk) : 0;
            this.maxAtk = this.equipData.maxAtk ? probRandom(this.equipData.maxAtk) : 0;
            this.hp = this.equipData.hp ? probRandom(this.equipData.hp) : 0;
            this.def = this.equipData.def ? probRandom(this.equipData.def) : 0;
            this.speed = this.equipData.speed ? probRandom(this.equipData.speed) : 0;
            this.hit = this.equipData.hit ? probRandom(this.equipData.hit) : 0;
            this.dodge = this.equipData.dodge ? probRandom(this.equipData.dodge) : 0;
            this.crt = this.equipData.crt ? probRandom(this.equipData.crt) : 0;
            this.crtDamage = this.equipData.crtDamage ? probRandom(this.equipData.crtDamage) : 0;
            this.extraAttr = [];
            this.createExtraAttr();
        } else {
            this.id = id;
            this.equipData = EquipData[id];
            this.type = this.equipData.type.code;
            this.equipType = this.equipData.type;
            this.quality = quality;
            this.equipQuality = EquipQuality[quality];
            this.lv = lv;
            this.minAtk = minAtk;
            this.maxAtk = maxAtk;
            this.hp = hp;
            this.def = def;
            this.speed = speed;
            this.hit = hit;
            this.dodge = dodge;
            this.crt = crt;
            this.crtDamage = crtDamage;
            this.extraAttr = extraAttr;
        }
        this.lockFlag = lockFlag;
        this.price = (EquipPrice.Base + EquipPrice.LevelIncrease * (this.lv - 1)) * this.equipQuality.attrAddition;
    }
    createExtraAttr () {
        let equipExtraAttr = deepCopy(EquipExtraAttr);
        let additionalAttrNum = this.equipQuality.additionalAttrNum;
        let i;
        let attr;
        let val;
        while (additionalAttrNum > 0) {
            i = Math.floor(Math.random() * equipExtraAttr.length) + 1;
            i = Math.floor(Math.random() * i)
            attr = equipExtraAttr.splice(i, 1)[0];
            val = probRandom(attr.value);
            this.extraAttr.push({type: deepCopy(attr.type), value: val, values: attr.value});
            additionalAttrNum--;
        }
    }
    getName () {
        return this.equipQuality.name + "的" + this.equipType.name;
    }
    getColor () {
        return this.equipQuality.color;
    }
    lock () {
        this.lockFlag = true;
    }
    unlock () {
        this.lockFlag = false;
    }
    // 显示使用
    getBaseInfo () {
        let arr = [];
        if (this.minAtk || this.maxAtk) {
            arr.push({
                value: this.minAtk + " - " + this.maxAtk,
                round: [this.equipData.minAtk[0], this.equipData.maxAtk[1]],
                name: "攻击"
            })
        }
        if (this.hp) {
            arr.push({
                value: this.hp,
                round: [].concat(this.equipData.hp.slice(0, 2)),
                name: "生命"
            })
        }
        if (this.def) {
            arr.push({
                value: this.def,
                round: [].concat(this.equipData.def.slice(0, 2)),
                name: "防御"
            })
        }
        if (this.speed) {
            arr.push({
                value: this.speed + "%",
                round: [].concat(this.equipData.speed.slice(0, 2)),
                name: "攻击速度"
            })
        }
        if (this.hit) {
            arr.push({
                value: this.hit + "%",
                round: [].concat(this.equipData.hit.slice(0, 2)),
                name: "命中"
            })
        }
        if (this.dodge) {
            arr.push({
                value: this.dodge + "%",
                round: [].concat(this.equipData.dodge.slice(0, 2)),
                name: "闪避"
            })
        }
        if (this.crt) {
            arr.push({
                value: this.crt + "%",
                round: [].concat(this.equipData.crt.slice(0, 2)),
                name: "暴击率"
            })
        }
        if (this.crtDamage) {
            arr.push({
                value: this.crtDamage + "%",
                round: [].concat(this.equipData.crtDamage.slice(0, 2)),
                name: "暴击伤害"
            })
        }
        return arr;
    }
    // 计算使用
    getBaseInfoCalculation () {
        let arr = [];
        if (this.minAtk) {
            arr.push({
                value: this.minAtk,
                code: "baseMinAtk"
            })
        }
        if (this.maxAtk) {
            arr.push({
                value: this.maxAtk,
                code: "baseMaxAtk"
            })
        }
        if (this.hp) {
            arr.push({
                value: this.hp,
                code: "baseHp"
            })
        }
        if (this.def) {
            arr.push({
                value: this.def,
                code: "baseDef"
            })
        }
        if (this.speed) {
            arr.push({
                value: this.speed,
                code: "speed"
            })
        }
        if (this.hit) {
            arr.push({
                value: this.hit,
                code: "hit"
            })
        }
        if (this.dodge) {
            arr.push({
                value: this.dodge,
                code: "dodge"
            })
        }
        if (this.crt) {
            arr.push({
                value: this.crt,
                code: "crt"
            })
        }
        if (this.crtDamage) {
            arr.push({
                value: this.crtDamage,
                code: "crtDamage"
            })
        }
        return arr;
    }
}
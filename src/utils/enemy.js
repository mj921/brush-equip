import Character from './character';
import EnemyData from './enemyData';
import Equip from './equip';
import { Suffix, Color, NormalProbabilityEnemyFallDown, EquipQuality, EquipType, ProbabilityArr } from './data';
import { deepCopy } from './util';
export default class Enemy extends Character {
    constructor (type = "Slime", suffix = "Normal", lv = 1) {
        let characterData = deepCopy(EnemyData[type]);
        let suffixObj = Suffix[suffix];
        let enLv = lv - 1 + suffixObj.addLv;
        enLv = enLv > 0 ? enLv : 0;
        if (characterData) {
            characterData.hp = characterData.hp + characterData.hpI * enLv;
            characterData.minAtk = characterData.minAtk + characterData.minAtkI * enLv;
            characterData.maxAtk = characterData.maxAtk + characterData.maxAtkI * enLv;
            characterData.def = characterData.def + characterData.defI * enLv;
            characterData.lv = lv;
        } else {
            characterData = {
                name: "敌人",
                hp: 100,
                atk: 1,
                def: 1,
                speed: 1,
                hit: 50,
                dodge: 0,
                crt: 0,
                crtDamage: 150,
                hpI: 20,
                atkI: 1,
                defI: 1,
                exp: 1,
                lv
            }
        }
        super(characterData);
        this.exp = characterData.exp + characterData.expI * enLv;
        this.exp = this.exp > 0 ? this.exp : 1;
        this.name = `[${suffixObj.name}]${characterData.name}`;
        this.enemyType = type;
        this.color = suffixObj.color;
        this.suffix = suffix;
        this.equips = characterData.equips || [];
    }
    fallDownEquipment () {
        let proNumArr = ProbabilityArr(NormalProbabilityEnemyFallDown[this.suffix]);
        let total = proNumArr.reduce((total, num) => {
            return (typeof total === "number" ? total : total.value) + num.value;
        })
        let currP = Math.floor(Math.random() * total);
        let equipQuality = "Inferior";
        for (let i = 0; i < proNumArr.length; i++) {
            currP -= proNumArr[i].value;
            if (currP < 0) {
                equipQuality = proNumArr[i].key;
                break;
            }
        }
        let lv = this.lv - Math.floor(Math.random() * 5);
        lv = lv > 0 ? lv : 1;
        let equip = new Equip({id: this.equips[Math.floor(Math.random() * this.equips.length)], quality: equipQuality, lv });
        return equip;
    }
}
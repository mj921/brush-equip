import Character from './character';
import EnemyData from './enemyData';
import Equip from './equip';
import { Suffix, Color, NormalProbabilityEnemyFallDown, EquipQuality, EquipType, ProbabilityArr } from './data';
import { deepCopy } from './util';
export default class Enemy extends Character {
    constructor (type = "Slime", suffix = "Normal", lv = 1) {
        let characterData = deepCopy(EnemyData[type]);
        let suffixObj = Suffix[suffix];
        if (characterData) {
            characterData.hp = characterData.hp + characterData.hpI * (lv - 1 + suffixObj.addLv);
            characterData.atk = characterData.atk + characterData.atkI * (lv - 1 + suffixObj.addLv);
            characterData.def = characterData.def + characterData.defI * (lv - 1 + suffixObj.addLv);
            characterData.lv = lv;
        } else {
            characterData = {
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
        this.exp = characterData.exp + characterData.expI * (lv - 1 + suffixObj.addLv);
        this.name = `[${suffixObj.name}]${characterData.name}`;
        this.enemyType = type;
        this.color = suffixObj.color;
        this.suffix = suffix;
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
        // let equipTypeKeys = Object.keys(EquipType);
        // let equipType = EquipType[equipTypeKeys[Math.floor(Math.random() * equipTypeKeys.length)]].name;
        let equip = new Equip({id: "ID1", quality: equipQuality, lv: this.lv });
        console.log(equip);
        return equip;
    }
}
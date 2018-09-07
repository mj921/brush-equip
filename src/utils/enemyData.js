import { EquipType, EquipQuality } from './data';
import EquipData from './equipData';
const enemyData = {
    Slime: {
        name: "史莱姆",
        hp: 100,
        minAtk: 1,
        maxAtk: 1,
        def: 1,
        speed: 1,
        hit: 50,
        dodge: 0,
        crt: 0,
        crtDamage: 150,
        exp: 1,
        hpI: 20,
        atkI: 1,
        defI: 1,
        expI: 1,
        equips: [EquipData.ID1]
    }
}
export default enemyData;
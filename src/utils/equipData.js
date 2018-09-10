import { EquipType } from './data';
const EquipData = {
    ID1: {
        type: EquipType.Weapon,
        lv: 1,
        minAtk: [1, 5, 5, 6],
        maxAtk: [5, 10, 6, 7]
    },
    ID2: {
        type: EquipType.Clothes,
        lv: 1,
        hp: [5, 20, 20, 25],
        def: [2, 8, 5, 6]
    },
    ID3: {
        type: EquipType.Helmet,
        lv: 1,
        def: [1, 5, 4, 5]
    },
    ID4: {
        type: EquipType.Belt,
        lv: 1,
        hp: [5, 10, 10, 15],
    },
    ID5: {
        type: EquipType.Glove,
        lv: 1,
        minAtk: [0, 0, 0, 0],
        maxAtk: [1, 3, 3, 4],
        def: [1, 5, 4, 5]
    },
    ID6: {
        type: EquipType.Shoes,
        lv: 1,
        dodge: [1, 3],
        def: [1, 3, 3, 4]
    },
    ID7: {
        type: EquipType.Necklace,
        lv: 1,
        minAtk: [1, 3, 3, 4],
        maxAtk: [2, 4, 4, 5],
        hp: [5, 10, 10, 15]
    },
    ID8: {
        type: EquipType.Ring,
        lv: 1,
        crt: [1, 5],
        crtDamage: [5, 10]
    },
    ID9: {
        type: EquipType.Trousers,
        lv: 1,
        hp: [3, 10, 8, 12],
        def: [2, 6, 5, 6]
    }
}
export default EquipData;
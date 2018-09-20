import { EquipType } from './data';
const EquipData = {
    ID1: {
        type: EquipType.Weapon,
        lv: 1,
        name: "剑",
        intervalBase: 1,
        minAtk: [1, 5, 5, 6],
        maxAtk: [5, 10, 6, 7]
    },
    ID2: {
        type: EquipType.Clothes,
        lv: 1,
        name: "衣服",
        hp: [5, 20, 20, 25],
        def: [2, 8, 5, 6]
    },
    ID3: {
        type: EquipType.Helmet,
        lv: 1,
        name: "头盔",
        def: [1, 5, 4, 5]
    },
    ID4: {
        type: EquipType.Belt,
        lv: 1,
        name: "腰带",
        hp: [5, 10, 10, 15],
    },
    ID5: {
        type: EquipType.Glove,
        lv: 1,
        name: "手套",
        minAtk: [0, 0, 1, 1],
        maxAtk: [1, 3, 3, 4],
        def: [1, 5, 4, 5]
    },
    ID6: {
        type: EquipType.Shoes,
        lv: 1,
        name: "鞋子",
        dodge: [1, 3],
        def: [1, 3, 3, 4]
    },
    ID7: {
        type: EquipType.Necklace,
        lv: 1,
        name: "项链",
        hp: [5, 10, 10, 15],
        crtDamage: [5, 10]
    },
    ID8: {
        type: EquipType.Ring,
        lv: 1,
        name: "戒指",
        crt: [1, 5],
        minAtk: [1, 3, 3, 4],
        maxAtk: [2, 4, 4, 5]
    },
    ID9: {
        type: EquipType.Trousers,
        lv: 1,
        name: "裤子",
        hp: [3, 10, 8, 12],
        def: [2, 6, 5, 6]
    },
    ID10: {
        type: EquipType.Weapon,
        lv: 1,
        name: "匕首",
        intervalBase: 0.8,
        minAtk: [1, 3, 3, 4],
        maxAtk: [3, 7, 4, 5]
    },
    ID11: {
        type: EquipType.Weapon,
        lv: 1,
        name: "斧",
        intervalBase: 1.2,
        minAtk: [2, 7, 6, 7],
        maxAtk: [7, 13, 7, 8]
    },
    ID12: {
        type: EquipType.Weapon,
        lv: 1,
        name: "锤",
        intervalBase: 1.5,
        minAtk: [2, 8, 8, 9],
        maxAtk: [8, 16, 9, 10]
    },
    ID12: {
        type: EquipType.Weapon,
        lv: 1,
        name: "法杖",
        intervalBase: 1,
        magic: [3, 7, 5, 6]
    }
}
export default EquipData;
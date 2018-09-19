// 颜色
export const Color = {
    Gray: "#bbb",
    Black: "#000",
    Green: "#7FFF00",
    Blue: "#15A5F3",
    Violet: "#B828F4", // 紫色
    Yellow: "#FFD700",
    Red: "#FF0000",
    DarkGold: "#D2691E"
}
// 怪物词缀
export const Suffix = {
    Puniness: {color: Color.Gray, name: "弱小", addLv: -2},
    Normal: {color: Color.Black, name: "普通", addLv: 0},
    Variation: {color: Color.Green, name: "变异", addLv: 1},
    Elites: {color: Color.Blue, name: "精英", addLv: 2},
    Head: {color: Color.Violet, name: "头目", addLv: 4},
    Boss: {color: Color.Yellow, name: "首领", addLv: 8},
    VariationBoss: {color: Color.Red, name: "变异首领", addLv: 12},
    ElitesBoss: {color: Color.DarkGold, name: "精英首领", addLv: 16}
}
// 怪物数量几率
export const NormalProbabilityEnemyNum = {
    1: 725,
    2: 250,
    3: 20,
    4: 4,
    5: 1
}
// 怪物数量几率
export const BossProbabilityEnemyNum = {
    1: 980,
    2: 10,
    3: 5,
    4: 4,
    5: 1
}
// 普通怪物词缀几率
export const NormalProbabilityEnemySuffix = {
    Puniness: 1000,
    Normal: 7844,
    Variation: 1000,
    Elites: 100,
    Head: 50,
    Boss: 3,
    VariationBoss: 2,
    ElitesBoss: 1
}
// boss怪物词缀几率
export const BossProbabilityEnemySuffix = {
    Puniness: 0,
    Normal: 0,
    Variation: 3000,
    Elites: 6740,
    Head: 200,
    Boss: 30,
    VariationBoss: 20,
    ElitesBoss: 10
}
// 生成概率数组
export const ProbabilityArr = (probability) => {
    let arr = [];
    Object.keys(probability).forEach(key => {
        arr.push({key: key, value: probability[key]})
    })
    return arr;
}
// 装备类型
export const EquipType = {
    Helmet: {name: "头盔", code: "Helmet"},
    Clothes: {name: "衣服", code: "Clothes"},
    Belt: {name: "腰带", code: "Belt"},
    Glove: {name: "手套", code: "Glove"},
    Shoes: {name: "鞋子", code: "Shoes"},
    Weapon: {name: "武器", code: "Weapon"},
    Necklace: {name: "项链", code: "Necklace"},
    Ring: {name: "戒指", code: "Ring"},
    Trousers: {name: "裤子", code: "Trousers"}
}
// 装备品质 [attrAddition: 基础属性倍率(打磨、洗炼、强化价格也通过这个计算), additionalAttrNum: 装备额外属性数量]
export const EquipQuality = {
    Inferior: {name: "劣质", color: Color.Gray, additionalAttrNum: 0, code: "Inferior", attrAddition: 0.8},
    Normal: {name: "普通", color: Color.Black, additionalAttrNum: 0, code: "Normal", attrAddition: 1},
    Excellent: {name: "优秀", color: Color.Green, additionalAttrNum: 1, code: "Excellent", attrAddition: 1.1},
    Polish: {name: "精良", color: Color.Blue, additionalAttrNum: 2, code: "Polish", attrAddition: 1.2},
    Rare: {name: "稀有", color: Color.Violet, additionalAttrNum: 3, code: "Rare", attrAddition: 1.3},
    Epic: {name: "史诗", color: Color.Yellow, additionalAttrNum: 4, code: "Epic", attrAddition: 1.5},
    Legend: {name: "传说", color: Color.Red, additionalAttrNum: 5, code: "Legend", attrAddition: 1.7},
    Myth: {name: "神话", color: Color.DarkGold, additionalAttrNum: 6, code: "Myth", attrAddition: 2}
}
// 怪物装备掉落概率
export const NormalProbabilityEnemyFallDown = {
    Puniness: {
        Inferior: 7000,
        Normal: 2900,
        Excellent: 100
    },
    Normal: {
        Inferior: 1900,
        Normal: 7000,
        Excellent: 1000,
        Polish: 100
    },
    Variation: {
        Inferior: 500,
        Normal: 6000,
        Excellent: 2400,
        Polish: 1000,
        Rare: 100
    },
    Elites: {
        Inferior: 100,
        Normal: 5000,
        Excellent: 3000,
        Polish: 1000,
        Rare: 800,
        Epic: 100
    },
    Head: {
        Inferior: 100,
        Normal: 4000,
        Excellent: 3400,
        Polish: 1300,
        Rare: 1000,
        Epic: 199,
        Legend: 1
    },
    Boss: {
        Inferior: 1,
        Normal: 4000,
        Excellent: 3400,
        Polish: 1300,
        Rare: 1038,
        Epic: 250,
        Legend: 10,
        Myth: 1
    },
    VariationBoss: {
        Inferior: 1,
        Normal: 3000,
        Excellent: 4384,
        Polish: 1300,
        Rare: 1000,
        Epic: 260,
        Legend: 50,
        Myth: 5
    },
    ElitesBoss: {
        Inferior: 1,
        Normal: 3000,
        Excellent: 4089,
        Polish: 1500,
        Rare: 1000,
        Epic: 300,
        Legend: 100,
        Myth: 10
    }
}

export const EquipAttributeType = {
    MinAtk: {name: "最小攻击", suffix: "", code: "minAtk"},
    MaxAtk: {name: "最大攻击", suffix: "", code: "maxAtk"},
    Hp: {name: "生命", suffix: "", code: "hp"},
    Def: {name: "防御", suffix: "", code: "def"},
    BaseMinAtk: {name: "基础最小攻击", suffix: "", code: "baseMinAtk"},
    BaseMaxAtk: {name: "基础最大攻击", suffix: "", code: "baseMaxAtk"},
    BaseHp: {name: "基础生命", suffix: "", code: "baseHp"},
    BaseDef: {name: "基础防御", suffix: "", code: "baseDef"},
    Speed: {name: "攻击速度", suffix: "%", code: "speed"},
    Hit: {name: "命中", suffix: "%", code: "hit"},
    Dodge: {name: "闪避", suffix: "%", code: "dodge"},
    Crt: {name: "暴击率", suffix: "%", code: "crt"},
    CrtDamage: {name: "暴击伤害", suffix: "%", code: "crtDamage"},
    ExtraAtk: {name: "额外攻击", suffix: "%", code: "extraAtk"},
    ExtraHp: {name: "额外生命", suffix: "%", code: "extraHp"},
    ExtraDef: {name: "额外防御", suffix: "%", code: "extraDef"}
}

export const EquipExtraAttr = [
    {
        type: EquipAttributeType.Hit,
        value: [1, 10]
    },
    {
        type: EquipAttributeType.Dodge,
        value: [1, 10]
    },
    {
        type: EquipAttributeType.CrtDamage,
        value: [1, 50]
    },
    {
        type: EquipAttributeType.Crt,
        value: [1, 5]
    },
    {
        type: EquipAttributeType.Speed,
        value: [1, 20]
    },
    {
        type: EquipAttributeType.ExtraHp,
        value: [1, 5]
    },
    {
        type: EquipAttributeType.ExtraDef,
        value: [1, 5]
    },
    {
        type: EquipAttributeType.ExtraAtk,
        value: [1, 5]
    }
]
export const PlayLvUpAttr = {
    [EquipAttributeType.BaseMaxAtk.code]: 5,
    [EquipAttributeType.BaseMinAtk.code]: 1,
    [EquipAttributeType.BaseHp.code]: 50,
    [EquipAttributeType.BaseDef.code]: 3
}

export const EquipPrice = {
    Base: 10,
    LevelIncrease: 10
}
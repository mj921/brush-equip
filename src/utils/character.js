export default class Character{
    constructor ({name = "你", hp = 100, lv = 1, minAtk = 1, maxAtk = 5, def = 1, speed = 0, hit = 50, dodge = 0, crt = 0, crtDamage = 150} = {}) {
        this.name = name;
        this.hp = hp;
        this.currHp = hp;
        this.lv = lv;
        this.minAtk = minAtk;
        this.maxAtk = maxAtk;
        this.def = def;
        this.speed = speed;
        this.intervalBase = 1;
        this.interval = Math.floor(this.intervalBase * 100 -  this.speed) / 100
        this.hit = hit; // 命中
        this.dodge = dodge; // 闪避
        this.crt = crt; // 暴击
        this.crtDamage = crtDamage;
    }
    // 伤害减免
    getDamageRemission () {
        return this.def / (this.def + this.lv * 100);
    }
    attack (enemy) {
        let obj = {};
        if (Math.random() * 100 < this.hit && Math.random() * 100 >= enemy.dodge) {
            let damage = (Math.random() * (this.maxAtk - this.minAtk) + this.minAtk) * (1 - enemy.getDamageRemission());
            let crtFlag = false;
            if (Math.random() * 100 < this.crt) {
                damage *= (this.crtDamage / 100);
                crtFlag = true;
            }
            damage = damage > 1 ? Math.floor(damage) : 1;
            if (enemy.currHp > damage) {
                enemy.currHp -= damage;
            } else {
                enemy.currHp = 0;
            }
            obj.msg = `<span style='color: ${this.color || '#F67712'};'>${this.name}</span> 对 <span style='color: ${enemy.color || '#F67712'};'>${enemy.name}</span> 造成 <span style='color: #F32020;${crtFlag ? 'font-size: 0.32rem;' : ''}'>${damage}</span> 伤害`;
        }
        obj.currHp = enemy.currHp;
        return obj;
    }
    toString () {
        return `hp: ${this.hp}, lv: ${this.lv}`;
    }
    getCombatPower () {
        // return [((this.maxAtk + this.minAtk) / 2 / this.interval * (1 + this.crt * this.crtDamage / 100)) * this.hit / 100, this.hp / (1 - this.getDamageRemission()) / (100 - this.dodge) / 100];
        return Math.floor(((this.maxAtk + this.minAtk) / 2 / this.interval * (1 + this.crt * this.crtDamage / 100)) * this.hit / 100 + this.hp / (1 - this.getDamageRemission()) / (100 - this.dodge) / 100);
    }
}
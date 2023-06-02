import { DamageType, TextDamageType } from './data';
export default class Skill {
  /**
   * [constructor description]
   * @param  {String} options.name       [名称]
   * @param  {[type]} options.damageType [伤害类型]
   * @param  {Number} options.baseDamage [基础伤害]
   * @param  {Number} options.addition   [加成比例]
   * @return {[type]}                    [description]
   */
  constructor({
    name = '',
    code = '',
    damageType = DamageType.Physical,
    baseDamage = 0,
    addition = 100,
  }) {
    this.code = code;
    this.name = name;
    this.damageType = damageType;
    this.baseDamage = baseDamage;
    this.addition = addition;
  }
  getDamage(atk = 0) {
    return this.baseDamage + Math.floor((atk * this.addition) / 100);
  }
  getDescribe() {
    return `对单个敌人造成 ${this.addition} % 的 ${
      TextDamageType[this.damageType]
    }`;
  }
}

import {
  BossProbabilityEnemyNum,
  BossProbabilityEnemySuffix,
  NormalProbabilityEnemyNum,
  NormalProbabilityEnemySuffix,
  ProbabilityArr,
} from './data';
import Enemy from './enemy';
import enemyData from './enemyData';

export const getProbabilityEnemy = (normal, boss, enemyNum, enemyNumMax) => {
  const probabilityEnemy = Object.keys(normal).reduce((o, key) => {
    o[key] =
      normal[key] + ((boss[key] - normal[key]) * enemyNum) / (enemyNumMax - 1);
    return o;
  }, {});
  let proEnemyArr = ProbabilityArr(probabilityEnemy);
  let total = proEnemyArr.reduce((total, num) => {
    return (typeof total === 'number' ? total : total.value) + num.value;
  });
  let currP = Math.floor(Math.random() * total);
  for (let i = 0; i < proEnemyArr.length; i++) {
    currP -= proEnemyArr[i].value;
    if (currP < 0) {
      return proEnemyArr[i];
    }
  }
};
/** 创建怪物 */
export const createEnemy = (enemyNum, enemyNumMax, enemyLv) => {
  const proEnemySuffixItem = getProbabilityEnemy(
    NormalProbabilityEnemySuffix,
    BossProbabilityEnemySuffix,
    enemyNum,
    enemyNumMax
  );
  let enemyTypeArr = Object.keys(enemyData);
  if (proEnemySuffixItem) {
    return new Enemy(
      enemyTypeArr[~~(Math.random() * enemyTypeArr.length)],
      proEnemySuffixItem.key,
      enemyLv
    );
  }
  return null;
};

export const createEnemys = (enemyNum, enemyNumMax, enemyLv) => {
  const proEnemyNumItem = getProbabilityEnemy(
    NormalProbabilityEnemyNum,
    BossProbabilityEnemyNum,
    enemyNum,
    enemyNumMax
  );
  const enemys = [];
  for (let i = 0; i < +proEnemyNumItem.key; i++) {
    const enemy = createEnemy(enemyNum, enemyNumMax, enemyLv);
    if (enemy) {
      enemys.push(enemy);
    }
  }
  return enemys;
};

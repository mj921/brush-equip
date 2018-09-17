<template>
    <div class="knapsack" v-show="visible">
        <div class="container">
            <div class="already-equipped">
                <dl v-for="key in Object.keys(player.equips)" :key="key">
                    <template v-if="player.equips[key]">
                        <span :style="'color:' + player.equips[key].getColor()" @click="showEquipDetail(player.equips[key], 'unload')">{{player.equips[key].getName()}} (lv: {{player.equips[key].lv}})</span>
                        <button @click="unloadEquip(key)">卸下</button>
                    </template>
                    <span v-else>未装备{{EquipType[key].name}}</span>
                </dl>
            </div>
            <div class="not-equip">
                <dl v-for="(equip, i) in player.knapsack" :key="i">
                    <span :style="'color:' + equip.getColor()" @click="showEquipDetail(equip, 'equip')">{{equip.getName()}} (lv: {{equip.lv}})</span>
                    <span class="red-text" v-if="player.getCurrEquipPower(equip) > player.getCombatPower()">+{{player.getCurrEquipPower(equip) - player.getCombatPower()}}</span>
                    <span class="green-text" v-else>{{player.getCurrEquipPower(equip) - player.getCombatPower()}}</span>
                    <div class="btn-group">
                        <button @click="equipFn(equip)">装备</button>
                        <button @click="equip.unlock()" v-if="equip.lockFlag">解锁</button>
                        <button @click="equip.lock()" v-else>锁上</button>
                        <button @click="sale(equip)" v-show="!equip.lockFlag">出售</button>
                    </div>
                </dl>
            </div>
            <div class="knapsack-bottom clearfix">
                <div class="fl">
                    <button @click="showMultSale">批量出售</button>
                    <button @click="autoEquip">一键装备</button>
                </div>
                <div class="fr">
                    <button @click="close">关闭</button>
                </div>
            </div>
            <div class="equip-info" v-show="detailVisible" @click="closeDetail">
                <be-equip-detail
                    v-if="!!currEquip"
                    class="curr-equip"
                    btnType="unload"
                    :equip="currEquip"
                    @unload="unloadEquip(equip.type)"
                    @strengthen="strengthen"
                    @burnish="burnish"></be-equip-detail>
                <be-equip-detail
                    :equip="equip"
                    :btnType="btnType"
                    :powerUp="powerUp"
                    @equip="equipFn(equip)"
                    @unload="unloadEquip(equip.type)"
                    @strengthen="strengthen"
                    @burnish="burnish"
                    @sale="sale"></be-equip-detail>
            </div>
            <div class="equip-info" v-show="multSaleVisible" @click="closeMultSale">
                <div class="mult-sale-container" @click="stopProp($event)">
                    <template v-for="equipQuality in equipQualityList">
                        <dl>
                            <input :key="equipQuality.code" type="checkbox" v-model="equipQuality.value" :id="'multSale' + equipQuality.code"><label :for="'multSale' + equipQuality.code">{{equipQuality.name}}</label>
                        </dl>
                    </template>
                    <div class="sale-btn-group clearfix">
                        <button @click="multSale">批量出售</button>
                        <button @click="allSale">全部出售</button>
                        <button @click="intelligenceSale">智能出售</button>
                        <button @click="closeMultSale">关闭</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BeEquipDetail from './equipDetail.vue';
    import { EquipQuality, EquipType } from '@/utils/data';
    import { deepCopy } from '@/utils/util';
    export default {
        data () {
            return {
                detailVisible: false,
                equip: null,
                btnType: 'equip',
                currEquip: null,
                powerUp: "",
                multSaleVisible: false,
                equipQualityList: Object.values(deepCopy(EquipQuality)).map(item => {
                    return Object.assign(item, {value: false})
                }),
                EquipType
            }
        },
        props: {
            player: Object,
            visible: {
                type: Boolean,
                default: false
            }
        },
        inject: ["log"],
        methods: {
            showEquipDetail (equip, btnType) {
                if (btnType === "equip") {
                    this.currEquip = this.player.equips[equip.type];
                    let powerUp = this.player.getCurrEquipPower(equip) - this.player.getCombatPower();
                    this.powerUp = powerUp > 0 ? "+" + powerUp : "" + powerUp;
                } else {
                    this.currEquip = null;
                    this.powerUp = "";
                }
                this.detailVisible = true;
                this.equip = equip;
                this.btnType = btnType;
            },
            closeDetail () {
                this.detailVisible = false;
            },
            close () {
                this.$emit("update:visible", false);
            },
            equipFn (equip) {
                this.player.equipFn(equip);
                this.detailVisible = false;
            },
            unloadEquip (equipType) {
                this.player.unloadEquip(equipType);
                this.detailVisible = false;
            },
            sale (equip) {
                this.detailVisible = false;
                if (!equip.lockFlag) {
                    this.player.saleEquip(equip);
                    this.player.getGoldCoin(equip.price);
                }
            },
            closeMultSale () {
                this.multSaleVisible = false;
            },
            showMultSale () {
                this.multSaleVisible = true;
            },
            stopProp (e) {
                e.stopPropagation();
            },
            multSale () {
                let saleQuality = this.equipQualityList.filter(item => item.value).map(item => item.code);
                if (saleQuality.length > 0) {
                    let saleEquips = this.player.knapsack.filter(equip => saleQuality.indexOf(equip.quality) > -1);
                    saleEquips.forEach(equip => {this.sale(equip)});
                }
                this.closeMultSale();
            },
            allSale () {
                let equips = [].concat(this.player.knapsack);
                equips.forEach(equip => {
                    this.sale(equip);
                })
                this.closeMultSale();
            },
            intelligenceSale () {
                let equips = this.player.knapsack.filter(equip => this.player.getCurrEquipPower(equip) < this.player.getCombatPower());
                equips.forEach(equip => {
                    this.sale(equip);
                })
                this.closeMultSale();
            },
            strengthen (equip) {
                let strengthenPrice = equip.getStrengthenPrice();
                if (strengthenPrice <= this.player.goldCoin) {
                    this.player.pay(strengthenPrice);
                    this.unloadEquip(equip.type);
                    if (equip.strengthen()) {
                        this.log("强化成功");
                        this.$message({message: "强化成功"});
                    } else {
                        this.log("强化失败");
                        this.$message({message: "强化失败"});
                    }
                    this.equipFn(equip);
                } else {
                    this.log("金币不足");
                    this.$message({message: "金币不足"});
                }
            },
            burnish (equip) {
                let burnishPrice = equip.getStrengthenPrice();
                if (burnishPrice <= this.player.goldCoin) {
                    this.player.pay(burnishPrice);
                    this.unloadEquip(equip.type);
                    equip.burnish();
                    this.log("打磨成功");
                    this.$message({message: "打磨成功"});
                    this.equipFn(equip);
                } else {
                    this.log("金币不足");
                    this.$message({message: "金币不足"});
                }
            },
            autoEquip () {
                this.player.autoEquip();
            }
        },
        components: {
            BeEquipDetail
        }
    }
</script>

<style lang="scss" scoped>
    .knapsack{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: $maskColor;
        .container{
            margin: 0.1rem;
            width: calc(100% - 0.2rem);
            height: calc(100% - 0.2rem);
            background-color: $white;
            .already-equipped{
                margin-bottom: 0.1rem;
                height: 4.05rem;
                padding: 0.1rem;
                border-bottom: 1px solid $black;
                dl{
                    padding: 0 0.2rem;
                    height: 0.45rem;
                    font-size: 0.32rem;
                    line-height: 0.45rem;
                    span{
                        float: left;
                    }
                    button{
                        float: right;
                        height: 0.4rem;
                    }
                }
            }
            .not-equip{
                height: calc(100% - 5.45rem);
                padding: 0.1rem;
                border-bottom: 1px solid $black;
                overflow: auto;
                dl{
                    padding: 0 0.2rem;
                    height: 0.45rem;
                    font-size: 0.32rem;
                    line-height: 0.45rem;
                    span{
                        float: left;
                        &.red-text{
                            color: $red;
                            margin-left: 0.2rem;
                        }
                        &.green-text{
                            color: $green;
                            margin-left: 0.2rem;
                        }
                    }
                    .btn-group{
                        float: right;
                        button{
                            height: 0.4rem;
                        }
                    }
                }
            }
            .equip-info{
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                padding: 0.4rem 0;
                background-color: $maskColor;
            }
            .mult-sale-container{
                margin: 0 auto;
                background-color: $white;
                width: 5rem;
                font-size: 0.28rem;
                padding: 0.4rem;
                dl{
                    display: inline-block;
                    width: 50%;
                    line-height: 0.3rem;
                    input{
                        margin-right: 0.2rem;
                        width: 0.3rem;
                        height: 0.3rem;
                        background-color: $white;
                    }
                }
            }
            .knapsack-bottom{
                padding: 0.2rem;    
            }
            .sale-btn-group{
                padding: 0.2rem 0;
            }
        }
        .curr-equip{
            margin-bottom: 0.1rem;
        }
    }
</style>
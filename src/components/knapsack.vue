<template>
    <div class="knapsack" v-show="visible">
        <div class="container">
            <div class="already-equipped">
                <dl v-for="key in Object.keys(player.equips)" :key="key">
                    <template v-if="player.equips[key]">
                        <span :style="'color:' + player.equips[key].getColor()" @click="showEquipDetail(player.equips[key], 'unload')">{{player.equips[key].getName()}}</span>
                        <button @click="unloadEquip(key)">卸下</button>
                    </template>
                    <span v-else>未装备</span>
                </dl>
            </div>
            <div class="not-equip">
                <dl v-for="(equip, i) in player.knapsack" :key="i">
                    <span :style="'color:' + equip.getColor()" @click="showEquipDetail(equip, 'equip')">{{equip.getName()}}</span>
                    <button @click="equipFn(equip)">装备</button>
                    <button @click="sell(equip)">出售</button>
                </dl>
            </div>
            <div class="knapsack-bottom">
                <button @click="close">关闭</button>
            </div>
            <div class="equip-info" v-show="detailVisible" @click="closeDetail">
                <be-equip-detail :equip="equip" :btnType="btnType" @equip="equipFn(equip)" @unload="unloadEquip(equip.type)"></be-equip-detail>
            </div>
        </div>
    </div>
</template>

<script>
    import BeEquipDetail from './equipDetail.vue';
    export default {
        data () {
            return {
                detailVisible: false,
                equip: null,
                btnType: 'equip'
            }
        },
        props: {
            player: Object,
            visible: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            showEquipDetail (equip, btnType) {
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
            sell (equip) {
                this.player.sellEquip(equip);
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
                    font-size: 0.28rem;
                    line-height: 0.45rem;
                    button{
                        float: right;
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
                    font-size: 0.28rem;
                    line-height: 0.45rem;
                    button{
                        float: right;
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
            .knapsack-bottom{
                padding: 0.2rem;
                button{
                    float: right;
                }                
            }
        }
    }
</style>
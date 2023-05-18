<template>
    <div class="setting" v-show="visible">
        <div class="container">
            <div class="main">
                <div class="sale-rule-container">
                    <dl :key="item.code" v-for="item in saleEquipRuleList">
                        <input
                            type="checkbox"
                            :checked="item.code === saleEquipRuleVal"
                            :key="item.code"
                            :value="item.code"
                            :id="'saleRule' + item.code"
                            name="saleEquipRule"
                            @click="saleEquipRuleClick(item.code)"/>
                        <label :style="'color: ' + item.color" :for="'saleRule' + item.code">{{item.name}}</label>
                    </dl>
                    <div>
                        <button>保存</button>
                    </div>
                </div>
            </div>
            <div class="setting-bottom clearfix">
                <div class="fr">
                    <button @click="save">保存</button>
                    <button @click="close">关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { EquipQuality, Color } from '@/utils/data';
    export default {
        data () {
            return {
                saleEquipRuleVal: "",
                saleEquipRuleList: [
                    {
                        code: "auto",
                        name: "智能",
                        color: Color.Black
                    },
                    {
                        code: EquipQuality.Excellent.code,
                        name: EquipQuality.Excellent.name + "以下",
                        color: EquipQuality.Excellent.color
                    },
                    {
                        code: EquipQuality.Polish.code,
                        name: EquipQuality.Polish.name + "以下",
                        color: EquipQuality.Polish.color
                    },
                    {
                        code: EquipQuality.Rare.code,
                        name: EquipQuality.Rare.name + "以下",
                        color: EquipQuality.Rare.color
                    },
                    {
                        code: EquipQuality.Epic.code,
                        name: EquipQuality.Epic.name + "以下",
                        color: EquipQuality.Epic.color
                    },
                    {
                        code: EquipQuality.Legend.code,
                        name: EquipQuality.Legend.name + "以下",
                        color: EquipQuality.Legend.color
                    },
                    {
                        code: EquipQuality.Myth.code,
                        name: EquipQuality.Myth.name + "以下",
                        color: EquipQuality.Myth.color
                    }
                ]
            }
        },
        props: {
            visible: Boolean,
            saleEquipRule: String
        },
        methods: {
            save () {
                this.$emit("update:saleEquipRule", this.saleEquipRuleVal);
                localStorage.setItem("saleEquipRule", this.saleEquipRuleVal);
            },
            close () {
                this.$emit("update:visible", false);
            },
            saleEquipRuleClick (code) {
                if (this.saleEquipRuleVal !== code) {
                    this.saleEquipRuleVal = code;
                } else {
                    this.saleEquipRuleVal = "";
                }
            }
        },
        watch: {
            visible () {
                if (this.visible) {
                    this.saleEquipRuleVal = this.saleEquipRule;
                }
            }
        },
        created () {
            this.saleEquipRuleVal = this.saleEquipRule;
        }
    }
</script>

<style lang="scss" scoped>
    .setting{
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
            box-sizing: border-box;
            padding: 0.2rem;
            overflow: auto;
            .sale-rule-container{
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
                    label{
                        font-size: 0.32rem;
                    }
                }
            }
            .knapsack-bottom{
                padding: 0.2rem;    
            }
        }
    }
</style>
<template>
    <div style="margin:10px">
        <div class="btns">
            <a @click="checkAll()">全选</a>
            <a @click="checkAll(true)">全选(仅搜索结果项)</a>
            <a @click="clearAll">全清</a>
            <a @click="addRootNode(null,'根节点')">添加跟节点</a>
        </div>
        <div>
            <xntree style="padding:10px;width:400px;height:400px;border:1px solid #dfdfdf;background:#fff" :ref="'tree'"
                    :data="data4" :option="option" :openSearch="true" :searchContainChild="false"
                    :label="label" :caneditNode="caneditNode" :canaddNode="canaddNode" :candeleteNode="candeleteNode"
                    @checkChange="checkChange" @moveChange="moveChange" @clickNode="clickNode" @addNode="addNode"
                    @deleteNode="deleteNode" @editNode="editNode"></xntree>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        props: {},
        computed: {},
        inject: {
            parentItem: {
                default: {}
            }
        },
        watch: {
            modelValue: {
                handler: function (val) {

                }
            }
        },
        data() {
            return {
                data4: [
                    {
                        "code": "root",
                        "name": "root",
                        "id": "root",
                        "parentid": "-",
                        "nodeType": "root",
                        "text": "会计科目",
                        "subjectOrient": "NONE",
                        "subjectType": null,
                        "children": [
                            {
                                "code": "01",
                                "name": "资产类",
                                "id": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                "parentid": "root",
                                "nodeType": "subjClass",
                                "text": "资产类",
                                "subjectOrient": "NONE",
                                "subjectType": null,
                                "children": [
                                    {
                                        "code": "1001",
                                        "name": "库存现金",
                                        "id": "1e324ae2-dbf2-4975-8803-c6dfc94e8223",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "库存现金",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "CASHINHAND",
                                        "children": [
                                            {
                                                "code": "100104",
                                                "name": "测试资金",
                                                "id": "7f37986a-5218-40ae-af53-0931490dfe70",
                                                "parentid": "1e324ae2-dbf2-4975-8803-c6dfc94e8223",
                                                "nodeType": "subject",
                                                "text": "库存现金/测试资金",
                                                "subjectOrient": "DEBIT",
                                                "subjectType": "CASHINHAND",
                                                "children": null,
                                                "stopFlag": false
                                            }
                                        ],
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "100203",
                                        "name": "往来启用",
                                        "id": "40c2d34d-db90-4043-91a7-e16571ca4f22",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "银行存款/往来启用",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1013",
                                        "name": "测试",
                                        "id": "e4397f77-1d25-4362-8e1a-9ba71cd87f30",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "测试",
                                        "subjectOrient": "CREDIT",
                                        "subjectType": "NONE",
                                        "children": [
                                            {
                                                "code": "101301",
                                                "name": "测试辅助项1",
                                                "id": "53b60c11-42ca-4fe9-8a2b-d352c236e0eb",
                                                "parentid": "e4397f77-1d25-4362-8e1a-9ba71cd87f30",
                                                "nodeType": "subject",
                                                "text": "测试/测试辅助项1",
                                                "subjectOrient": "CREDIT",
                                                "subjectType": "NONE",
                                                "children": null,
                                                "stopFlag": false
                                            },
                                            {
                                                "code": "101302",
                                                "name": "ZZZZ",
                                                "id": "ccb96526-7ab5-4a26-a368-fed8262bd939",
                                                "parentid": "e4397f77-1d25-4362-8e1a-9ba71cd87f30",
                                                "nodeType": "subject",
                                                "text": "测试/ZZZZ",
                                                "subjectOrient": "CREDIT",
                                                "subjectType": "NONE",
                                                "children": null,
                                                "stopFlag": true
                                            }
                                        ],
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1014",
                                        "name": "ceshi现金14",
                                        "id": "71589532-ae77-40ad-9cd9-e29f35d54051",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "ceshi现金14",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": true
                                    },
                                    {
                                        "code": "1019",
                                        "name": "ceshi现金19",
                                        "id": "19b38d47-3c4f-44ec-88ca-2b1800fae4f7",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "ceshi现金19",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": true
                                    },
                                    {
                                        "code": "1025",
                                        "name": "ceshi现金25",
                                        "id": "ee968ef0-71f5-47ba-8ee4-1811c1edc3f6",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "ceshi现金25",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1041",
                                        "name": "ceshi现金41",
                                        "id": "c0feedbf-7d0b-4fa5-8851-e9638f4e7f00",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "ceshi现金41",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1042",
                                        "name": "ceshi现金42",
                                        "id": "77ec6b19-a065-42f4-8529-950b46dcc643",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "ceshi现金42",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1046",
                                        "name": "ceshi现金46",
                                        "id": "ef83cf46-3ace-4a13-8152-34f9437ab342",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "ceshi现金46",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": [
                                            {
                                                "code": "104601",
                                                "name": "lll",
                                                "id": "59396c1b-7ef7-463a-9209-9357dc5d964a",
                                                "parentid": "ef83cf46-3ace-4a13-8152-34f9437ab342",
                                                "nodeType": "subject",
                                                "text": "ceshi现金46/lll",
                                                "subjectOrient": "CREDIT",
                                                "subjectType": "NONE",
                                                "children": null,
                                                "stopFlag": false
                                            },
                                            {
                                                "code": "104602",
                                                "name": "测试",
                                                "id": "813d1a72-e8f6-406e-bfa6-bff995497b71",
                                                "parentid": "ef83cf46-3ace-4a13-8152-34f9437ab342",
                                                "nodeType": "subject",
                                                "text": "ceshi现金46/测试",
                                                "subjectOrient": "DEBIT",
                                                "subjectType": "NONE",
                                                "children": null,
                                                "stopFlag": false
                                            },
                                            {
                                                "code": "104603",
                                                "name": "ceshi",
                                                "id": "afdb811b-d796-4334-8f9c-893966171a2e",
                                                "parentid": "ef83cf46-3ace-4a13-8152-34f9437ab342",
                                                "nodeType": "subject",
                                                "text": "ceshi现金46/ceshi",
                                                "subjectOrient": "DEBIT",
                                                "subjectType": "NONE",
                                                "children": null,
                                                "stopFlag": false
                                            }
                                        ],
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1071",
                                        "name": "ceshi现金71",
                                        "id": "f35d0436-98e8-4e1b-9c0b-6203b5039ede",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "ceshi现金71",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1073",
                                        "name": "ceshi现金73",
                                        "id": "42faca1d-8480-4a4f-8f52-218d6dff9edc",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "ceshi现金73",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1077",
                                        "name": "ceshi现金77",
                                        "id": "6936eef8-48ab-4d84-8ec6-7a4b3ac41768",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "ceshi现金77",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1098",
                                        "name": "ceshi现金98",
                                        "id": "0735739c-36cc-4c1b-8048-9defae8e2e5a",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "ceshi现金98",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": true
                                    },
                                    {
                                        "code": "1907",
                                        "name": "往来单位任意人民币",
                                        "id": "d6268996-c417-41ae-b97d-148434e2d297",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "往来单位任意人民币",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1909",
                                        "name": "多个辅助项",
                                        "id": "775a1b33-04ea-4e4b-ba4b-c7b04c677788",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "多个辅助项",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "CASHINBANK",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1910",
                                        "name": "辅助项不填写",
                                        "id": "bcbdf868-9a9b-4669-99c6-5ac1ec6c27c7",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "辅助项不填写",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1912",
                                        "name": "不启用往来",
                                        "id": "e7e3532f-4180-4ec6-863e-a4a7e630f049",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "不启用往来",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1915",
                                        "name": "1228ldh",
                                        "id": "b3aaf540-cd2f-43fc-87e9-ac2bae3882a9",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "1228ldh",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1918",
                                        "name": "ldhyh测试",
                                        "id": "f2e84375-3a7b-47a9-bb61-fbfca9094fd4",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "ldhyh测试",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "CASHINBANK",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1919",
                                        "name": "现金ceshi111",
                                        "id": "2b002392-7d42-49db-9cb5-a51b005adad4",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "现金ceshi111",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "CASHINHAND",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "1921",
                                        "name": "测试银行资产",
                                        "id": "7e17594b-96df-45ef-8516-bcfe70aaee78",
                                        "parentid": "af70d3e7-cc7b-45c3-a9c1-73f9edd41898",
                                        "nodeType": "subject",
                                        "text": "测试银行资产",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "CASHINBANK",
                                        "children": null,
                                        "stopFlag": false
                                    }
                                ],
                                "stopFlag": false
                            },
                            {
                                "code": "02",
                                "name": "负债类",
                                "id": "75e2905b-5254-4bb1-aa5f-a606c64f3859",
                                "parentid": "root",
                                "nodeType": "subjClass",
                                "text": "负债类",
                                "subjectOrient": "NONE",
                                "subjectType": null,
                                "children": null,
                                "stopFlag": false
                            },
                            {
                                "code": "03",
                                "name": "净资产类",
                                "id": "778b4d5c-af6e-4c5f-8709-808224e70601",
                                "parentid": "root",
                                "nodeType": "subjClass",
                                "text": "净资产类",
                                "subjectOrient": "NONE",
                                "subjectType": null,
                                "children": [
                                    {
                                        "code": "3001",
                                        "name": "测试ll",
                                        "id": "b3aadfe8-6057-4b9c-aa59-67083bd70e06",
                                        "parentid": "778b4d5c-af6e-4c5f-8709-808224e70601",
                                        "nodeType": "subject",
                                        "text": "测试ll",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "CASHINHAND",
                                        "children": null,
                                        "stopFlag": false
                                    },
                                    {
                                        "code": "3003",
                                        "name": "hgfghf",
                                        "id": "c4bd506e-edb2-47fe-a675-509abbd4d1c3",
                                        "parentid": "778b4d5c-af6e-4c5f-8709-808224e70601",
                                        "nodeType": "subject",
                                        "text": "hgfghf",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": false
                                    }
                                ],
                                "stopFlag": false
                            },
                            {
                                "code": "04",
                                "name": "收入类",
                                "id": "b927749e-0f34-4bb8-975d-a5b9b2881063",
                                "parentid": "root",
                                "nodeType": "subjClass",
                                "text": "收入类",
                                "subjectOrient": "NONE",
                                "subjectType": null,
                                "children": [
                                    {
                                        "code": "4001",
                                        "name": "测试1",
                                        "id": "85c431d7-8098-470e-9c2f-19099b4b6511",
                                        "parentid": "b927749e-0f34-4bb8-975d-a5b9b2881063",
                                        "nodeType": "subject",
                                        "text": "测试1",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": [
                                            {
                                                "code": "400101",
                                                "name": "测试子集1",
                                                "id": "31117f46-3e80-4c08-a0bd-c0c6fdb5876e",
                                                "parentid": "85c431d7-8098-470e-9c2f-19099b4b6511",
                                                "nodeType": "subject",
                                                "text": "测试1/测试子集1",
                                                "subjectOrient": "DEBIT",
                                                "subjectType": "NONE",
                                                "children": null,
                                                "stopFlag": false
                                            },
                                            {
                                                "code": "400102",
                                                "name": "测试子集2",
                                                "id": "711637be-763a-4976-be3b-2b4e8920b39c",
                                                "parentid": "85c431d7-8098-470e-9c2f-19099b4b6511",
                                                "nodeType": "subject",
                                                "text": "测试1/测试子集2",
                                                "subjectOrient": "DEBIT",
                                                "subjectType": "NONE",
                                                "children": null,
                                                "stopFlag": false
                                            }
                                        ],
                                        "stopFlag": false
                                    }
                                ],
                                "stopFlag": false
                            },
                            {
                                "code": "05",
                                "name": "费用类",
                                "id": "60378709-cbd2-4482-9a9a-ee7a50e2e0bc",
                                "parentid": "root",
                                "nodeType": "subjClass",
                                "text": "费用类",
                                "subjectOrient": "NONE",
                                "subjectType": null,
                                "children": null,
                                "stopFlag": false
                            },
                            {
                                "code": "06",
                                "name": "预算收入类",
                                "id": "d58a28b5-aebf-4606-b958-ab7a593c29be",
                                "parentid": "root",
                                "nodeType": "subjClass",
                                "text": "预算收入类",
                                "subjectOrient": "NONE",
                                "subjectType": null,
                                "children": [
                                    {
                                        "code": "6001",
                                        "name": "测试库存金",
                                        "id": "21841427-739f-4e05-bf51-cf6c4d56c293",
                                        "parentid": "d58a28b5-aebf-4606-b958-ab7a593c29be",
                                        "nodeType": "subject",
                                        "text": "测试库存金",
                                        "subjectOrient": "DEBIT",
                                        "subjectType": "NONE",
                                        "children": null,
                                        "stopFlag": false
                                    }
                                ],
                                "stopFlag": false
                            },
                            {
                                "code": "07",
                                "name": "预算支出类",
                                "id": "b6482731-87b5-4bb3-89fc-0d31b037f714",
                                "parentid": "root",
                                "nodeType": "subjClass",
                                "text": "预算支出类",
                                "subjectOrient": "NONE",
                                "subjectType": null,
                                "children": null,
                                "stopFlag": false
                            },
                            {
                                "code": "08",
                                "name": "预算结余类",
                                "id": "5c1db68e-1032-4655-ae05-66cf6c5b8f36",
                                "parentid": "root",
                                "nodeType": "subjClass",
                                "text": "预算结余类",
                                "subjectOrient": "NONE",
                                "subjectType": null,
                                "children": null,
                                "stopFlag": false
                            }
                        ],
                        "stopFlag": false
                    }
                ],
                label: (d, ins, keyword) => {
                    let t = ins.replaceKey(d.text, keyword)
                    let html = `<div>
                            <span>${d.code}</span>
                            <span>
                                ${t}
                            </span>
                        </div>`
                    return html;
                },
                caneditNode: (d) => {
                    return d.nodeType != 'subjClass'
                },
                canaddNode: (d) => {
                    return d.nodeType == 'subjClass'
                },
                candeleteNode: false,
                option: {
                    id: 'code',
                    pId: false,
                    selectType: 'checkbox',//radio,null,checkbox
                    canMove: true,
                    checkDisabled: function (d) {
                        return d.nodeType != 'subject'
                    },
                    autoOpen: function (d, level) {
                        return level <= 2;
                    },
                    checkSticky: {//check关联
                        on: '',//p,自动勾选父，c自动勾选子，function
                        off: 'pc'
                    },
                }
            }
        },
        mounted() {
            this.addEvent();
        },
        created() {
        },
        methods: {
            checkAll(justSearched){
                this.$refs.tree.checkAll(justSearched)
            },
            clearAll(){
                this.$refs.tree.clearAll();
            },
            addEvent() {
                let sticky = false;
                document.addEventListener('keydown', e => {//按住shift时点击同时选择子元素
                    if (e.shiftKey && !sticky) {
                        sticky = true;
                        this.$refs.tree.resetOption({checkSticky: {on: 'c'}})
                    }
                })
                document.addEventListener('keyup', e => {
                    if (sticky) {
                        sticky = false;
                        this.$refs.tree.resetOption({checkSticky: {on: ''}})
                    }
                })
            },
            addRootNode(key,name){
                this.$refs.tree.addNode(key,{code: this.getRandomString(4), text: name})
            },
            addNode(key, name, done) {
                console.log(name);
                setTimeout(() => {
                    done({code: this.getRandomString(4), text: name});
                }, 3000)
            },
            editNode(key, name, done) {
                console.log(name);
                setTimeout(() => {
                    let newNode = {
                        code: key,
                        text: name
                    }
                    done(newNode);
                }, 30)
            },
            deleteNode(key, done) {
                setTimeout(() => {
                    done();
                }, 3000)
            },
            clickNode(d) {
                console.log(d);
            },
            checkChange(curNode, checked, checkedData, manualSet) {
                this.subjectOrient = checkedData.keys[0] ? checkedData.nodes[checkedData.keys[0]].subjectOrient : false;
                this.$refs.tree.resetOption({
                    checkDisabled: (d) => {
                        let r = d.nodeType != 'subject' || (this.subjectOrient && this.subjectOrient != d.subjectOrient);
                        return r;
                    }
                }, true)
            },
            deleteNode(d) {
                console.log(d);
            },
            moveChange(d1, d2) {
                console.log(d1, d2);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .btns a{
        font-size:14px;
        background: #4a9bfe;
        color: #fff;
        padding:0 10px;
        line-height: 32px;
        margin-bottom: 10px;
        display: inline-block;
        cursor: pointer;
        margin:0 4px 10px 0px;
    }
</style>

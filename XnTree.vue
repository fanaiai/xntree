<template>
    <div class="xn-tree-container">
        <xninput v-model="keyword" @change="searchTree" v-if="openSearch"></xninput>
        <div class="tree" ref="tree"></div>
    </div>
</template>

<script>
    import xnTree from './lib/src/xnTree.js'
    import {data,data1,data2,data4} from './data.js'
    // let data3=Mock.mock([{
    //     "text": '10000个子节点',
    //     "id":1,
    //     "parentid":null,
    //     "children|10000":[
    //         {"text": '@cname()',
    //             "id":'@increment(3)',
    //             "parentid":1,
    //         }
    //     ]
    // },
    //     {
    //         "text": '50000个子节点',
    //         "id":2,
    //         "parentid":null,
    //         "children|50000":[
    //             {"text": '@cname()',
    //                 "id":'@increment(20000)',
    //                 "parentid":2,
    //             }
    //         ]
    //     }]);
    export default {
        components: {},
        props: ['modelValue', 'data','option','openSearch','searchContainChild','caneditNode','canaddNode','candeleteNode','label'],
        provide() {
            return {
                tabledata: this
            };
        },
        emits:['checkChange','moveChange','clickNode','addNode','deleteNode','editNode'],
        data() {
            return {
                keyword:'',
                defaultOption:{
                    label: (d,ins,keyword)=>{
                        let t=ins.replaceKey(d.text,keyword)
                        let dom=`
                        <div style="display: flex;justify-content: space-between">
                        <div>
                            <span>${d.id}</span>
                            <span>
                                ${t}
                            </span>
                        </div>
                        <div class="xntree-ope">
                            <a class="delete-node">删除</a>
                            <a class="add-node">新增</a>
                            <a class="edit-node">编辑</a>
                        </div>
                        </div>
                        `
                        return dom;
                    },
                    id: 'id',
                    pId:false,
                    selectType:'checkbox',//radio,null,checkbox
                    canMove:true,
                    checkDisabled: function (d) {
                        return d.id=='001'
                    },
                    autoOpen: function (d, level) {
                        return level <=2;
                    },
                    checkSticky: {//check关联
                        on: '',//p,自动勾选父，c自动勾选子，function
                        off: 'pc'
                    },
                    on:{
                        clickNode:($t,nodedata,nodekey)=>{
                            if($t.hasClass('add-node')){
                                this.$promp({
                                    title:'新增节点',
                                    content:'请输入节点名称',
                                    size:'small',
                                    width:'300px',
                                    btns: [
                                        {
                                            label: '确认',
                                            type:'primary',
                                            callback:(value)=> {
                                                this.$emit('addNode',nodekey,value,(newNode)=>{this.addNode(nodekey,newNode)})
                                            },
                                        },
                                        {
                                            label: '取消',
                                            callback:(value)=> {
                                                this.$msg({
                                                    content:'已取消'
                                                })
                                            },
                                        }
                                    ],
                                })

                                return false;
                            }
                            if($t.hasClass('delete-node')){
                                this.$confirm({
                                    title:'确认删除？',
                                    content:'删除后不可恢复！',
                                    size:'normal',

                                    btns: [
                                        {
                                            label: '确认',
                                            type:'primary',
                                            callback:()=> {
                                                this.$emit('deleteNode',nodekey,()=>{this.deleteNode(nodekey)})
                                            },
                                        },
                                        {
                                            label: '取消',
                                            callback:()=> {
                                                this.$msg({
                                                    content:'已取消'
                                                })
                                            },
                                        }
                                    ],
                                })

                                return false;
                            }
                            if($t.hasClass('edit-node')){
                                this.$promp({
                                    title:'编辑节点',
                                    content:'请输入节点名称',
                                    size:'small',
                                    width:'300px',
                                    btns: [
                                        {
                                            label: '确认',
                                            type:'primary',
                                            callback:(value)=> {
                                                this.$emit('editNode',nodekey,value,(newNode)=>{this.editNode(nodekey,newNode)})
                                            },
                                        },
                                        {
                                            label: '取消',
                                            callback:(value)=> {
                                                this.$msg({
                                                    content:'已取消'
                                                })
                                            },
                                        }
                                    ],
                                })
                                return false;
                            }
                            this.$emit('clickNode',nodedata)
                            return true;//true则设置该节点为当前点击元素，false反之
                        },
                        checkChange:(curNode,checked,checkedData,manualSet)=>{
                            this.$emit('checkChange',curNode,checked,checkedData,manualSet)
                        },
                        moveChange:(movedNode,currentData)=>{
                            this.$emit('moveChange',movedNode,currentData)
                        }
                    }
                },
                xnTree:null
            }
        },
        created() {

            this.finalOption=$.extend(true,{},this.defaultOption,this.option||{})
            let label;
            if(typeof this.label =='string'){
                label=this.label;
            }
            else{
                label=(d,ins,keyword)=>{
                    let label=this.label(d,ins,keyword);
                    let ope=''
                    if(typeof this.candeleteNode == 'function'){
                        ope+=(this.candeleteNode(d)?'<a class="delete-node">删除</a>':'')
                    }
                    else if(this.candeleteNode){
                        ope+='<a class="delete-node">删除</a>'
                    }
                    if(typeof this.canaddNode == 'function'){
                        ope+=(this.canaddNode(d)?'<a class="add-node">新增</a>':'')
                    }
                    else if(this.canaddNode){
                        ope+='<a class="add-node">新增</a>'
                    }
                    if(typeof this.caneditNode == 'function'){
                        ope+=(this.caneditNode(d)?'<a class="edit-node">编辑</a>':'')
                    }
                    else if(this.caneditNode){
                        ope+='<a class="edit-node">编辑</a>'
                    }
                    let dom=`
                        <div style="display: flex;justify-content: space-between">
                        ${label}
                        <div class="xntree-ope">
                            ${ope}
                        </div>
                        </div>
                        `
                    return dom;
                }
            }
            this.finalOption.label=label;
        },
        mounted() {
            this.initTree();
        },
        methods: {
            resetOption(option,refresh){
                this.xnTree.resetOption(option)
                if(refresh){
                    this.xnTree.refreshDom()
                }
            },
            checkAll(justsearch){this.xnTree.checkAll(justsearch)},
            clearAll(){this.xnTree.clearAll()},
            addNode(nodeId,newNode){
                this.xnTree.addNode(nodeId,newNode)
            },
            deleteNode(nodeId){
                this.xnTree.deleteNode(nodeId)
            },
            editNode(nodeId,newNode){
                this.xnTree.editNode(newNode)
            },
            searchTree(){
                this.xnTree.search(this.keyword,(d)=>{
                    let r=d.text.indexOf(this.keyword)>-1;
                    return r;
                },this.searchContainChild);
            },
            initTree(){
                this.xnTree=new xnTree(this.$refs.tree,this.data,this.finalOption)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .xn-tree-container{
        display: flex;
        flex-flow: column;
    }
    .tree{
        width:100%;
        height:100%;
        overflow: auto;
    }
    >>> .xntree-ope{
        font-size: 12px;
        display: none;
    }
    >>> .xntree-ope a{
        margin-left: 4px;
    }
    >>> .xntree-item:hover .xntree-ope{
        display: flex;
    }
</style>

# xntree
树组件、原生js、jquery、tree、大数据量、虚拟树、vue

# 2021/07/07 V1.0.0(已发布)

# 概要
原生JS树，虚拟树组件，可支持超大数据量：
+ 支持超大数据量
+ 搜索功能
+ 多选框
+ 单选框
+ 节点增删改
+ 节点移动
+ 自定义显示

后续还将增加其他的类型和配置，敬请期待哦！

## 如果本插件不能满足您的使用需求，请提交issue，我将尽快对插件进行更新。

# 插件样式示例：
![avatar](https://github.com/fanaiai/xntree/blob/main/1.png?raw=true)
# 使用步骤
### 下载代码
#### 压缩版本引用
    <script type="text/javascript" src="./dist/xntree.min.js"></script>
    
#### ES6 import方式引用
    //直接引用src文件夹下的js文件
    import xnTree from 'src/xnTree.js'
    
#### VUE组件
本插件简单封装了一个vue组件，代码请见XnTree.vue,组件使用示例请见Test.vue

### 插件使用

#### html代码
    //初始化dom容器，注意容器一定要有height或max-height，这样才能计算每次要渲染多少条数据
    <div id="tree" style="width:400px;height:400px"></div>
#### js代码
    let option = {
            label: (d,ins) => {
                let t=ins.replaceKey(d.text, document.querySelector('#keyword').value)
                let dom = `
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
            pId: false,
            selectType: 'checkbox',//radio,null,checkbox
            canMove: true,
            checkDisabled: function (d) {
                return d.id == '001'
            },
            autoOpen: function (d, level) {
                return level <= 0;
            },
            checkSticky: {//check关联
                on: '',//p,自动勾选父，c自动勾选子，function
                off: 'pc'
            },
            on: {
                clickNode: ($t, nodedata, nodekey) => {
                    if ($t.hasClass('add-node')) {
                        addNode(nodekey,'新节点')
                        return false;
                    }
                    if ($t.hasClass('delete-node')) {
                        deleteNode(nodekey)
                        return false;
                    }
                    if ($t.hasClass('edit-node')) {
                        editNode(nodekey,'新名称')
                        return false;
                    }
                    console.log(nodedata);
                    return true;//true则设置该节点为当前点击元素，false反之
                },
                checkChange: (checkedData) => {
                    console.log(checkedData);
                },
                moveChange: (movedNode, currentData) => {
                    console.log(currentData);
                }
            }
        }
        let xntree = new xnTree(document.querySelector('#tree'), bigdata, option)
## 初始化参数
    let xntree = new xnTree(容器 element, 数据 data, 配置 option)
### option
    {
        label:string|func,//string:直接传属性名，func:(当前节点数据，插件实例)=>{}，设置func可以自定义节点内容
        id:string,//属性名
        pId:string|false,//父节点ID的属性名，当为false的时候，插件会自动添加一个属性$pId作为父节点ID属性
        lineHeight:number,//行高(默认32)，当前版本的节点只能设置固定的行高
        autoOpen:false|func:(当前节点,当前节点所在层级从0开始){return true},//初始化时是否自动展示节点
        selectType:'checkbox'|'radio'|false,//显示checkbox或radio，为false时不显示
        checkSticky:{//当显示checkbox的时候，选择某个节点是否自动关联父子节点
            on: '',//选中某节点时，p为自动勾选父节点，c为自动勾选子节点，不写为不关联
            off: 'pc',//,取消选中时
        },
        checkDisabled: function (d)=> {return d.id == '001'},//设置不能选中的节点
        canMove:true|false,//是否开启节点移动
        hideIcon:true,//是否隐藏默认节点图标
        on:{//事件监听
            clickNode: ($t, node, id,event) => {},//$t:当前点击元素,node:当前点击节点,id:节点id,event:点击事件
            checkChange:(node,checked,allChecked,isManual)=>{},//选中节点变化事件，node:点击节点,checked:当前节点选中状态,allChecked:当前选中所有节点数据,isManual:是否是手动调用方法设置选中状态
            moveChange:(movingNode,currentData)=>{},//movingNode:当前移动的节点,currentData:插件数据
            }
    }
     

## 方法
+ getChecked():获取选中数据
+ checkAll(justResult):选中全部,justResult为true则仅选择当前搜索结果
+ clearAll():清空所选项
+ setCheckedKeys(keys):设置选中节点，keys为选中的节点id的数组
+ setCheckedNodes(nodes):设置选中节点，keys为选中节点列表
+ editNode(node):编辑节点
+ addNode(id,node):添加节点,id:添加到的父节点id，当添加根节点时id为null,node新节点数据
+ deleteNode(id):删除节点
+ getNodeById(id):获取某个节点数据

## 示例代码请参考 index.html
## 后续功能点


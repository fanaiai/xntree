# xntree 仙女座树插件
树组件、原生js、jquery、tree、大数据量、虚拟树、vue

# 简介
最近开发一个复杂的核算项目，原项目用的是elementui，所以就继续使用elementui框架
这个功能块并不是复杂，但是很麻烦，各种表单的关联查询，最难受的是一个页面里面有很多树形组件，有的组件有很大的数据量，可能会超过几千个节点，但是elementui又没有提供渲染大型数据的方式，我又打开了ztree的网站，其实从来都没有用过ztree，因为ztree提供了很多功能，但是实际上我是用不到这些功能的，更重要的是，ztree的样式还是有一点点古老，实在是懒得去调整样式了，最后还是决定还是自己开发个插件吧。
+ xntree是直接利用虚拟列表的概念开发的，所以每次在页面渲染的节点数是很少的，可能仅有二三十条数据
+ 所有节点是同层级的，父节点和子节点并不是嵌套的层级关系，所以节点的缩进样式只是为每个节点增加了左侧的空白节点
### 插件工作过程
1. 对原始的嵌套结构数据进行展开操作，例如：
    
    let data=[{id:1,name:'节点1',children:[{id:11,name:'子节点'}]}]//原始数据
    let flatJson=getFlatData(data)//展开数据
    //获取以下结构的数据
    flatJson={1:{id:1,name:'节点1',children:[{id:11,name:'子节点'}]},11:{id:11,name:'子节点'}}

2. 获取到flatJson之后，后续对节点的增删改查等操作很多就可以利用这个数据了
3. 每次对数据进行更新之后，都可以调用绘制方法，对页面进行重绘，所以任何操作其实都不用直接操作dom
4. 关于页面的渲染，可以参考这篇文章 [地址](https://juejin.cn/post/6844903982742110216) 
+ 虚拟树和列表的不同在于，树是可以收起和展开的，所以目前每次渲染页面，我都会从第一条数据开始遍历，判断当前节点是否收起，如果收起就不在计算范围内，我会根据节点的显示情况判断这个节点是否要进行绘制，当然在这个过程中，我们还要计算当前树的总高度，所以相对来说，还是有一些性能消耗的，在数据量很大并快速的拖拽滚动条的时候，有时候会有空白的现象，但总体不影响效果，此处的算法后续还会进行优化。

# 2021/07/07 V1.0.1(已发布)
+ 增加对list类型原始数据的支持，option增加dataType属性(list/tree)
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
+ setCheckedNodes(nodes):设置选中节点，nodes为选中节点的数组
+ editNode(node):编辑节点
+ addNode(id,node):添加节点,id:添加到的父节点id，当添加根节点时id为null,node新节点数据
+ deleteNode(id):删除节点
+ getNodeById(id):获取某个节点数据
+ resize():重新计算容器高度
+ refreshDom():重新绘制
+ destory():销毁实例，主要用于清除绑定事件

## 示例代码请参考 index.html
## 后续功能点


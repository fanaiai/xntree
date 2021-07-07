# xntree
树组件、原生js、jquery、tree、大数据量、虚拟树、vue

# 2021/07/07 V1.0.0(已发布)

# 概要
原生JS树，虚拟树组件，可支持超大数据量：
+ 大数据量
+ 搜索功能
+ 多选框
+ 单选框
+ 节点增删改
+ 节点移动
+ 自定义显示

后续还将增加其他的类型和配置，敬请期待哦！

## 如果本插件不能满足您的使用需求，请提交issue，我将尽快对选择器进行更新。

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
    //初始化dom容器，注意容器一定要有height或max-height
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
## 方法
+ 日期格式化 xndatepicker.format(date,formatString)
+ 销毁实例 xndatepicker.destroy()
## 示例代码请参考 index.html
## 后续功能点


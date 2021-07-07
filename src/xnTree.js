import './xnTree.css';
import './colorTheme.css';
import './xnquery.js';
import './iconfont/iconfont.css';

let $ = window.XNQuery;
let defaultOption = {
    label: 'text',
    id: 'id',
    lineHeight:32,
    // pId: 'parentid',
    selectType: 'checkbox',//radio,null
    checkDisabled: function (d) {
        return false
    },
    autoOpen: function (d, level) {
        return level <= 2;
    },
    checkSticky: {//check关联
        on: 'pc',//p,自动勾选父，c自动勾选子，function
        off: 'pc'
    },
    editNode: function (d) {
        return true
    },
    deleteNode: function (d) {
        return true;
    },
    addChildNode: function (d) {
        return true;
    }
}

class xnTree {
    constructor(container, data, option) {
        this.container = container;
        this.container.classList.add('xntree-outer')
        this.data = $.extend(true,[],data);
        this.flatList = {};
        this.flatListKeys = [];
        this.option = $.extend(true, {}, defaultOption, option);
        this.totalNum=parseInt((this.container.clientHeight||document.body.clientHeight)/this.option.lineHeight);
        this.topIndex = 0;
        this.bottomIndex = this.totalNum;
        this.slidedownHTML = {
            'up':'<a class="xn-slidedown iconfontxntree icon-xntreezhankai1"></a>',
            'down':'<a class="xn-slidedown down iconfontxntree icon-xntreezhankai1"></a>',
        }
        this.iconHTML={
            folder:'<a class="xn-folder iconfontxntree icon-xntreewenjianjia"></a>',
            file:'<a class="xn-file iconfontxntree icon-xntreefile"></a>'
        }
        this.selectHTML = {
            checkbox: `
        <div class="xn-checkbox"></div>
        `,
            checkboxon: `
        <div class="xn-checkbox on iconfontxntree icon-xntreecheckboxtick"></div>
        `,
            checkboxdisable: `
        <div class="xn-checkbox disable"></div>
        `,
            radio: `
        <div class="xn-radio"></div>
        `,
            radioon: `
        <div class="xn-radio on iconfontxntree icon-xntreecheckboxtick"></div>
        `,
            radiodisable: `
        <div class="xn-radio disable"></div>
        `
        }
        this.checked = {
            nodes: [],
            keys: []
        }
        this.clicked = null;
        this.getFlatData();
        this.init();
    }

    init() {
        // console.log(this.data);
        this.rendDom();
        this.addEvent();
    }

    addMoveDom() {
        return `
        <div class="xntree-move"></div>
        `
    }

    rendDom() {
        this.openNumber = 0;
        this.dom = '<div class="xntree-cont">'
        this.index = 0;
        this.dom += this._rendHTML(this.data, 0) + "</div>"
        let movedom = this.addMoveDom();
        let scrollDom = '<div class="xntree-scroll" style="height:' + this.openNumber * this.option.lineHeight + 'px"></div>'
        this.container.innerHTML = scrollDom + this.dom + movedom;
        this.movedom = this.container.querySelector('.xntree-move')
        this.scrollDom = this.container.querySelector('.xntree-scroll')
    }

    _rendHTML(list, level, justScroll) {
        let dom = '';
        let span = '';
        for (let i = 0; i < level; i++) {
            span += '<span class="xn-indent"></span>'
        }
        for (let i = 0; i < list.length; i++) {
            let l = list[i];
            if (l.$show) {
                if (this.seachKeys && !this.searchKeysJson[l[this.option.id]]) {
                    continue
                } else {
                    this.index++;
                    this.openNumber++
                }
            }
            if (this.index - 1 >= this.topIndex && this.index <= this.bottomIndex) {
                if (l.$show) {
                    let [h] = this._rendOneNode(l, span, level, l.$show);
                    dom += h;
                }
            } else if (justScroll && this.index > this.bottomIndex) {
                return dom;
            }
            if (l.children && l.children.length > 0 && l.$show) {
                let cDom = this._rendHTML(l.children, level + 1, justScroll)
                dom += cDom;
            }
        }
        return dom;
    }


    _rendOneNode(l, span, level, open) {
        let pre='<div class="xn-tree-icons">'
        if (l.$show && l.children && l.children[0]) {
            pre += this.slidedownHTML[l.children[0].$show?'down':'up']
        }
        else{
            pre+='<a></a>'
        }
        if(!this.option.hideIcon){
            let icon = (l.children && l.children.length > 0) ? 'folder' : 'file'
            pre+=this.iconHTML[icon]
        }
        pre+='</div>'
        l.$level = level;
        if (!span) {
            span = ''
            for (let i = 0; i < level; i++) {
                span += '<span class="xn-indent"></span>'
            }
        }
        let label = '';
        if (typeof this.option.label == 'string') {
            label = l[this.option.label]
        } else if (typeof this.option.label == 'function') {
            label = this.option.label(l)
        }

        let ope = `<div class="xntree-ope">`
        if (this.option.addChildNode(l)) {
            ope += `<a class="xntree-add"></a>`
        }
        if (this.option.editNode(l)) {
            ope += `<a class="xntree-edit"></a>`
        }
        if (this.option.deleteNode(l)) {
            ope += `<a class="xntree-delete"></a>`
        }
        ope += `</div>`
        let selectDom = '';
        if (this.option.selectType) {
            selectDom = this.selectHTML[this.option.selectType + (((this.checked.nodes[l[this.option.id]]) || this.checked.nodes[l[this.option.id]]) ? 'on' : '')] || ''
            if (this.option.checkDisabled(l)) {
                selectDom = this.selectHTML[this.option.selectType + 'disable']
            }
        }
        let h = `<div class="xntree-item ${!open ? 'xn-hide-sub' : ''} ${(this.clicked && this.clicked[this.option.id] == l.id) ? 'on' : ''}" data-level="${level}" data-id="${l[this.option.id]}">
                    ${span}
                    ${pre}   
                    ${selectDom}
                    <div class="xntree-label">${label}</div>
                    ${ope}
                    </div>`
        let dom = document.createElement('div');
        dom.innerHTML = h;
        return [h, dom.childNodes[0]];
    }

    search(keyword, func, containChild) {
        let that = this;
        this.seachKeys = null;
        if (keyword.trim()) {
            if (!func) {
                func = (d) => {
                    return d[that.option.label].indexOf(keyword) > -1
                }
            }
            let path = [], result = [];
            let results = this.treeFindPath(this.data, func, path, result, containChild)
            this.seachKeys = [...new Set(results.flat())];
            this.searchKeysJson = {};
            this.seachKeys.forEach(e => {
                this.searchKeysJson[e] = 1;
            })
        }
        this.refreshDom();
    }

    treeFindPath(tree, func, path = [], result = [], containChild, hasP) {
        for (const data of tree) {
            path.push(data.id)
            let has = func(data);
            (has || (containChild && hasP)) && result.push([...path])
            data.children && this.treeFindPath(data.children, func, path, result, containChild, (has || (containChild && hasP)))
            path.pop()
        }
        return result
    }

    addEvent() {
        this.container.addEventListener('click', e => {
            let $t = $(e.target);
            if ($t.hasClass('xn-slidedown')) {
                this.slideEvent($t);
            }
            if ($t.hasClass('xn-checkbox')) {
                this.checkEvent($t);
            }
            if ($t.hasClass('xn-radio')) {
                this.radioEvent($t);
            }
            if ($t.hasClass('xntree-label') || $t.parents('.xntree-label').get(0)) {
                let $item = $t;
                if ($t.parents('.xntree-label').get(0)) {
                    $item = $t.parents('.xntree-label').eq(0)
                }
                this.clickLabelEvent($item, $t, e);
            }
        })

        let down = false;
        let move = false;
        let el = {};
        this.container.addEventListener("mousedown", e => {
            let $t = $(e.target);
            if ($t.parents('.xntree-item').get(0)) {
                down = true;
                el.$dom = $t.parents('.xntree-item').eq(0)
                el.id = el.$dom.attr("data-id")
                el.startTime = new Date().getTime();
            }
        })
        document.addEventListener("mousemove", e => {
            if (!this.option.canMove) {
                return;
            }
            if (down && new Date().getTime() - el.startTime > 300) {
                let $t = $(e.target);
                this.container.classList.add("xn-moving")
                $(this.container).find('.xn-onmoving').removeClass('xn-onmoving')
                if ($t.parents('.xntree-item').get(0)) {
                    let $onDom = $t.parents('.xntree-item').eq(0);
                    el.$onDom = $onDom;
                    el.onId = $onDom.attr("data-id")
                    let [dir, x, y] = this.getMovePos($onDom, e)
                    el.dir = dir;
                    el.y = y;
                    el.x = x;
                    console.log(el);
                    if (el.dir == 'on') {
                        el.$onDom.addClass('xn-onmoving')
                        this.movedom.style.display = 'none'
                    } else {
                        this.movedom.style.top = el.y + 'px'
                        this.movedom.style.left = el.x + 'px'
                        this.movedom.style.display = 'block'
                    }
                }
                move = true;
            }
        })
        document.addEventListener("mouseup", e => {
            if (down && move) {
                this.moveItem(el);
            }
            down = false;
            move = false;
            this.container.classList.remove("xn-moving")
            this.movedom.style.display = 'none'
        })
        this.container.addEventListener('scroll', e => {
            let y = (this.container.scrollTop);
            this.topIndex = Math.floor(y / this.option.lineHeight);
            this.bottomIndex = this.topIndex + this.totalNum;
            this.refreshDom(true);
            this.container.querySelector(".xntree-cont").style.transform = 'translateY(' + (this.topIndex * this.option.lineHeight) + 'px)'
        })
    }

    refreshDom(justScroll) {
        this.index = 0;
        this.openNumber = 0;
        let dom = this._rendHTML(this.data, 0, justScroll);
        this.container.querySelector(".xntree-cont").innerHTML = dom;
        if (!justScroll) {
            this.scrollDom.style.height = this.openNumber * this.option.lineHeight + 'px'
        }
    }

    moveItem(el) {
        if (el.id == el.onId) {
            return;
        }
        let curP = this.flatList[this.flatList[el.id][this.option.pId]];
        if (!curP) {
            curP = {
                children: this.data
            }
        }
        for (let i = 0; i < curP.children.length; i++) {
            if (curP.children[i][this.option.id] == el.id) {
                curP.children.splice(i, 1);
            }
        }
        let hasChild = true;
        if (!this.flatList[el.onId].children) {
            this.flatList[el.onId].children = [];
            hasChild = false;
        }
        if (el.dir == 'on' || (hasChild && el.dir == 'down' && this.flatList[el.onId].children[0].$show)) {//1.在节点上，2.当节点为展开状态，鼠标在节点下方，统一做在节点上的操作
            this.flatList[el.id][this.option.pId] = el.onId;
            this.flatList[el.onId].children.unshift(this.flatList[el.id])
            this.flatList[el.id].$show = this.flatList[el.onId].children[1] && this.flatList[el.onId].children[1].$show;
            this.refreshDom()
            if (this.option.on.moveChange) {
                this.option.on.moveChange(this.flatList[el.id], this.data)
            }
            return;
        }
        let pNode = this.flatList[this.flatList[el.onId][this.option.pId]];
        if (!pNode) {
            pNode = {
                children: this.data
            }
        }
        let index;
        for (let i = 0; i < pNode.children.length; i++) {
            if (pNode.children[i][this.option.id] == el.onId) {
                index = i;
            }
        }
        this.flatList[el.id][this.option.pId] = this.flatList[el.onId][this.option.pId];
        if (el.dir == 'up') {
            pNode.children.splice(index, 0, this.flatList[el.id]);
        }
        if (el.dir == 'down') {
            pNode.children.splice(index + 1, 0, this.flatList[el.id]);
        }
        this.refreshDom()
        if (this.option.on.moveChange) {
            this.option.on.moveChange(this.flatList[el.id], this.data)
        }
    }

    renderOneTree(treeData, level, open) {
        let dom = this._rendHTML(treeData, level, open)
        let dom1 = document.createElement('div');
        dom1.innerHTML = dom;
        return dom1.childNodes
    }

    _getItemById(id) {
        return this.container.querySelector('[data-id="' + id + '"]')
    }

    getMovePos($dom, e) {
        console.log($dom);
        let dir = ''
        let pos = $dom.get(0).getBoundingClientRect();
        let top = pos.top, top1 = top + pos.height / 4, top2 = top + pos.height * 3 / 4,
            top4 = top + pos.height;
        let etop = e.clientY;
        let y, x;
        // console.log(this.container.getBoundingClientRect().top,top,etop);
        x = pos.left + $dom.find(".xn-indent").length * 15;
        if (etop <= top1) {
            dir = 'up'
            y = top - this.container.getBoundingClientRect().top + this.container.scrollTop;
        }
        if (etop > top1 && etop <= top2) {
            dir = 'on'
        }
        if (etop > top2) {
            dir = 'down'
            y = top4 - this.container.getBoundingClientRect().top + this.container.scrollTop;
        }
        return [dir, x, y];
    }

    clickLabelEvent($item, $t, e) {
        let p = $item.parents(".xntree-item").get(0)
        let plevel = parseInt(p.getAttribute('data-level'))
        let id = p.getAttribute('data-id')
        let node = this.getNodeById(id)
        let setClick = true;
        if (this.option.on && this.option.on.clickNode) {
            setClick = this.option.on.clickNode($t, node, id, e)
        }
        if (setClick) {
            this.clicked = node
            $(this.container).find(".xntree-item.on").removeClass('on')
            $(p).addClass('on')
        }

    }

    radioEvent($t) {
        let p = $t.parents(".xntree-item").get(0)
        let plevel = parseInt(p.getAttribute('data-level'))
        let id = p.getAttribute('data-id')
        let node = this.getNodeById(id)
        this.checked.keys = [id];
        this.checked.nodes = {};
        this.checked.nodes[id] = this.getNodeById(id)
        this.refreshDom();
        this.trigger('checkChange', this.checked)
    }

    checkEvent($t) {
        let p = $t.parents(".xntree-item").get(0)
        let plevel = parseInt(p.getAttribute('data-level'))
        let id = p.getAttribute('data-id')
        let node = this.getNodeById(id)
        if (this.option.checkDisabled(node)) {
            return;
        }
        let checked = this.checked.nodes[id];
        let sticky = this.option.checkSticky.on;
        if (checked) {
            sticky = this.option.checkSticky.off
        }
        let paths = []
        if (sticky.indexOf('p') > -1) {
            let func = (d) => {
                return d[this.option.id] == id;
            }
            let path = [], result = [];
            let results = this.treeFindPath(this.data, func, path, result, sticky.indexOf('c') > -1)
            paths = [...new Set(results.flat())];
        } else if (sticky.indexOf('c') > -1) {
            this._literalFlatTree({}, [node], {}, paths, 0, true)
        } else {
            paths = [id]
        }
        if (checked) {
            let indexs = this.delArrayFromArray(this.checked.keys, paths);
            for (let i = indexs.length - 1; i >= 0; i--) {
                delete this.checked.nodes[indexs[i]]
            }
        } else {
            for (let i = 0; i < paths.length; i++) {
                this.checked.keys.push(paths[i])
                let node = this.getNodeById(paths[i])
                this.checked.nodes[paths[i]] = node;
            }
        }
        this.refreshDom();
        this.trigger('checkChange', this.checked)
    }

    delArrayFromArray(fromArray, delArray) {
        let indexs = [];
        for (let j = 0; j < delArray.length; j++) {
            let v = delArray[j]
            for (let i = fromArray.length - 1; i >= 0; i--) {
                if (fromArray[i] == v) {
                    fromArray.splice(i, 1)
                    indexs.push(v)
                }
            }
        }
        return indexs;
    }

    setCheckedKeys(keys,justRend) {
        this.checked.nodes = {};
        for (let i in keys) {
            let id = keys[i]
            let node = this.getNodeById(id)
            this.checked.nodes[id] = (node)
        }
        this.checked.keys = keys;
        this.trigger('checkChange', this.checked)
        this.rendDom();
    }

    trigger(type, data) {
        if (this.option.on[type]) {
            this.option.on[type](data)
        }
    }

    setCheckedNodes(nodes) {
        let keys = nodes.map(e => {
            return e[this.option.id]
        })
        this.setCheckedKeys(keys)
    }

    getChecked() {
        return this.checked;
    }

    checkAll(justResult) {//justResult,仅选择当前搜索结果
        let list = $.extend(true, [], this.flatListKeys);
        list = list.filter(e => {
            return !this.option.checkDisabled(this.getNodeById(e))
        })
        if (justResult && this.seachKeys) {
            list = list.filter((e) => {
                return (!this.seachKeys || this.searchKeysJson[e])
            })
        }
        this.setCheckedKeys(list)
    }

    clearAll() {
        this.setCheckedKeys([], true)
    }

    editNode(node) {
        let oldNode = this.getNodeById(node[this.option.id]);
        $.extend(true, oldNode, node);
        this.refreshDom();
        // let [h, icon, dom] = this._rendOneNode(newNode, false, oldNode.$level, true);
        // let oldDom = this.container.querySelector('[data-id="' + oldNode[this.option.id] + '"]')
        // oldDom.innerHTML = dom.innerHTML;
    }

    addNode(id, node) {//新增节点
        let pNode = this.getNodeById(id);
        if (!pNode) {
            node.$level = 0;
            node.$show = true;
            this.data.unshift(node);
            this.flatList[node[this.option.id]] = node;
            this.flatListKeys.push(node[this.option.id]);
            this.refreshDom();
            return;
        }
        if (!pNode.children) {
            pNode.children = []
        }
        let $level = pNode.$level + 1;
        node.$level = $level;
        node[this.option.pId || '$pId'] = id;
        if (pNode.children[0] && pNode.children[0].$show) {
            node.$show = true;
        }
        pNode.children.unshift(node);
        this.flatList[node[this.option.id]] = node;
        this.flatListKeys.push(node[this.option.id]);
        this.refreshDom();
        // let [h, icon, dom] = this._rendOneNode(node, false, $level, true);
        // this.container.querySelector('[data-id="' + id + '"]').after(dom)
    }

    insertAfter(insert_element, target_element) {
        var parent = insert_element.parentNode;
        //最后一个子节点 lastElementChild兼容其他浏览器 lastChild  兼容ie678;
        var last_element = parent.lastElementChild || parent.lastChild;
        //兄弟节点同样也是有兼容性
        var target_sibling = target_element.nextElementSibling || target_element.nextSibling;
        if (last_element == target_element) {//先判断目标节点是不是父级的最后一个节点，如果是的话，直接给父级加子节点就好
            parent.appendChild(insert_element);
        } else {//不是最好后一个节点  那么插入到目标元素的下一个兄弟节点之前（就相当于目标元素的insertafter）
            parent.insertBefore(insert_element, target_sibling);
        }
    }

    deleteNode(id) {//删除节点
        let node = this.getNodeById(id);
        let pNode = this.getNodeById(node[this.option.pId]);
        let key = null;
        if (!pNode) {
            pNode = {children: this.data}
        }
        for (let i = 0; i < pNode.children.length; i++) {
            if (pNode.children[i][this.option.id] == id) {
                key = i;
                break;
            }
        }
        pNode.children.splice(key, 1);
        let delKeys = [];
        this._literalFlatTree({}, [node], {}, delKeys, 0, true)
        for (let i = 0; i < delKeys.length; i++) {
            let k = delKeys[i];
            this.flatListKeys.splice(this.flatListKeys.indexOf(k), 1)
            delete this.flatList[k]
            // $(this.container).find("[data-id='" + k + "']").remove();
        }
        this.refreshDom();
    }

    _deleteDomFromId(id) {
        let node = this.getNodeById(id);
        let delKeys = [];
        this._literalFlatTree({}, [node], {}, delKeys, 0, true)
        for (let i = 0; i < delKeys.length; i++) {
            let k = delKeys[i];
            $(this.container).find("[data-id='" + k + "']").remove();
        }
    }

    refreshNode(node) {//更新某个节点

    }

    getFlatData() {
        this._literalFlatTree({}, this.data, this.flatList, this.flatListKeys, 0)
        if (!this.option.pId) {
            this.option.pId = '$pId'
        }
        console.log(this.data);
    }

    _literalFlatTree(pNode, list, arry, arrykeys, level, dontSetData) {
        for (let i = 0; i < list.length; i++) {
            let l = list[i];
            if (!dontSetData) {
                l.$level = level;
                l.$show = this.option.autoOpen(l, level)
                if (!this.option.pId) {
                    l.$pId = pNode[this.option.id];
                }
            }
            arry[l[this.option.id]] = l
            arrykeys.push(l[this.option.id])
            if (l.children && l.children.length > 0) {
                this._literalFlatTree(l, l.children, arry, arrykeys, level + 1, dontSetData)
            }
        }
    }

    getNodeById(id) {
        return this.flatList[id]
    }

    _literalGetNode(list, id) {
        for (let i = 0; i < list.length; i++) {
            let l = list[i];
            if (l[this.option.id] == id) {
                return l
            }
        }
        return false;
    }

    slideEvent($t) {
        let p = $t.parents(".xntree-item").get(0)
        let id = p.getAttribute('data-id');
        let node = this.getNodeById(id);
        for (let i = 0; i < node.children.length; i++) {
            node.children[i].$show = !node.children[i].$show
        }
        this.refreshDom()
    }


    findChildren(p, plevel) {
        let child = $(p).nextUntil('.xntree-item[data-level="' + plevel + '"]').filter((i, e) => {
            let level = parseInt(e.getAttribute('data-level'))
            return (level > plevel)
        })
        return child;
    }

    resetOption(option) {
        if (JSON.stringify(this.option) == JSON.stringify(option)) {
            return;
        }
        this.option = $.extend(true, {}, this.option, option)
        // this.refreshDom()
    }
}

window.xnTree = xnTree;
export default xnTree;

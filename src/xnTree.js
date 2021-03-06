import './xnTree.css';
import './colorTheme.css';
import './xnquery.js';
import './iconfont/iconfont.css';

let $ = window.XNQuery;
let defaultOption = {
    label: 'text',
    id: 'id',
    lineHeight: 32,
    dataType: 'tree',
    lazyLoad:false,
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
};

class xnTree {
    constructor(container, data, option) {
        this.container = container;
        this.container.classList.add('xntree-outer')
        this.option = $.extend(true, {}, defaultOption, option);
        if (option.dataType == 'list') {
            this.data = this.revertListToTree(data);
        } else {
            this.data = $.extend(true, [], data);
        }
        this.flatList = {};
        this.flatListKeys = [];

        this.totalNum = parseInt((this.container.clientHeight || document.body.clientHeight) / this.option.lineHeight);
        this.topIndex = 0;
        this.bottomIndex = this.totalNum + 4;
        this.slidedownHTML = {
            'up': '<a class="xn-slidedown iconfontxntree icon-xntreezhankai1"></a>',
            'down': '<a class="xn-slidedown down iconfontxntree icon-xntreezhankai1"></a>',
        }
        this.iconHTML = {
            folder: '<a class="xn-folder iconfontxntree icon-xntreewenjianjia"></a>',
            file: '<a class="xn-file iconfontxntree icon-xntreefile"></a>'
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
        this.addResizeObserve()

    }

    addResizeObserve() {
        this.resizeObserver = new ResizeObserver(entries => {
            this.totalNum = parseInt((this.container.clientHeight || document.body.clientHeight) / this.option.lineHeight);
            this.refreshDom(true)
        });
        this.resizeObserver.observe(this.container)

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
        this.setScrollWidth();
    }

    setScrollWidth() {
        let width = this.container.querySelector(".xntree-cont").clientWidth;
        this.scrollDom.style.minWidth = width + 'px'
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
                    this.openNumber++;
                    if (this.clicked && this.clicked[this.option.id] == l.id) {
                        this.calcCurrent = false;
                    }
                    if (this.calcCurrent) {
                        this.currentNumber++;
                    }
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
        let pre = '<div class="xn-tree-icons">'
        if ((l.$show && l.children && l.children[0])||this.option.lazyLoad) {
            pre += this.slidedownHTML[(l.children && l.children[0] && l.children[0].$show) ? 'down' : 'up']
        } else {
            pre += '<a></a>'
        }
        if (!this.option.hideIcon) {
            let icon = (l.children && l.children.length > 0) ? 'folder' : 'file'
            pre += this.iconHTML[icon]
        }
        pre += '</div>'
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
            if (this.searchKeyword) {
                label = this.replaceKey(label, this.searchKeyword)
            }
        } else if (typeof this.option.label == 'function') {
            label = this.option.label(l, this, this.searchKeyword)
        }

        // let ope = `<div class="xntree-ope">`
        // if (this.option.addChildNode(l)) {
        //     ope += `<a class="xntree-add"></a>`
        // }
        // if (this.option.editNode(l)) {
        //     ope += `<a class="xntree-edit"></a>`
        // }
        // if (this.option.deleteNode(l)) {
        //     ope += `<a class="xntree-delete"></a>`
        // }
        // ope += `</div>`
        let selectDom = '';
        if (this.option.selectType) {
            selectDom = this.selectHTML[this.option.selectType + (((this.checked.nodes[l[this.option.id]]) || this.checked.nodes[l[this.option.id]]) ? 'on' : '')] || ''
            if (this.option.checkDisabled(l)) {
                selectDom = this.selectHTML[this.option.selectType + 'disable']
            }
        }
        let h = `<div style="line-height: ${this.option.lineHeight}px;height:${this.option.lineHeight}px" class="xntree-item ${!open ? 'xn-hide-sub' : ''} ${(this.clicked && this.clicked[this.option.id] == l[this.option.id]) ? 'on' : ''}" data-level="${level}" data-id="${l[this.option.id]}">
                    ${span}
                    ${pre}   
                    ${selectDom}
                    <div class="xntree-label">${label}</div>
                    </div>`
        let dom = document.createElement('div');
        dom.innerHTML = h;
        return [h, dom.childNodes[0]];
    }

    search(keyword, func, containChild) {
        let that = this;
        this.seachKeys = null;
        this.searchKeyword = keyword;
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
            path.push(data[this.option.id])
            let has = func(data);
            (has || (containChild && hasP)) && result.push([...path])
            data.children && this.treeFindPath(data.children, func, path, result, containChild, (has || (containChild && hasP)))
            path.pop()
        }
        return result
    }

    addEvent() {
        let startTime = new Date().getTime();
        let clickFunc = (e) => {


            let $t = $(e.target);
            if ($t.hasClass('xn-slidedown')) {
                e.stopPropagation();
                this.slideEvent($t);
            }
            if ($t.hasClass('xn-checkbox')) {
                e.stopPropagation();
                this.checkEvent($t);
            }
            if ($t.hasClass('xn-radio')) {
                e.stopPropagation();
                this.radioEvent($t);
            }
            if ($t.hasClass('xntree-label') || $t.parents('.xntree-label').get(0)) {
                e.stopPropagation();
                let $item = $t;
                if ($t.parents('.xntree-label').get(0)) {
                    $item = $t.parents('.xntree-label').eq(0)
                }
                this.clickLabelEvent($item, $t, e);
            }
            if (new Date().getTime() - startTime < 300) {
                e.stopPropagation();
                dblclickFunc(e)
            }
            startTime = new Date().getTime();
        }
        let dblclickFunc = (e) => {
            // e.stopPropagation();
            let $t = $(e.target);
            if ($t.hasClass('xntree-label') || $t.parents('.xntree-label').get(0)) {
                let $item = $t;
                if ($t.parents('.xntree-label').get(0)) {
                    $item = $t.parents('.xntree-label').eq(0)
                }
                let p = $item.parents(".xntree-item").get(0)
                let id = p.getAttribute('data-id')
                let node = this.getNodeById(id)
                if (this.option.on && this.option.on.dblclickNode) {
                    this.option.on.dblclickNode($t, node, id, e)
                }
            }
        }
        this.clickFunc = clickFunc;
        this.container.addEventListener('click', clickFunc)

        this.mouseoverFunc = e => {
            let $t = $(e.target);
            if ($t.hasClass('xntree-item') || $t.parents('.xntree-item').get(0)) {
                let $item = $t;
                if ($t.parents('.xntree-item').get(0)) {
                    $item = $t.parents('.xntree-item').eq(0)
                }
                let id = $item.get(0).getAttribute('data-id')
                let node = this.getNodeById(id)
                if (this.option.on.hoverNode) {
                    this.option.on.hoverNode(node, $t, e)
                }
            }
        }
        this.container.addEventListener('mouseover', this.mouseoverFunc)

        let down = false;
        let move = false;
        let el = {};
        let mousedownFunc = e => {
            let $t = $(e.target);
            if ($t.parents('.xntree-item').get(0)) {
                down = true;
                el.$dom = $t.parents('.xntree-item').eq(0)
                el.id = el.$dom.attr("data-id")
                el.startTime = new Date().getTime();
            }
        }
        this.mousedownFunc = mousedownFunc;
        this.container.addEventListener("mousedown", mousedownFunc)

        let mousemoveFunc = e => {
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
                    let [dir, x, y,nextLevel] = this.getMovePos($onDom, e)
                    el.dir = dir;
                    el.y = y;
                    el.x = x;
                    el.nextLevel=nextLevel;
                    if (el.dir == 'on') {
                        el.$onDom.addClass('xn-onmoving')
                        this.movedom.style.display = 'none'
                    } else {
                        this.movedom.style.top = el.y + 'px'
                        this.movedom.style.left = el.x + 'px'
                        this.movedom.style.display = 'block'
                        this.movedom.style.width = 'calc(100% - '+el.x+'px)'
                    }
                }
                move = true;
            }
        }
        this.mousemoveFunc = mousemoveFunc;
        document.addEventListener("mousemove", mousemoveFunc)

        let mouseupFunc = e => {
            if (down && move) {
                this.moveItem(el);
            }
            down = false;
            move = false;
            this.container.classList.remove("xn-moving")
            this.movedom.style.display = 'none'
        }
        this.mouseupFunc = mouseupFunc;
        document.addEventListener("mouseup", mouseupFunc)

        let scrollFunc = e => {
            let y = (this.container.scrollTop);
            this.topIndex = Math.floor(y / this.option.lineHeight);
            this.bottomIndex = this.topIndex + this.totalNum + 4;
            this.refreshDom(true);
            this.container.querySelector(".xntree-cont").style.transform = 'translateY(' + (this.topIndex * this.option.lineHeight) + 'px)'
        }
        this.scrollFunc = scrollFunc;
        this.container.addEventListener('scroll', scrollFunc)
    }

    refreshDom(justScroll, needLocate) {
        this.index = 0;
        this.openNumber = 0;
        this.currentNumber = 0;
        this.calcCurrent=true;
        let dom = this._rendHTML(this.data, 0, justScroll);
        this.container.querySelector(".xntree-cont").innerHTML = dom;
        if (!justScroll) {
            this.scrollDom.style.height = this.openNumber * this.option.lineHeight + 'px'
            if (needLocate) {
                this.container.scrollTo(0, this.currentNumber * this.option.lineHeight)
            }
        }
        this.setScrollWidth();
    }

    moveItem(el) {
        // if(el.isNext){
        //     el.onId=
        // }
        let nextLevel=el.nextLevel
        while(el.nextLevel){
            el.onId=this.flatList[el.onId][this.option.pId];
            el.nextLevel--;
        }
        if (el.id == el.onId) {
            return;
        }
        if (this.option.disableMoveNode == true) {
            return;
        }

        if (typeof this.option.disableMoveNode == 'function') {
            let dontMove = this.option.disableMoveNode(this.getNodeById(el.id), this.getNodeById(el.onId), el.dir)
            if (dontMove) {
                return;
            }
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
        if (el.dir == 'on' || (hasChild && el.dir == 'down' && this.flatList[el.onId].children[0] && this.flatList[el.onId].children[0].$show && !nextLevel)) {//1.在节点上，2.当节点为展开状态，鼠标在节点下方，统一做在节点上的操作
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
        if ((!pNode) || (this.flatList[el.onId][this.option.id]==this.flatList[el.onId][this.option.pId])) {//有的时候跟节点的id和pid是同一个值
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
        let isNext=false;
        let nextLevel=null;
        let dir = ''
        let pos = $dom.get(0).getBoundingClientRect();
        let pPos=this.container.getBoundingClientRect()
        let top = pos.top-pPos.top, top1 = pos.top + pos.height*2 / 5, top2 = pos.top + pos.height * 3 / 5,
            top4 = pos.top + pos.height;
        let etop = e.clientY;
        let y, x;
        let curLevel=$dom.get(0).getAttribute('data-level');
        let siblingLevel=$dom.get(0).nextSibling?$dom.get(0).nextSibling.getAttribute('data-level'):null;
        let isindent=e.target.classList.contains('xn-indent');


        x = pos.left-pPos.left + ($dom.children(".xn-indent").el.length) * 15+15;
        if (etop <= top1) {
            dir = 'up'
            y = top  + this.container.scrollTop;
        }
        if (etop > top1 && etop <= top2) {
            dir = 'on'
        }
        if (etop > top2) {
            dir = 'down'
            y = top+pos.height  + this.container.scrollTop;
            if(isindent && curLevel!=siblingLevel){
                nextLevel=($dom.children('.xn-indent').el).length-($dom.children('.xn-indent').el).indexOf(e.target);
                if(curLevel-nextLevel<siblingLevel){
                    nextLevel=curLevel-siblingLevel;
                }
                x=x-nextLevel*15-15;
            }
        }
        return [dir, x, y,nextLevel];
    }

    setNodesShow(node) {
        if (!node) {
            return;
        }
        let pId = node[this.option.pId];
        let pNode = this.flatList[pId];
        if (!node.$show) {
            node.$show = true;
            if (pNode) {
                for (let i = 0; i < pNode.children.length; i++) {
                    pNode.children[i].$show = true;
                }
            }
        }
        this.setNodesShow(pNode)
    }

    setSelectKey(key, triggerClick, needLocate) {
        this.clicked = this.getNodeById(key);
        this.setNodesShow(this.clicked);
        this.refreshDom(false, needLocate)
        if (triggerClick) {
            this.trigger('clickNode', this.container.querySelector('.xntree-item[data-id="' + key + '"]'), this.clicked, key)
        }
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
            // $(this.container).find(".xntree-item.on").removeClass('on')
            // $(p).addClass('on')
        }
        this.refreshDom()

    }

    radioEvent($t) {
        let p = $t.parents(".xntree-item").get(0)
        let id = p.getAttribute('data-id')
        let node = this.getNodeById(id)
        this.checked.keys = [id];
        this.checked.nodes = {};
        this.checked.nodes[id] = this.getNodeById(id)
        this.refreshDom();
        this.trigger('checkChange', node, true, this.checked)
    }

    checkEvent($t) {
        let p = $t.parents(".xntree-item").get(0)
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
        this.trigger('checkChange', node, !checked, this.checked)
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

    setCheckedKeys(keys) {
        this.checked.nodes = {};
        for (let i = keys.length - 1; i >= 0; i--) {
            let id = keys[i]
            let node = this.getNodeById(id)
            if (!node) {//用于处理设置的key值不存在的情况
                keys.splice(i, 1)
                continue;
            }
            this.checked.nodes[id] = (node)
        }
        this.checked.keys = keys;
        this.trigger('checkChange', false, false, this.checked, true)
        this.refreshDom();
    }

    trigger(type, data) {
        var args = [].slice.call(arguments);
        args.splice(0, 1)
        if (this.option.on[type]) {
            this.option.on[type](...args)
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

    addNodes(id,nodes,open){
        for(let i=nodes.length-1;i>=0;i--){
            this._addOneNode(id,nodes[i],open)
        }
        this.refreshDom();
    }

    _addOneNode(id,node,open){
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
        if ((pNode.children[0] && pNode.children[0].$show)||open) {
            node.$show = true;
        }
        pNode.children.unshift(node);
        this.flatList[node[this.option.id]] = node;
        this.flatListKeys.push(node[this.option.id]);
    }
    addNode(id, node) {//新增节点
        this._addOneNode(id,node);
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

    getFlatData() {
        let list = [];
        this._literalFlatTree({}, this.data, this.flatList, this.flatListKeys, 0, false, list)
        if (!this.option.pId) {
            this.option.pId = '$pId'
        }
    }

    _literalFlatTree(pNode, list, arry, arrykeys, level, dontSetData, list1) {
        for (let i = 0; i < list.length; i++) {
            let l = list[i];
            if (!dontSetData) {
                l.$level = level;
                l.$show = l.$show || this.option.autoOpen(l, level)
                if (!this.option.pId) {
                    l.$pId = pNode[this.option.id];
                }
            }
            list1.push(l)
            arry[l[this.option.id]] = l
            arrykeys.push(l[this.option.id])
            if (l.children && l.children.length > 0) {
                this._literalFlatTree(l, l.children, arry, arrykeys, level + 1, dontSetData, list1)
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

    openChildren(node){
        for (let i = 0; i < node.children.length; i++) {
            node.children[i].$show = !node.children[i].$show
        }
        this.refreshDom()
    }

    async slideEvent($t) {

        let p = $t.parents(".xntree-item").get(0)
        let id = p.getAttribute('data-id');
        let node = this.getNodeById(id);
        if(node.children && node.children.length>=0){
            node.$$loaded=true;
        }
        if(node.$$loaded||!this.option.lazyLoad){
            this.openChildren(node)
        }
        else{
            let nodes=await this.option.on.loadData(node);
            node.$$loaded=true;
            this.addNodes(id,nodes,true)
        }
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

    replaceKey(text, keyword) {
        if (!keyword || keyword.trim() == '') {
            return text;
        }
        text = text.replace(new RegExp('(' + keyword + ')', 'ig'), '<span class="xn-searchedkey">$1</span>')
        return text;
    }

    destory() {
        this.container.removeEventListener('click', this.clickFunc);
        this.container.removeEventListener('dblclick', this.dblclickFunc);
        this.container.removeEventListener('mousedown', this.mousedownFunc);
        this.container.removeEventListener('mouseover', this.mouseoverFunc);
        document.removeEventListener('mousemove', this.mousemoveFunc);
        document.removeEventListener('mouseup', this.mouseupFunc);
        this.container.removeEventListener('scroll', this.scrollFunc);
        this.data = null;
        this.flatList = null;
        this.resizeObserver.unobserve(this.container)
    }

    revertListToTree(data) {
        let datajson = {};
        let d = $.extend(true, [], data);
        for (let i = 0; i < d.length; i++) {
            if (!d[i].children) {
                d[i].children = [];
            }
            datajson[d[i][this.option.id]] = d[i];

        }
        let nd = d.filter(item => {
            if (datajson[item[this.option.pId]] && item[this.option.pId] != item[this.option.id]) {
                datajson[item[this.option.pId]].children.push(item)
                return false;
            }
            return true;
        })
        return nd;
    }

    revertTreeToList(treedata) {
        let list = [];
        this._revertTreeToListFunc(treedata, list);
        return list;
    }

    _revertTreeToListFunc(treedata, list) {
        for (let i = 0; i < treedata.length; i++) {
            let item = $.extend(true, {}, treedata[i]);
            delete item.children;
            list.push(item);
            if (treedata[i].children) {
                this._revertTreeToListFunc(treedata[i].children, list);
            }
        }
    }

    getData() {
        return this.data;
    }

    returnFlatData() {
        return this.flatList
    }

};

window.xnTree = xnTree;
export default xnTree;

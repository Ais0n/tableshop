<template>
  <div id="graphView" class="graphviewList">
    <div id="graphViewLeftTopBox" class="graphviewBox" :style="'width:'+vlineLeft+'px;height:'+hlineTop+'px;top:0px;left:0px'" @dragover="handleDragOver($event, 'LT')" @drop="handleDrop($event, 'LT')" :class="{'graphviewBoxHighlight': dropoverBox == 'LT'}" @dragleave="handleDragLeave"/>
    <div id="graphViewLeftBottomBox" class="graphviewBox" :style="'width:'+vlineLeft+'px;height:'+(viewHeight-hlineTop)+'px;top:'+hlineTop+'px;left:0px'" @dragover="handleDragOver($event, 'LB')" @drop="handleDrop($event, 'LB')" :class="{'graphviewBoxHighlight': dropoverBox == 'LB'}" @dragleave="handleDragLeave"/>
    <div id="graphViewRightTopBox" class="graphviewBox" :style="'width:'+(viewWidth-vlineLeft)+'px;height:'+hlineTop+'px;top:0px;left:'+vlineLeft+'px'" @dragover="handleDragOver($event, 'RT')" @drop="handleDrop($event, 'RT')" :class="{'graphviewBoxHighlight': dropoverBox == 'RT'}" @dragleave="handleDragLeave"/>
    <div id="graphViewRightBottomBox" class="graphviewBox" :style="'width:'+(viewWidth-vlineLeft)+'px;height:'+(viewHeight-hlineTop)+'px;top:'+hlineTop+'px;left:'+vlineLeft+'px'" @dragover="handleDragOver($event, 'RB')" @drop="handleDrop($event, 'RB')" :class="{'graphviewBoxHighlight': dropoverBox == 'RB'}" @dragleave="handleDragLeave"/>

    <div id="hline" :style="'height: 0; width: '+viewWidth+'px; top: '+hlineTop+'px;'" class="hvline"></div>
    <div id="vline" :style="'height: '+viewHeight+'px; width: 0; left: '+vlineLeft+'px;'" class="hvline"></div>
  </div>
  <div
    v-show="cmVisible"
    :style="{ left: cmLeft + 'px', top: cmTop + 'px' }"
    class="contextmenu"
    id="contextmenu"
  >
    <div class="cmOption" @click="cmDelete">Delete</div>
    <div class="cmOption">Edit values</div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { mapState, mapMutations, mapActions } from "vuex";
import { Graph_Padding, Graph_Block_Size, Graph_Block_Margin, Graph_Block_Ellipsis_Height, Graph_Block_Size_Placeholder} from "../CONSTANT.js";
import {v4 as uuid} from 'uuid';
export default {
  name: "GraphView",
  data() {
    return ({
      rowTree: [],
      columnTree: [],
      cell: [],
      hlineTop: 70,
      vlineLeft: 70,
      viewHeight: 0,
      viewWidth: 0,
      dropoverBox: "",
      cmLeft: 0,
      cmTop: 0,
      cmVisible: false,
      cmAttr: undefined,
    });
  },
  computed: {
    ...mapState(["attrInfo", "draggedAttr", "draggedItemType", "draggedBlock"])
  },
  watch: {
    cmVisible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
  },
  methods: {
    calcDepth(tree) {
      if(!(tree instanceof Array) || tree.length == 0) return 0;
      let depth = 0;
      for(let i = 0; i < tree.length; i++) {
        let d = this.calcDepth(tree[i].children) + 1;
        depth = depth > d ? depth: d;
      }
      return depth;
    },
    calcHVLine() { // 计算水平和垂直参考线的位置
      let rDepth = this.calcDepth(this.rowTree), cDepth = this.calcDepth(this.columnTree);
      console.log(rDepth, cDepth)
      this.hlineTop = cDepth > 0 ? Graph_Padding.top + Graph_Padding.bottom + cDepth * Graph_Block_Size.height : 70;
      this.vlineLeft = rDepth > 0 ? Graph_Padding.left + Graph_Padding.right + rDepth * Graph_Block_Size.width : 70;
      return {rDepth, cDepth};
    },
    calcPos(tree, curHeight, curDepth, header, totalDepth) { // 计算每个块的configuration, header = 'row' or 'column'
      if(!(tree instanceof Array) || tree.length == 0) return 0;
      for(let i = 0; i < tree.length; i++) {
        if((tree[i].children instanceof Array) && tree[i].children.length > 0) {
          curHeight = this.calcPos(tree[i].children, curHeight, curDepth + 1, header, totalDepth);
          if(header == "row") {
            tree[i].top = tree[i].children[0].top;
            let height = 0;
            for(let j = 0; j < tree[i].children.length; j++) {
              height += tree[i].children[j].height + (j ? Graph_Block_Margin : 0);
            }
            tree[i].height = height;
            tree[i].left = Graph_Padding.left + curDepth * Graph_Block_Size.width;
            tree[i].width = Graph_Block_Size.width; // 先这么写
          } else {
            tree[i].left = tree[i].children[0].left;
            let width = 0;
            for(let j = 0; j < tree[i].children.length; j++) {
              width += tree[i].children[j].width + (j ? Graph_Block_Margin : 0);
            }
            tree[i].width = width;
            tree[i].top = Graph_Padding.top + curDepth * Graph_Block_Size.height;
            tree[i].height = Graph_Block_Size.height;
          }
        } else {
          if(header == "row") {
            tree[i].top = curHeight + this.hlineTop + Graph_Padding.top;
            let valueList = tree[i].values ? tree[i].values : tree[i].function ? [tree[i].function] : this.getValueList(tree[i].attrName);
            tree[i].height = valueList.length > 1 ? 2 * Graph_Block_Size.height + Graph_Block_Ellipsis_Height : Graph_Block_Size.height;
            tree[i].left = Graph_Padding.left + curDepth * Graph_Block_Size.width;
            tree[i].width = Graph_Block_Size.width * (totalDepth - curDepth);
            curHeight += tree[i].height + Graph_Block_Margin;
          } else {
            tree[i].left = curHeight + this.vlineLeft + Graph_Padding.left;
            let valueList = tree[i].values ? tree[i].values : tree[i].function ? [tree[i].function] : this.getValueList(tree[i].attrName);
            tree[i].width = valueList.length > 1 ? 2 * Graph_Block_Size.width + Graph_Block_Ellipsis_Height : Graph_Block_Size.width;
            tree[i].top = Graph_Padding.top + curDepth * Graph_Block_Size.height;
            tree[i].height = Graph_Block_Size.height * (totalDepth - curDepth);
            curHeight += tree[i].width + Graph_Block_Margin;
          }
        }
      }
      return curHeight;
    },
    calcPosForCell() { // 计算cell每个块的configuration
      for(let i = 0; i < this.cell.length; i++) {
        let rBlock, cBlock;
        if(this.cell[i].rowParentId) {
          rBlock = this.findBlock(this.rowTree, this.cell[i].rowParentId);
          rBlock = rBlock.arr[rBlock.index];
        }
        if(this.cell[i].colParentId) {
          cBlock = this.findBlock(this.columnTree, this.cell[i].colParentId);
          cBlock = cBlock.arr[cBlock.index];
        }
        this.cell[i].left = cBlock ? cBlock.left : this.vlineLeft + Graph_Block_Margin;
        this.cell[i].top = rBlock ? rBlock.top : this.hlineTop + Graph_Block_Margin;
        this.cell[i].height = rBlock ? rBlock.height : Graph_Block_Size_Placeholder.height;
        this.cell[i].width = cBlock ? cBlock.width : Graph_Block_Size_Placeholder.width;
      }
    },
    calcGraphConfig() {
      let graphViewDom = document.getElementById("graphView");
      let {rDepth, cDepth} = this.calcHVLine();
      this.calcPos(this.rowTree, 0, 0, "row", rDepth);
      this.calcPos(this.columnTree, 0, 0, "column", cDepth);
      this.fillCell();
      this.calcPosForCell();
    },
    clearGraph() {
      let graphViewDom = document.getElementById("graphView");
      for(let i = 0; i < graphViewDom.children.length; ) {
        let c = graphViewDom.children[i];
        if(c.id == "hline" || c.id == "vline" || c.classList.contains('graphviewBox')) {
          i++; 
          continue;
        }
        graphViewDom.removeChild(c);
      }
    },
    deleteBlock(bid, channel) {
      if(channel == 'cell') {
        for(let i = 0; i < this.cell.length; i++) {
          if(this.cell[i].blockId == bid) {
            let tmp = this.cell[i];
            this.cell.splice(i, 1);
            return tmp;
          }
        }
      } else {
        let deletedBlock = this.findBlock(channel == 'row' ? this.rowTree : this.columnTree, bid);
        if(!deletedBlock) return;
        let tmp = deletedBlock.arr[deletedBlock.index];
        if(tmp.children instanceof Array && tmp.children.length > 0) {
          deletedBlock.arr.splice(deletedBlock.index, 1, ...(tmp.children))
        } else {
          deletedBlock.arr.splice(deletedBlock.index, 1);
        }
        for(let i = 0; i < this.cell.length; i++) {
          if(this.cell[i].rowParentId == tmp.blockId) {
            this.cell[i].rowParentId = deletedBlock.parentBid;
          }
          if(this.cell[i].colParentId == tmp.blockId) {
            this.cell[i].colParentId = deletedBlock.parentBid;
          }
        }
        tmp.rowParentId = deletedBlock.parentBid; // corner case
        return tmp;
      }
    },
    highlightBlock(target) {
      let graphViewDom = document.getElementById("graphView");
      for(let i = 0; i < graphViewDom.children.length; i++) {
        let c = graphViewDom.children[i];
        c.classList.remove('highlightedBlock');
      }
      target.classList.add('highlightedBlock');
    },
    handleBlockDragstart(e) {
      this.$store.commit("storeDraggedItemType", 'block');
      this.$store.commit("storeDraggedBlock", e.target);
    },
    handleBlockDragover(e) {
      if(this.draggedItemType == 'block' && e.target.dataset.bid == this.draggedBlock.blockId) {
        return;
      }
      e.preventDefault();
      let x = e.clientX, y = e.clientY;
      let box = e.target.getBoundingClientRect();
      // console.log(x, y, box);
      let clearClass = (e) => {
        e.target.classList.remove('lefthover');
        e.target.classList.remove('righthover');
        e.target.classList.remove('tophover');
        e.target.classList.remove('bottomhover');
      }
      if (x < box.left + 20) {
        clearClass(e);
        e.target.classList.add('lefthover');
      } else if (x > box.right - 20) {
        clearClass(e);
        e.target.classList.add('righthover');
      } else if (y < box.top + box.height / 2) {
        clearClass(e);
        e.target.classList.add('tophover');
      } else {
        clearClass(e);
        e.target.classList.add('bottomhover');
      }
    },
    handleBlockDrop(e) {
      let dir = "";
      if(e.target.classList.contains('lefthover')) {
        dir = 'left';
      } else if(e.target.classList.contains('righthover')) {
        dir = 'right';
      } else if(e.target.classList.contains('tophover')) {
        dir = 'top';
      } else if(e.target.classList.contains('bottomhover')) {
        dir = 'bottom';
      }
      e.target.classList.remove('lefthover');
      e.target.classList.remove('righthover');
      e.target.classList.remove('tophover');
      e.target.classList.remove('bottomhover');
      if (dir != "") e.preventDefault(); else return;
      console.log(dir);
      console.log(e.target);
      let {bid, channel} = e.target.dataset;
      if(channel == 'row') {
        if(dir == 'left') {
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(this.rowTree, bid);
            if(!targetBlock) return;
            targetBlock.arr[targetBlock.index] = this.draggedItemType == 'function' ? {
              function: 'sum',
              blockId: uuid()
            } : {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
              children: [targetBlock.arr[targetBlock.index]]
            }
          } else {
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
            // 然后将被拖动的块加入新的子树
            let targetBlock = this.findBlock(this.rowTree, bid);
            if(!targetBlock) return;
            tmp.children = [targetBlock.arr[targetBlock.index]];
            targetBlock.arr[targetBlock.index] = tmp;
          }
        } else if(dir == 'right') {
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(this.rowTree, bid);
            if(!targetBlock) return;
            let parentBlock = targetBlock.arr[targetBlock.index];
            if(!parentBlock.children) parentBlock.children = [];
            parentBlock.children.push(this.draggedItemType == 'function' ? {
              function: 'sum',
              blockId: uuid(),
            } : {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
            })
          } else {
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
            // 然后将被拖动的块加入新的子树
            let targetBlock = this.findBlock(this.rowTree, bid);
            if(!targetBlock) return;
            tmp.children = targetBlock.arr[targetBlock.index].children;
            if(!(tmp.children instanceof Array) || tmp.children.length == 0) {
              for(let i = 0; i < this.cell.length; i++) {
                if(this.cell[i].blockId != -1) {
                  if(this.cell[i].rowParentId == targetBlock.arr[targetBlock.index].blockId) {
                    this.cell[i].rowParentId = tmp.blockId;
                  }
                  if(this.cell[i].colParentId == targetBlock.arr[targetBlock.index].blockId) {
                    this.cell[i].colParentId = tmp.blockId;
                  }
                }
              }
            }
            targetBlock.arr[targetBlock.index].children = [tmp];
          }
        } else {
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(this.rowTree, bid);
            if(!targetBlock) return;
            targetBlock.arr.splice(targetBlock.index + (dir == 'bottom' ? 1 : 0), 0,  this.draggedItemType == 'function' ? {
              function: 'sum',
              blockId: uuid(),
            } : {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
            })
          } else {
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
            // 然后将被拖动的块加入新的子树
            tmp.children = undefined;
            let targetBlock = this.findBlock(this.rowTree, bid);
            if(!targetBlock) return;
            targetBlock.arr.splice(targetBlock.index + (dir == 'bottom' ? 1 : 0), 0, tmp);
          }
        }
      } else if(channel == 'column') {
        if(dir == 'top') {
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(this.columnTree, bid);
            if(!targetBlock) return;
            targetBlock.arr[targetBlock.index] = this.draggedItemType == 'function' ? {
              function: 'sum',
              blockId: uuid(),
            } : {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
              children: [targetBlock.arr[targetBlock.index]]
            }
          } else {
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
            // 然后将被拖动的块加入新的子树
            let targetBlock = this.findBlock(this.columnTree, bid);
            if(!targetBlock) return;
            tmp.children = [targetBlock.arr[targetBlock.index]];
            targetBlock.arr[targetBlock.index] = tmp;
          }
        } else if(dir == 'bottom') {
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(this.columnTree, bid);
            if(!targetBlock) return;
            let parentBlock = targetBlock.arr[targetBlock.index];
            if(!parentBlock.children) parentBlock.children = [];
            parentBlock.children.push(this.draggedItemType == 'function' ? {
              function: 'sum',
              blockId: uuid(),
            } : {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
            })
          } else {
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
            // 然后将被拖动的块加入新的子树
            let targetBlock = this.findBlock(this.columnTree, bid);
            if(!targetBlock) return;
            tmp.children = targetBlock.arr[targetBlock.index].children;
            if(!(tmp.children instanceof Array) || tmp.children.length == 0) {
              for(let i = 0; i < this.cell.length; i++) {
                if(this.cell[i].blockId != -1) {
                  if(this.cell[i].rowParentId == targetBlock.arr[targetBlock.index].blockId) {
                    this.cell[i].rowParentId = tmp.blockId;
                  }
                  if(this.cell[i].colParentId == targetBlock.arr[targetBlock.index].blockId) {
                    this.cell[i].colParentId = tmp.blockId;
                  }
                }
              }
            }
            targetBlock.arr[targetBlock.index].children = [tmp];
          }
        } else {
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(this.columnTree, bid);
            if(!targetBlock) return;
            targetBlock.arr.splice(targetBlock.index + (dir == 'right' ? 1 : 0), 0, this.draggedItemType == 'function' ? {
              function: 'sum',
              blockId: uuid(),
            } : {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
            })
          } else {
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
            // 然后将被拖动的块加入新的子树
            tmp.children = undefined;
            let targetBlock = this.findBlock(this.columnTree, bid);
            if(!targetBlock) return;
            targetBlock.arr.splice(targetBlock.index + (dir == 'right' ? 1 : 0), 0, tmp);
          }
        }
      }
      this.calcGraphConfig();
      this.clearGraph();
      this.drawGraph();
    },
    handleBlockDragleave(e) {
      e.target.classList.remove('lefthover');
      e.target.classList.remove('righthover');
      e.target.classList.remove('tophover');
      e.target.classList.remove('bottomhover');
    },
    handleBlockClick(e) {
      let source = (e.target.dataset.channel == 'row') ? this.rowTree : (e.target.dataset.channel == 'column') ? this.columnTree : this.cell;
      let block = this.findBlock(source, e.target.dataset.bid);
      if(!block) return;
      this.$store.commit("storeSelectedBlock", block.arr[block.index]);
      this.highlightBlock(e.target);
    },
    openMenu(e) {
      e.preventDefault();
      let source = (e.target.dataset.channel == 'row') ? this.rowTree : (e.target.dataset.channel == 'column') ? this.columnTree : this.cell;
      this.cmAttr = e.target;
      this.cmVisible = true;
      this.cmLeft = e.clientX;
      this.cmTop = e.clientY;
    },
    closeMenu(e) {
      let x = e.clientX;
      let y = e.clientY;
      let menu = document.getElementById("contextmenu");
      if (
        x < this.cmLeft ||
        x > this.cmLeft + menu.clientWidth ||
        y < this.cmTop ||
        y > this.cmTop + menu.clientHeight
      ) {
        this.cmVisible = false;
      }
    },
    findBlock(arr, bid, parentBid) { // 在arr中寻找blockId=bid的块; parentBid是父亲的blockId; 返回父亲块的blockId, children 及目标块在 children 中的Index
      if(!(arr instanceof Array) || arr.length == 0) return;
      for(let i = 0; i < arr.length; i++) {
        if(arr[i].blockId == bid) return {arr, index: i, parentBid};
        if(arr[i].children) {
          let d = this.findBlock(arr[i].children, bid, arr[i].blockId);
          if(d) return d;
        }
      }
    },
    handleCellBlockDragover(e) {
      if(this.draggedItemType == 'block' && e.target.dataset.bid == this.draggedBlock.blockId) {
        return;
      }
      e.preventDefault();
      e.target.classList.add('graphviewBoxHighlight');
    },
    handleCellBlockDrop(e) {
      e.target.classList.remove("graphviewBoxHighlight");
      for(let i = 0; i < this.cell.length; i++) {
        if(this.cell[i].rowParentId == e.target.dataset.rowParentId && this.cell[i].colParentId == e.target.dataset.colParentId) {
          let rowParentId = this.cell[i].rowParentId, colParentId = this.cell[i].colParentId;
          if(this.draggedItemType == 'attr') {
            this.cell.splice(i, 1, {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
              rowParentId,
              colParentId,
            })
          } else if(this.draggedItemType == 'block') {
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
            if(tmp.blockId == rowParentId) {
              tmp.colParentId = colParentId;
            } else if(tmp.blockId == colParentId) {
              tmo.colParentId = tmp.rowParentId;
              tmp.rowParentId = rowParentId;
            } else {
              tmp.rowParentId = rowParentId;
              tmp.colParentId = colParentId;
            }
            tmp.blockId = uuid();
            this.cell.splice(i, 1, tmp);
          }
        }
      }
      this.calcGraphConfig();
      this.clearGraph();
      this.drawGraph();
    },
    handleCellBlockDragleave(e) {
      e.target.classList.remove("graphviewBoxHighlight");
    },
    drawGraphChannel(arr, channel, graphViewDom) {
      if(!(arr instanceof Array)) return;
      for(let i = 0; i < arr.length; i++) {
        let block = arr[i];
        let newDom = document.createElement("div");
        newDom.className = (arr[i].blockId == '-1') ? 'placeholderBlock' : 'block';
        newDom.style.position = 'absolute';
        newDom.style.top = block.top + 'px';
        newDom.style.left = block.left + 'px';
        newDom.style.height = block.height + 'px';
        newDom.style.width = block.width + 'px';
        newDom.dataset.bid = block.blockId;
        newDom.dataset.channel = channel;
        if(block.rowParentId) newDom.dataset.rowParentId = block.rowParentId;
        if(block.colParentId) newDom.dataset.colParentId = block.colParentId;
        let valueList = block.values ? block.values : block.function ? [block.function] : this.getValueList(block.attrName);
        if(channel == 'row') {
          newDom.innerText = valueList.length > 1 ? `${valueList[0]}\n...\n${valueList[valueList.length-1]}` : valueList[0];
        } else if(channel == 'column') {
          newDom.innerText = valueList.length > 1 ? `${valueList[0]} ... ${valueList[valueList.length-1]}` : valueList[0];
        } else {
          if(arr[i].blockId != '-1') {
            newDom.innerText = valueList.length > 1 ? `${valueList[0]} ... ${valueList[valueList.length-1]}` : valueList[0]; // to change
          }
        }
        newDom.draggable = (arr[i].blockId != -1);
        newDom.ondragstart = this.handleBlockDragstart;
        newDom.ondragover = (channel == 'cell') ? this.handleCellBlockDragover : this.handleBlockDragover;
        newDom.ondrop = (channel == 'cell') ? this.handleCellBlockDrop : this.handleBlockDrop;
        newDom.ondragleave = (channel == 'cell') ? this.handleCellBlockDragleave : this.handleBlockDragleave;
        newDom.oncontextmenu = this.openMenu;
        newDom.onclick = this.handleBlockClick;
        graphViewDom.appendChild(newDom);
        if(block.children) {
          this.drawGraphChannel(block.children, channel, graphViewDom); 
        }
      }
    },
    drawGraph() {
      let graphViewDom = document.getElementById("graphView");
      this.drawGraphChannel(this.rowTree, 'row', graphViewDom);
      this.drawGraphChannel(this.columnTree, 'column', graphViewDom);
      this.drawGraphChannel(this.cell, 'cell', graphViewDom);
    },
    fillCell() { // 为cell channel添加一些空白的blocks
      for(let i = 0; i < this.cell.length; ) {
        if(this.cell[i].blockId == -1 || (!this.cell[i].rowParentId && !this.cell[i].colParentId)) {
          this.cell.splice(i, 1);
        } else {
          i++;
        }
      }
      let rLeaves = this.getLeaves(this.rowTree), cLeaves = this.getLeaves(this.columnTree);
      let dict = new Set();
      for(let i = 0; i < this.cell.length; i++) {
        let key = (this.cell[i].rowParentId ? this.cell[i].rowParentId : "") + (this.cell[i].colParentId ? this.cell[i].colParentId : "");
        dict.add(key);
      }
      if(rLeaves.length == 0 && cLeaves.length != 0) { // 列表
        for(let i = 0; i < cLeaves.length; i++) {
          if(dict.has(cLeaves[i])) continue;
          this.cell.push({
            blockId: -1, // -1 表示这实际上是个空白块
            colParentId: cLeaves[i]
          });
        }
      } else if(rLeaves.length != 0 && cLeaves.length == 0) { // 行表 
        for(let i = 0; i < rLeaves.length; i++) {
          if(dict.has(rLeaves[i])) continue;
          this.cell.push({
            blockId: -1,
            rowParentId: rLeaves[i]
          });
        }
      } else if(rLeaves.length != 0 && cLeaves.length != 0) { // 交叉表
        for(let i = 0; i < rLeaves.length; i++) {
          for(let j = 0; j < cLeaves.length; j++) {
            let key = rLeaves[i] + cLeaves[j];
            if(dict.has(key)) continue;
            this.cell.push({
              blockId: -1,
              rowParentId: rLeaves[i],
              colParentId: cLeaves[j],
            })
          }
        }
      }
    },
    getLeaves(tree) { // 获取row/column header的叶子节点
      if(!(tree instanceof Array) || tree.length == 0) return [];
      let res = [];
      for(let i = 0; i < tree.length; i++) {
        if(tree[i].children instanceof Array && tree[i].children.length > 0) {
          let d = this.getLeaves(tree[i].children);
          res = [...res, ...d];
        } else {
          res = [...res, tree[i].blockId];
        }
      }
      return res;
    },
    getValueList(attrName) {
      if(!attrName) return [];
      for(let i = 0; i < this.attrInfo.length; i++) {
        if(this.attrInfo[i].name == attrName) {
          return this.attrInfo[i].values;
        }
      }
    },
    // drawLine(conf) {
		// 	const {start_left, start_top, end_left, end_top, type} = conf;
		// 	const delta_x = end_left - start_left;
		// 	const delta_y = end_top - start_top;
		// 	const linelen = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
		// 	const angle = Math.atan2(delta_y, delta_x); // unit: rad
		// 	//because the rotation center is the center of the line, need a offset to adjust
		// 	const offset_x =  linelen / 2 * (Math.cos(angle) - 1);
		// 	const offset_y = linelen / 2 * Math.sin(angle);
		// 	const real_left = start_left + offset_x;
		// 	const real_top = start_top + offset_y;
		// 	let container = document.getElementById("graphView");
		// 	let line = document.createElement("div");
		// 	let arrow = document.createElement("div");
		// 	arrow.className = "arrow-right";
		// 	arrow.style.borderLeft = type === "solid" ? 
		// 			"10px solid rgba(180, 179, 179, 1)" : "10px solid rgba(180, 179, 179, 0.3)";
		// 	line.appendChild(arrow);
		// 	line.className = "linediv";
		// 	line.style.left = String(real_left) + "px";
		// 	line.style.top = String(real_top) + "px";
		// 	line.style.width = String(linelen-5) + "px";
		// 	line.style.borderTopStyle = type;
		// 	line.style.borderTopWidth = type === "solid" ? "2px" : "1px";
		// 	line.style.transform = "rotateZ(" + String(angle / Math.PI * 180) + "deg)";
		// 	container.appendChild(line);
		// },
    addPoint(block, channel) {
      if(channel == "LB") {
        this.rowTree.push(block);
      } else if(channel == "RT") {
        this.columnTree.push(block);
      }
      for(let i = 0; i < this.cell.length; i++) {
        if(channel == "LB" && !this.cell[i].rowParentId) {
          this.cell[i].rowParentId = block.blockId;
        }
        if(channel == "RT" && !this.cell[i].colParentId) {
          this.cell[i].colParentId = block.blockId;
        }
      }
    },
    handleDragOver(e, pos) {
      if(pos == "LT" || pos == "RB") return;
      e.preventDefault();
      console.log("dragover, ", pos);
      this.dropoverBox = pos;
    },
    handleDrop(e, pos) {
      e.preventDefault();
      console.log("drop, ", pos);
      this.dropoverBox = "";

      if(this.draggedItemType == 'attr') {
        let newBlock = {
          attrName: this.draggedAttr.name,
          blockId: uuid(),
        };
        this.addPoint(newBlock, pos);
      } else {
        // 首先将被拖动的块从树中删除
        let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
        tmp.children = undefined;
        this.addPoint(tmp, pos);
      }
      this.calcGraphConfig();
      this.clearGraph();
      this.drawGraph();
    },
    handleDragLeave() {
      this.dropoverBox = "";
    },
    updateBlock(block) {
      let targetBlock;
      targetBlock = this.findBlock(this.rowTree, block.blockId);
      if(targetBlock) {
        targetBlock.arr[targetBlock.index] = block;
        return;
      }
      targetBlock = this.findBlock(this.columnTree, block.blockId);
      if(targetBlock) {
        targetBlock.arr[targetBlock.index] = block;
        return;
      }
      targetBlock = this.findBlock(this.cell, block.blockId);
      if(targetBlock) {
        targetBlock.arr[targetBlock.index] = block;
        return;
      }
    },
    cmDelete(e) {
      this.cmVisible = false;
      this.deleteBlock(this.cmAttr.dataset.bid, this.cmAttr.dataset.channel);
      this.calcGraphConfig();
      this.clearGraph();
      this.drawGraph();
    }
  },
  mounted() {
    // 设置回调
    this.$bus.on('update', this.updateBlock);

    let graphViewDom = document.getElementById("graphView");
    this.viewHeight = graphViewDom.scrollHeight;
    this.viewWidth = graphViewDom.scrollWidth;
    this.calcGraphConfig();
    this.drawGraph();
  },
  updated() {
    let graphViewDom = document.getElementById("graphView");
    this.viewHeight = graphViewDom.scrollHeight;
    this.viewWidth = graphViewDom.scrollWidth;
  }
}
</script>

<style>
.graphviewList {
  background: white;
  width: 100%;
  height: calc(100% - 28px);
  margin-top: 5px;
  position: relative;
  overflow: scroll;
}

.graphviewBox {
  position: absolute;
  background: white;
}

.graphviewBoxHighlight {
  background: #cacaca !important;
}

.linediv {
	display: inline-block;
	position: absolute; /* relative to its container */
	height: 0;
	/* background-color: #d6d6d6; */
	border-top-color: #b4b3b3;
}

.block {
  border: 1px solid black;
  cursor: pointer;
  text-align: center;
  font-family: Inter-Light-7, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.placeholderBlock {
  border: 2px dashed #dadada;
  cursor: pointer;
  text-align: center;
}

.lefthover {
  border-left: 2px solid red;
}

.righthover {
  border-right: 2px solid red;
}

.tophover {
  border-top: 2px solid red;
}

.bottomhover{
  border-bottom: 2px solid red;
}

.hvline {
  position: absolute;
  border: 1px dashed #dadada;
}

.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: fixed;
  list-style-type: none;
  border: 1px solid #dbd8d8;
  overflow: scroll;
  text-align: left;
  width: 140px;
  height: 200px;
}

.contextmenu::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}

.highlightedBlock {
  border: 2px solid black;
}

.cmOption {
  border-bottom: 1px dashed #dadada;
  font-family: Inter-Regular-9, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  padding: 3px 10px;
}

.cmOption:hover {
  background-color: #eaeaea;
}
</style>

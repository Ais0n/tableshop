<template>
  <div id="graphCanvas" class="graphCanvas" @dragover="handleDragOver($event, 'GC')" @drop="handleDrop($event, 'GC')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'GC'}">
    <!-- <div v-for="(dom, index) in canvasDom" :key="'canvasDom' + String(index)" :class="dom.className" :style="dom.style" :data-bid="dom.dataset.bid"
    :data-channel="dom.dataset.channel" :data-row-parent-id="dom.dataset.rowParentId" :data-col-parent-id="dom.dataset.colParentId" :draggable="dom.draggable"
    @dragover="dom.ondragover" @dragstart="handleBlockDragstart" @dragleave="dom.ondragleave" :drop="dom.ondrop" @click="dom.onclick" @contextmenu="dom.oncontextmenu"
    >
      {{dom.innerText}}
    </div> -->
    <Puzzle :domSource="canvasDom"> </Puzzle>
    <div id="tableCanvas" class="tableCanvas">
      <div id="graphViewLeftTopBox" class="tableCanvasBox" :style="'width:'+vlineLeft+'px;height:'+hlineTop+'px;top:0px;left:0px'" @dragover="handleDragOver($event, 'LT')" @drop="handleDrop($event, 'LT')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'LT'}" @dragleave="handleDragLeave"/>
      <div id="graphViewLeftBottomBox" class="tableCanvasBox" :style="'width:'+vlineLeft+'px;height:'+(viewHeight-hlineTop)+'px;top:'+hlineTop+'px;left:0px'" @dragover="handleDragOver($event, 'LB')" @drop="handleDrop($event, 'LB')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'LB'}" @dragleave="handleDragLeave"/>
      <div id="graphViewRightTopBox" class="tableCanvasBox" :style="'width:'+(viewWidth-vlineLeft)+'px;height:'+hlineTop+'px;top:0px;left:'+vlineLeft+'px'" @dragover="handleDragOver($event, 'RT')" @drop="handleDrop($event, 'RT')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'RT'}" @dragleave="handleDragLeave"/>
      <div id="graphViewRightBottomBox" class="tableCanvasBox" :style="'width:'+(viewWidth-vlineLeft)+'px;height:'+(viewHeight-hlineTop)+'px;top:'+hlineTop+'px;left:'+vlineLeft+'px'" @dragover="handleDragOver($event, 'RB')" @drop="handleDrop($event, 'RB')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'RB'}" @dragleave="handleDragLeave"/>
      <Puzzle :domSource="rowDom"> </Puzzle>
      <Puzzle :domSource="columnDom"> </Puzzle>
      <Puzzle :domSource="cellDom"> </Puzzle>
      <!-- <div id="hline" :style="'height: 0; width: '+viewWidth+'px; top: '+hlineTop+'px;'" class="hvline"></div>
      <div id="vline" :style="'height: '+viewHeight+'px; width: 0; left: '+vlineLeft+'px;'" class="hvline"></div> -->
    </div>
    <div
      v-show="cmVisible"
      :style="{ left: cmLeft + 'px', top: cmTop + 'px' }"
      class="contextmenu"
      id="contextmenu"
    >
      <!-- Options -->
      <div class="cmOption" @click="cmDelete">Delete</div>
      <div class="cmOption" @click="cmExpand">Expand</div>
      <div class="cmOption" @click="cmEditValues">Edit values</div>
      <div class="cmOption" @click="cmSeparate">Separate</div>
      <!-- Modal For EditValues -->
      <a-modal v-model:visible="modalopen" title="Edit values" @ok="()=>{}" :zIndex="6000">
        <div v-if="cmBlockType=='Function'">
          Function:
          <a-select v-model:value="cmFunctionValue" style="margin-left: 15px">
            <a-select-option value="sum">sum</a-select-option>
            <!-- <a-select-option value="ttt">ttt</a-select-option> -->
          </a-select> 
        </div>
        <div v-else class="cmBlockValueList">
          <Spreadsheet v-for="(table, index) in cmBlockValueLists_t" :key="`cmBlockValueList_${JSON.stringify(table)}`" :header="cmBlockType == 'Entity' ? [cmBlock.attrName] : []" :table="table" 
          @cell-change="handlecmBlockValueListCellChange(index, $event)" :qsep="cmSeparateMode == 'quickSeparate'" @cell-separate="handlecmQsep(index, $event)" style="display: inline-block; margin-left: 15px">
            <a-popover trigger="click" placement="right">
              <template #content>
                <p> test </p>
              </template>
              <i class="iconfont iconFilter"> &#xe6bf; </i>
            </a-popover>
          </Spreadsheet>
          <div class="separateButtonMenu" style="padding-left: calc(50% - 110px)">
            <a-button class="separateButton"> Separate </a-button>
            <a-radio-group button-style="solid" :value="cmSeparateMode">
              <a-radio-button class="separateButton"  @click="setQuickSeparate" value="quickSeparate"> Quick separate </a-radio-button>
            </a-radio-group>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { mapState, mapMutations, mapActions } from "vuex";
import { Graph_Padding, Graph_Block_Size, Graph_Block_Margin, Graph_Block_Ellipsis_Height, Graph_Block_Size_Placeholder} from "../CONSTANT.js";
import Puzzle from "./Puzzle.vue";
import {v4 as uuid} from 'uuid';
import Spreadsheet from "./Spreadsheet/Index.vue";
import Utils from "../utils.js";
export default {
  name: "GraphView",
  data() {
    return ({
      rowTree: [],
      columnTree: [],
      cell: [],
      canvas: [],
      rowDom: [],
      columnDom: [],
      cellDom: [],
      canvasDom: [],
      hlineTop: 140,
      vlineLeft: 140,
      viewHeight: 0,
      viewWidth: 0,
      dropoverBox: "",
      cmLeft: 0,
      cmTop: 0,
      cmVisible: false,
      cmBlockDom: undefined,
      cmBlock: undefined,
      cmBlockOriginalValueList: [],
      cmBlockValueLists: [],
      cmBlockType: "",
      cmFunctionValue: "",
      cmSeparateMode: "separate",
      // cmSelectCellIndex: -1,
      modalopen: false,
    });
  },
  computed: {
    ...mapState(["attrInfo", "draggedAttr", "draggedItemType", "draggedBlock"]),
    cmBlockValueLists_t() {
      let res = [];
      for(let i = 0; i < this.cmBlockValueLists.length; i++) {
        res.push(Utils.transposeTable([this.cmBlockValueLists[i]]))
      }
      console.log(res);
      return res;
    }
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
        let d = this.calcDepth(tree[i].children) + this.checkInsertValid(tree[i], false) ? 0 : 1;
        depth = depth > d ? depth: d;
      }
      return depth;
    },
    calcHVLine() { // 计算水平和垂直参考线的位置
      let rDepth = this.calcDepth(this.rowTree), cDepth = this.calcDepth(this.columnTree);
      console.log(rDepth, cDepth)
      this.hlineTop = cDepth > 0 ? Graph_Padding.top + cDepth * Graph_Block_Size.height : 140;
      this.vlineLeft = rDepth > 0 ? Graph_Padding.left + rDepth * Graph_Block_Size.width : 140;
      return {rDepth, cDepth};
    },
    calcPos(tree, curHeight, curDepth, header, totalDepth) { // 计算每个块的configuration, header = 'row' or 'column'
      if(!(tree instanceof Array) || tree.length == 0) return 0;
      for(let i = 0; i < tree.length; i++) {
        if((tree[i].children instanceof Array) && tree[i].children.length > 0) {
          let entityMerge = this.checkInsertValid(tree[i], false);
          curHeight = this.calcPos(tree[i].children, curHeight, curDepth + (entityMerge ? 0 : 1), header, totalDepth);
          if(header == "row") {
            if(this.chec)
            tree[i].top = tree[i].children[0].top;
            let height = 0;
            for(let j = 0; j < tree[i].children.length; j++) {
              height += tree[i].children[j].height;
            }
            tree[i].height = height;
            tree[i].left = Graph_Padding.left + curDepth * Graph_Block_Size.width;
            tree[i].width = Graph_Block_Size.width; // 先这么写
          } else {
            tree[i].left = tree[i].children[0].left;
            let width = 0;
            for(let j = 0; j < tree[i].children.length; j++) {
              width += tree[i].children[j].width;
            }
            tree[i].width = width;
            tree[i].top = Graph_Padding.top + curDepth * Graph_Block_Size.height;
            tree[i].height = Graph_Block_Size.height;
          }
        } else {
          if(header == "row") {
            tree[i].rowspan = 1;
            tree[i].colspan = totalDepth - curDepth;
            tree[i].top = curHeight + this.hlineTop;
            // let valueList = tree[i].values ? tree[i].values : tree[i].function ? [tree[i].function] : this.getValueList(tree[i].attrName);
            tree[i].height = Graph_Block_Size.height;
            tree[i].left = Graph_Padding.left + curDepth * Graph_Block_Size.width;
            tree[i].width = Graph_Block_Size.width * (totalDepth - curDepth);
            curHeight += tree[i].height;
          } else {
            tree[i].left = curHeight + this.vlineLeft;
            // let valueList = tree[i].values ? tree[i].values : tree[i].function ? [tree[i].function] : this.getValueList(tree[i].attrName);
            tree[i].width = Graph_Block_Size.width;
            tree[i].top = Graph_Padding.top + curDepth * Graph_Block_Size.height;
            tree[i].height = Graph_Block_Size.height * (totalDepth - curDepth);
            curHeight += tree[i].width;
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
        this.cell[i].left = cBlock ? cBlock.left : this.vlineLeft;
        this.cell[i].top = rBlock ? rBlock.top : this.hlineTop;
        this.cell[i].height = rBlock ? rBlock.height : Graph_Block_Size_Placeholder.height;
        this.cell[i].width = cBlock ? cBlock.width : Graph_Block_Size_Placeholder.width;
      }
    },
    calcGraphConfig() {
      let tableCanvasDom = document.getElementById("tableCanvas");
      let {rDepth, cDepth} = this.calcHVLine();
      this.calcPos(this.rowTree, 0, 0, "row", rDepth);
      this.calcPos(this.columnTree, 0, 0, "column", cDepth);
      this.fillCell();
      this.calcPosForCell();
    },
    clearGraph() {
      // let graphCanvasDom = document.getElementById("graphCanvas");
      // let tableCanvasDom = document.getElementById("tableCanvas");
      // for(let i = 0; i < graphCanvasDom.children.length; ) {
      //   let c = graphCanvasDom.children[i];
      //   if(c.id == "tableCanvas" || c.id == "contextmenu") {
      //     i++; 
      //     continue;
      //   }
      //   graphCanvasDom.removeChild(c);
      // }
      // for(let i = 0; i < tableCanvasDom.children.length; ) {
      //   let c = tableCanvasDom.children[i];
      //   if(c.classList.contains('tableCanvasBox')) {
      //     i++; 
      //     continue;
      //   }
      //   tableCanvasDom.removeChild(c);
      // }
      this.canvasDom = [];
      this.rowDom = [];
      this.columnDom = [];
      this.cellDom = [];
    },
    deleteBlock(bid, channel) {
      if(channel == 'canvas') {
        for(let i = 0; i < this.canvas.length; i++) {
          if(this.canvas[i].blockId == bid) {
            let tmp = this.canvas[i];
            this.canvas.splice(i, 1);
            return tmp;
          }
        }
      } else if(channel == 'cell') {
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
      let tableCanvasDom = document.getElementById("tableCanvas");
      for(let i = 0; i < tableCanvasDom.children.length; i++) {
        let c = tableCanvasDom.children[i];
        c.classList.remove('highlightedBlock');
        for(let j = 0; j < c.children.length; j++) {
          c.children[j].classList.remove('highlightedBlock');
        }
      }
      // let tmp = document.getElementsByClassName("highlightedBlock");
      // console.log(tmp)
      // for(let i = 0; i < tmp.length; i++) {
      //   tmp[i].classList.remove('highlightedBlock');
      // }
      target.classList.add('highlightedBlock');
      for(let i = 0; i < target.children.length; i++) {
        let c = target.children[i];
        if(c.dataset && (c.dataset.dir == 'left' || c.dataset.dir == 'bottom')) {
          c.classList.add('highlightedBlock');
        }
      }
    },
    handleBlockDragstart(e) {
      console.log(e)
      this.$store.commit("storeDraggedItemType", 'block');
      this.$store.commit("storeDraggedBlock", e.target);
    },
    handleBlockDragover(e) {
      e.stopPropagation();
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
        e.target.classList.remove("rightchildhover");
        e.target.classList.remove("bottomchildhover");
      }
      if (x < box.left + 20) {
        clearClass(e);
        e.target.classList.add('lefthover');
      } else if (x > box.right - 20) {
        clearClass(e);
        if(e.target.dataset.channel == 'column' && y > box.top + 30) {
          e.target.classList.add('rightchildhover');
        } else {
          e.target.classList.add('righthover');
        }
      } else if (y < box.top + box.height / 2) {
        clearClass(e);
        e.target.classList.add('tophover');
      } else {
        clearClass(e);
        if(e.target.dataset.channel == 'row' && x > box.left + 30) {
          e.target.classList.add("bottomchildhover");
        } else {
          e.target.classList.add('bottomhover');
        }
      }
    },
    handleBlockDrop(e) {
      e.stopPropagation();
      let dir = "";
      if(e.target.classList.contains('lefthover')) {
        dir = 'left';
      } else if(e.target.classList.contains('righthover')) {
        dir = 'right';
      } else if(e.target.classList.contains('tophover')) {
        dir = 'top';
      } else if(e.target.classList.contains('bottomhover')) {
        dir = 'bottom';
      } else if(e.target.classList.contains('rightchildhover')) {
        dir = 'rightchild';
      } else if(e.target.classList.contains('bottomchildhover')) {
        dir = 'bottomchild';
      }
      e.target.classList.remove('lefthover');
      e.target.classList.remove('righthover');
      e.target.classList.remove('tophover');
      e.target.classList.remove('bottomhover');
      e.target.classList.remove("rightchildhover");
      e.target.classList.remove("bottomchildhover");
      if (dir != "") e.preventDefault(); else return;
      console.log(dir);
      console.log(e.target);
      let {bid, channel} = e.target.dataset;
      if(channel == 'row') {
        if(dir == 'left') {
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(this.rowTree, bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild' || dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
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
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild' || dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
            tmp.children = [targetBlock.arr[targetBlock.index]];
            targetBlock.arr[targetBlock.index] = tmp;
          }
        } else if(dir == 'right' || dir == 'bottomchild') {
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(this.rowTree, bid);
            if(!targetBlock) return;
            let parentBlock = targetBlock.arr[targetBlock.index];
            // 检查插入是否合法
            if(!this.checkInsertValid(parentBlock, dir == 'rightchild' || dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
            if(!parentBlock.children) parentBlock.children = [];
            parentBlock.children.push(this.draggedItemType == 'function' ? {
              function: 'sum',
              blockId: uuid(),
            } : {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
              entityMerge: true,
            })
          } else {
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
            // 然后将被拖动的块加入新的子树
            let targetBlock = this.findBlock(this.rowTree, bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild' || dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
            tmp.entityMerge = (dir == 'bottomchild');
            // tmp.children = targetBlock.arr[targetBlock.index].children;
            tmp.children = [];
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
            if(!targetBlock.arr[targetBlock.index].children) targetBlock.arr[targetBlock.index].children = [];
            targetBlock.arr[targetBlock.index].children.splice(0, 0, tmp);
            // targetBlock.arr[targetBlock.index].children = [tmp];
          }
        } else { // top || bottom
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(this.rowTree, bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild' || dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
            targetBlock.arr.splice(targetBlock.index + (dir == 'bottom' ? 1 : 0), 0,  this.draggedItemType == 'function' ? {
              function: 'sum',
              blockId: uuid(),
            } : {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
            })
          } else { // block
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
            // 然后将被拖动的块加入新的子树
            tmp.children = undefined;
            let targetBlock = this.findBlock(this.rowTree, bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild' || dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
            targetBlock.arr.splice(targetBlock.index + (dir == 'bottom' ? 1 : 0), 0, tmp);
          }
        }
      } else if(channel == 'column') {
        if(dir == 'top') {
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(this.columnTree, bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild' || dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
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
            if(!targetBlock) return
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild' || dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            };
            tmp.children = [targetBlock.arr[targetBlock.index]];
            targetBlock.arr[targetBlock.index] = tmp;
          }
        } else if(dir == 'bottom' || dir == 'rightchild') {
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(this.columnTree, bid);
            if(!targetBlock) return;
            let parentBlock = targetBlock.arr[targetBlock.index];
            // 检查插入是否合法
            if(!this.checkInsertValid(parentBlock, dir == 'rightchild' || dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
            if(!parentBlock.children) parentBlock.children = [];
            parentBlock.children.push(this.draggedItemType == 'function' ? {
              function: 'sum',
              blockId: uuid(),
            } : {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
              entityMerge: true,
            })
          } else {
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
            // 然后将被拖动的块加入新的子树
            targetBlock = this.findBlock(this.columnTree, bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild' || dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
            // tmp.children = targetBlock.arr[targetBlock.index].children;
            tmp.children = [];
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
            if(!targetBlock.arr[targetBlock.index].children) targetBlock.arr[targetBlock.index].children = [];
            targetBlock.arr[targetBlock.index].children.splice(0, 0, tmp);
            // targetBlock.arr[targetBlock.index].children = [tmp];
          }
        } else { // 'left' || 'right'
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(this.columnTree, bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild' || dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
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
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild' || dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
            targetBlock.arr.splice(targetBlock.index + (dir == 'right' ? 1 : 0), 0, tmp);
          }
        }
      }
      this.calcGraphConfig();
      this.clearGraph();
      this.drawGraph();
    },
    handleBlockDragleave(e) {
      e.stopPropagation();
      e.target.classList.remove('lefthover');
      e.target.classList.remove('righthover');
      e.target.classList.remove('tophover');
      e.target.classList.remove('bottomhover');
      e.target.classList.remove('rightchildhover');
      e.target.classList.remove('bottomchildhover');
    },
    checkInsertValid(parentBlock, isInsertEntityMerge) {
      if(!parentBlock.children || !(parentBlock.children instanceof Array) || parentBlock.children.length == 0) return true;
      let entityMerge = -1; // 1: true, 0: false, -1: any
      for(let i = 0; i < parentBlock.children.length; i++) {
        let cur = (parentBlock.children[i].entityMerge == true);
        if(i == 0) {
          cur = entityMerge;
        } else if(cur != entityMerge) {
          throw new Error("Illegal table!");
        }
        if(entityMerge != isInsertEntityMerge) return false;
      }
      return true;
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
      this.cmBlockDom = e.target;
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
      e.stopPropagation();
      if(this.draggedItemType == 'block' && e.target.dataset.bid == this.draggedBlock.blockId) {
        return;
      }
      e.preventDefault();
      e.target.classList.add('tableCanvasBoxHighlight');
    },
    handleCellBlockDrop(e) {
      e.stopPropagation();
      e.target.classList.remove("tableCanvasBoxHighlight");
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
              tmp.colParentId = tmp.rowParentId;
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
      e.stopPropagation();
      e.target.classList.remove("tableCanvasBoxHighlight");
    },
    drawGraphChannel(arr, channel, dom) {
      if(!(arr instanceof Array)) return;
      for(let i = 0; i < arr.length; i++) {
        let block = arr[i];
        // let newDom = document.createElement("div");
        let newDom = new Object();
        newDom.className = (arr[i].blockId == '-1') ? 'placeholderBlock' : 'block';
        newDom.style = {
          position: 'absolute',
          top: block.top,
          left: block.left,
          height: block.height,
          width: block.width,
        };
        // newDom.style.position = 'absolute';
        // newDom.style.top = block.top + 'px';
        // newDom.style.left = block.left + 'px';
        // newDom.style.height = block.height + 'px';
        // newDom.style.width = block.width + 'px';
        // newDom.style = `position: absolute; top: ${block.top}px; left: ${block.left}px; height: ${block.height}px; width: ${block.width}px`;
        // newDom.dataset.bid = block.blockId;
        // newDom.dataset.channel = channel;
        newDom.dataset = {
          bid: block.blockId,
          channel: channel,
        }
        if(block.rowParentId) newDom.dataset.rowParentId = block.rowParentId;
        if(block.colParentId) newDom.dataset.colParentId = block.colParentId;
        let valueList = block.values ? block.values : block.function ? [block.function] : this.getValueList(block.attrName);
        if(channel == 'canvas') {
          newDom.innerText = valueList.length > 1 ? `${valueList[0]} ... ${valueList[valueList.length-1]}` : valueList[0];
        } else if(channel == 'row') {
          newDom.innerText = valueList.length > 1 ? `${valueList[0]} \n ... \n${valueList[valueList.length-1]}` : valueList[0];
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
        // dom.appendChild(newDom);
        dom.push(newDom);
        if(block.children) {
          this.drawGraphChannel(block.children, channel, dom); 
        }
      }
    },
    drawGraph() {
      // let graphCanvasDom = document.getElementById("graphCanvas");
      // let tableCanvasDom = document.getElementById("tableCanvas");
      // this.drawGraphChannel(this.canvas, 'canvas', graphCanvasDom)
      // this.drawGraphChannel(this.rowTree, 'row', tableCanvasDom);
      // this.drawGraphChannel(this.columnTree, 'column', tableCanvasDom);
      // this.drawGraphChannel(this.cell, 'cell', tableCanvasDom);
      this.drawGraphChannel(this.canvas, 'canvas', this.canvasDom)
      this.drawGraphChannel(this.rowTree, 'row', this.rowDom);
      this.drawGraphChannel(this.columnTree, 'column', this.columnDom);
      this.drawGraphChannel(this.cell, 'cell', this.cellDom);
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
    addPoint(block, channel) {
      if(channel == "GC") { // graphcanvas
        this.canvas.push(block);
      } if(channel == "LB") {
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
      e.stopPropagation();
      if(pos == "LT" || pos == "RB") return;
      e.preventDefault();
      console.log("dragover, ", pos);
      this.dropoverBox = pos;
    },
    handleDrop(e, pos) {
      e.stopPropagation();
      e.preventDefault();
      console.log("drop, ", pos);
      this.dropoverBox = "";
      let channel = (pos == 'LB') ? 'row' : (pos == 'RT') ? 'column' : (pos == 'RB') ? 'cell' : 'canvas';

      if(this.draggedItemType == 'attr') {
        let newBlock = {
          attrName: this.draggedAttr.name,
          blockId: uuid(),
          left: e.offsetX,
          top: e.offsetY,
          width: Graph_Block_Size.width,
          height: Graph_Block_Size.height,
          channel,
        };
        this.addPoint(newBlock, pos);
      } else if (this.draggedItemType == 'function') {
        let newBlock = {
          function: 'sum',
          blockId: uuid(),
          channel,
        };
        this.addPoint(newBlock, pos);
      } else {
        // 首先将被拖动的块从树中删除
        let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
        console.log(tmp)
        tmp.children = undefined;
        tmp.left = e.offsetX;
        tmp.top = e.offsetY;
        tmp.width = Graph_Block_Size.width;
        tmp.height = Graph_Block_Size.height;
        this.addPoint(tmp, pos);
      }
      this.calcGraphConfig();
      this.clearGraph();
      this.drawGraph();
    },
    handleDragLeave(e) {
      e.stopPropagation();
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
      this.deleteBlock(this.cmBlockDom.dataset.bid, this.cmBlockDom.dataset.channel);
      this.calcGraphConfig();
      this.clearGraph();
      this.drawGraph();
    },
    cmEditValues(e) {
      this.cmVisible = false;
      console.log(this.cmBlockDom);
      let channel = this.cmBlockDom.dataset.channel;
      let source = (channel == 'row') ? this.rowTree : (channel == 'column') ? this.columnTree : (channel == 'cell') ? this.cell : this.canvas;
      let block = this.findBlock(source, this.cmBlockDom.dataset.bid);
      if(!block) return;
      block = block.arr[block.index];
      console.log(block);
      let valueList = block.values ? block.values : block.function ? [block.function] : this.getValueList(block.attrName);
      let blockType = block.values ? 'Values' : block.function ? 'Function' : 'Entity';
      this.cmBlock = block;
      this.cmBlockOriginalValueList = valueList;
      this.cmBlockValueLists = [valueList];
      this.cmBlockType = blockType;
      this.cmFunctionValue = block.function;
      this.modalopen = true;
    },
    handlecmBlockValueListCellChange(index, value) {
      console.log(value);
      this.cmBlockValueList[index] = Utils.transposeTable(value)[0];
    },
    cmSeparate() {
      
    },
    cmExpand() {
      
    },
    handlecmQsep(index, info) {
      let separated_indexes = new Set();
      for(let i = info.row + 1; i < this.cmBlockValueLists[index].length; i++) {
        separated_indexes.add(i);
      }
      this.handleSeparate(index, separated_indexes);
      this.setQuickSeparate();
    },
    handleSeparate(index, separated_indexes) {
      console.log(index, separated_indexes)
      let res1 = [], res2 = [];
      for(let i = 0; i < this.cmBlockValueLists[index].length; i++) {
        if(separated_indexes.has(i)) {
          res2.push(this.cmBlockValueLists[index][i]);
        } else {
          res1.push(this.cmBlockValueLists[index][i]);
        }
      }
      // this.cmBlockValueLists.splice(index, 1, res1, res2);
      // this.$forceUpdate()
      this.cmBlockValueLists = [res1, res2]
    },
    setQuickSeparate() {
      if(this.cmSeparateMode != 'separate') {
        this.cmSeparateMode = 'separate';
      } else {
        this.cmSeparateMode = 'quickSeparate';
      }
    }
  },
  mounted() {
    // 设置回调
    this.$bus.on('update', this.updateBlock);

    let tableCanvasDom = document.getElementById("tableCanvas");
    this.viewHeight = tableCanvasDom.scrollHeight;
    this.viewWidth = tableCanvasDom.scrollWidth;
    this.calcGraphConfig();
    this.drawGraph();
  },
  updated() {
    let tableCanvasDom = document.getElementById("tableCanvas");
    this.viewHeight = tableCanvasDom.scrollHeight;
    this.viewWidth = tableCanvasDom.scrollWidth;
  },
  components: {
    Puzzle,
    Spreadsheet
  }
}
</script>

<style>
.graphCanvas {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.tableCanvas {
  width: 50%;
  height: 50%;
  /* margin-top: 5px; */
  left: 25%;
  top: 25%;
  position: relative;
  overflow: scroll;
  z-index: 2000;
  /* border: 1px solid #526D82; */
}

.tableCanvasBox {
  position: absolute;
  background: white;
  /* border: 1px solid #dadada; */
  box-shadow: 0 0 0 1px #dadada;
}

.tableCanvasBoxHighlight {
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
  /* border: 1px solid black; */
  cursor: pointer;
  text-align: center;
  font-family: Inter-Light-7, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  z-index: 3000;
  box-shadow: 0 0 0 1px black;
  background-color: white;
  /* border-collapse: collapse; */
}

.placeholderBlock {
  /* border: 2px dashed #dadada; */
  cursor: pointer;
  text-align: center;
  z-index: 2500;
  box-shadow: 0 0 0 1px #dadada;
  background-color: white;
  /* border-collapse: collapse; */
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
  /* border: 2px solid black; */
  /* box-shadow: 0 0 0 1px black; */
  background-color: #dddddd !important;
}

.highlightedBlock .verticalSemiCircle {
  border-right: 1px solid #dddddd !important;
}

.highlightedBlock .horizontalSemiCircle {
  border-top: 1px solid #dddddd !important;
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

.cmBlockValueList {
  /* width: 150px; */
}

.iconFilter {
  /* position: absolute;
  right: 5px;
  padding: 7px 5px 1px 5px; */
  float: right;
}

.separateButtonMenu {
  margin-top: 25px;
}
.separateButton {
  margin-right: 5px;
  display: inline-block;
}

.qsep:hover {
  border-bottom: 2px solid red !important;
}
</style>

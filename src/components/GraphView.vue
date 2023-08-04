<template>
  <div id="graphCanvas" class="graphCanvas" @dragover="handleDragOver($event, 'GC')" @drop="handleDrop($event, 'GC')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'GC'}">
    <!-- <div v-for="(dom, index) in canvasDom" :key="'canvasDom' + String(index)" :class="dom.className" :style="dom.style" :data-bid="dom.dataset.bid"
    :data-channel="dom.dataset.channel" :data-row-parent-id="dom.dataset.rowParentId" :data-col-parent-id="dom.dataset.colParentId" :draggable="dom.draggable"
    @dragover="dom.ondragover" @dragstart="handleBlockDragstart" @dragleave="dom.ondragleave" :drop="dom.ondrop" @click="dom.onclick" @contextmenu="dom.oncontextmenu"
    >
      {{dom.innerText}}
    </div> -->
    <Puzzle :domSource="canvasDom" :isCanvas="true" :highlightedBlockId="selectedBlockId"> </Puzzle>
    <div id="tableCanvas" class="tableCanvas">
      <div id="graphViewLeftTopBox" class="tableCanvasBox" :style="'width:'+vlineLeft+'px;height:'+hlineTop+'px;top:0px;left:0px'" @dragover="handleDragOver($event, 'LT')" @drop="handleDrop($event, 'LT')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'LT'}" @dragleave="handleDragLeave"/>
      <div id="graphViewLeftBottomBox" class="tableCanvasBox" :style="'width:'+vlineLeft+'px;height:'+(viewHeight-hlineTop)+'px;top:'+hlineTop+'px;left:0px'" @dragover="handleDragOver($event, 'LB')" @drop="handleDrop($event, 'LB')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'LB'}" @dragleave="handleDragLeave"/>
      <div id="graphViewRightTopBox" class="tableCanvasBox" :style="'width:'+(viewWidth-vlineLeft)+'px;height:'+hlineTop+'px;top:0px;left:'+vlineLeft+'px'" @dragover="handleDragOver($event, 'RT')" @drop="handleDrop($event, 'RT')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'RT'}" @dragleave="handleDragLeave"/>
      <div id="graphViewRightBottomBox" class="tableCanvasBox" :style="'width:'+(viewWidth-vlineLeft)+'px;height:'+(viewHeight-hlineTop)+'px;top:'+hlineTop+'px;left:'+vlineLeft+'px'" @dragover="handleDragOver($event, 'RB')" @drop="handleDrop($event, 'RB')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'RB'}" @dragleave="handleDragLeave"/>
      <!-- <Puzzle :domSource="rowDom"> </Puzzle>
      <Puzzle :domSource="columnDom"> </Puzzle>
      <Puzzle :domSource="cellDom"> </Puzzle> -->
      <Puzzle :domSource="tableDom" @cell-unfold="handleUnfold($event)" :showCompleteTable="showCompleteTable" :highlightedBlockId="selectedBlockId"> </Puzzle>
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
      <div class="cmOption" @click="cmEditValues">Edit values</div>
      <div class="cmOption" @click="cmSeparate">Separate</div>
      <!-- Modal For EditValues -->
      <a-modal v-model:open="modalopen" title="Edit values" @ok="()=>{}" :zIndex="6000">
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
            <a-popover trigger="click" placement="rightTop">
              <template #content>
                <a-checkbox-group v-model:value="cmBlockFilteredList" :options="cmBlockValueLists[index]" style="width: 100px; height: 200px; overflow-y: scroll;"/>
                <div>
                  <a-button type="link" @click="(e) => {cmBlockFilteredList = cmBlockValueLists[index]}"> Check all </a-button>
                  <a-button type="link" @click="(e) => {cmBlockFilteredList = []}"> Reset </a-button>
                </div>
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
import { Graph_Padding, Graph_Block_Size, Graph_Block_Margin, Graph_Block_Ellipsis_Height, Graph_Block_Size_Placeholder, EXAMPLE_SPEC, EXAMPLE_OUTPUT, EXAMPLE_DATA} from "../CONSTANT.js";
import Puzzle from "./Puzzle.vue";
import {v4 as uuid} from 'uuid';
import Spreadsheet from "./Spreadsheet/Index.vue";
import Utils from "../utils.js";
import * as tableShop from "../process/tableshop.js";
export default {
  name: "GraphView",
  props: {
    showCompleteTable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return ({
      rowTree: [],
      columnTree: [],
      cell: [],
      fcell: [], //用于填充cell channel用的空格
      canvas: [],
      rowDom: [],
      columnDom: [],
      cellDom: [],
      canvasDom: [],
      tableDom: [],
      fullTable: [],
      foldedTable: [],
      tableDim: {rdim: 0, cdim: 0},
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
      cmBlockFilteredList: [],
      cmFunctionValue: "",
      cmSeparateMode: "separate",
      // cmSelectCellIndex: -1,
      modalopen: false,
    });
  },
  computed: {
    ...mapState(["data", "attrInfo", "draggedAttr", "draggedItemType", "draggedBlock", "selectedBlock"]),
    cmBlockValueLists_t() {
      let res = [];
      for(let i = 0; i < this.cmBlockValueLists.length; i++) {
        res.push(Utils.transposeTable([this.cmBlockValueLists[i]]))
      }
      console.log(res);
      return res;
    },
    selectedBlockId() {
      return this.selectedBlock ? this.selectedBlock.blockId : "-1";
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
    showCompleteTable(value, oldValue) {
      if(value != oldValue) {
        this.drawGraph();
      }
    }
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
    calcHVLine(table) { // 计算水平和垂直参考线的位置
      // let rDepth = this.calcDepth(this.rowTree), cDepth = this.calcDepth(this.columnTree);
      // console.log(rDepth, cDepth)
      // this.hlineTop = cDepth > 0 ? Graph_Padding.top + cDepth * Graph_Block_Size.height : 140;
      // this.vlineLeft = rDepth > 0 ? Graph_Padding.left + rDepth * Graph_Block_Size.width : 140;
      // return {rDepth, cDepth};
      // let {cdim, rdim} = this.getTabledim(EXAMPLE_SPEC, table);
      let {rdim, cdim} = this.tableDim;
      console.log(rdim, cdim);
      this.hlineTop = cdim > 0 ? Graph_Padding.top + cdim * Graph_Block_Size.height + 1 : 140;
      this.vlineLeft = rdim > 0 ? Graph_Padding.left + rdim * Graph_Block_Size.width + 1 : 140;
      return {rdim, cdim};
    },
    calcPosForCell() { // 计算cell每个块的configuration
      for(let i = 0; i < this.fcell.length; i++) {
        let rBlock, cBlock;
        if(this.fcell[i].rowParentId) {
          rBlock = this.findBlock(this.rowTree, this.fcell[i].rowParentId);
          rBlock = rBlock.arr[rBlock.index];
        }
        if(this.fcell[i].colParentId) {
          cBlock = this.findBlock(this.columnTree, this.fcell[i].colParentId);
          cBlock = cBlock.arr[cBlock.index];
        }
        this.fcell[i].left = cBlock ? cBlock.left : this.vlineLeft;
        this.fcell[i].top = rBlock ? rBlock.top : this.hlineTop;
        this.fcell[i].height = rBlock ? rBlock.height : Graph_Block_Size_Placeholder.height;
        this.fcell[i].width = cBlock ? cBlock.width : Graph_Block_Size_Placeholder.width;
      }
    },
    calcPos(table, rdim, cdim) {
      let spanList = [];
      const getNextIndex = (index) => {
        if(spanList.length == 0) return index;
        for(let i = 0; i < spanList.length; i++) {
          if(spanList[i].col <= index && spanList[i].col + spanList[i].colSpan > index) {
            index = spanList[i].col + spanList[i].colSpan;
          } else if(spanList[i].col > index) {
            return index; 
          }
        }
        return index;
      }
      const refreshSpanList = (rid) => {
        for(let i = 0; i < spanList.length; i++) {
          if(spanList[i].row + spanList[i].rowSpan <= rid) {
            spanList.splice(i, 1); i--;
          }
        }
      }
      const addToSpanList = (obj) => {
        if(spanList.length == 0) {
          spanList = [obj];
          return;
        }
        let l = 0, r = spanList.length;
        while(l < r) {
          let mid = Math.trunc((l+r)/2);
          if(spanList[mid].col < obj.col) {
            l = mid + 1;
          } else {
            r = mid;
          }
        }
        if(l >= spanList.length) spanList.push(obj);
        else spanList.splice(l, 0, obj);
      }
      for(let i = 0; i < table.length; i++) {
        let curColIndex = 0;
        refreshSpanList(i);
        for(let j = 0; j < table[i].length; j++) {
          curColIndex = getNextIndex(curColIndex);
          table[i][j].width = Graph_Block_Size.width * table[i][j].colSpan;
          table[i][j].height = Graph_Block_Size.height * table[i][j].rowSpan;
          table[i][j].left = Graph_Block_Size.width * curColIndex + (this.tableDim.rdim == 0 ? this.vlineLeft : Graph_Padding.left);
          table[i][j].top = Graph_Block_Size.height * i + (this.tableDim.cdim == 0 ? this.hlineTop : Graph_Padding.top);
          if(i >= cdim && curColIndex < rdim) {
            table[i][j].channel = 'row';
            table[i][j].width -= table[i][j].indent;
            table[i][j].left += table[i][j].indent;
          } else if(i < cdim && curColIndex >= rdim) {
            table[i][j].height -= table[i][j].indent;
            table[i][j].top += table[i][j].indent;
            table[i][j].channel = 'column';
          } else if(i >= cdim && curColIndex >= rdim) {
            table[i][j].channel = 'cell';
          }
          if(table[i][j].rowSpan > 1) {
            addToSpanList({
              row: i,
              col: curColIndex,
              rowSpan: table[i][j].rowSpan,
              colSpan: table[i][j].colSpan,
            })
          }
          curColIndex += table[i][j].colSpan;
        }
      }
    },
    calcGraphConfig(table) {
      let tableCanvasDom = document.getElementById("tableCanvas");
      let {rdim, cdim} = this.calcHVLine(table);
      this.calcPos(table, rdim, cdim);
      // this.calcPos(this.rowTree, 0, 0, "row", rDepth);
      // this.calcPos(this.columnTree, 0, 0, "column", cDepth);
      // this.fillCell();
      // this.calcPosForCell();

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
      this.tableDom = [];
    },
    deleteBlock(bid, channel) {
      console.log("deleteBlock: ", bid, channel)
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
    // highlightBlock(target) {
    //   let tableCanvasDom = document.getElementById("tableCanvas");
    //   for(let i = 0; i < tableCanvasDom.children.length; i++) {
    //     let c = tableCanvasDom.children[i];
    //     c.classList.remove('highlightedBlock');
    //     for(let j = 0; j < c.children.length; j++) {
    //       c.children[j].classList.remove('highlightedBlock');
    //     }
    //   }
    //   // let tmp = document.getElementsByClassName("highlightedBlock");
    //   // console.log(tmp)
    //   // for(let i = 0; i < tmp.length; i++) {
    //   //   tmp[i].classList.remove('highlightedBlock');
    //   // }
    //   target.classList.add('highlightedBlock');
    //   for(let i = 0; i < target.children.length; i++) {
    //     let c = target.children[i];
    //     if(c.dataset && (c.dataset.dir == 'left' || c.dataset.dir == 'bottom')) {
    //       c.classList.add('highlightedBlock');
    //     }
    //   }
    // },
    handleBlockDragstart(e) {
      console.log(e)
      this.$store.commit("storeDraggedItemType", 'block');
      this.$store.commit("storeDraggedBlock", e.target);
    },
    handleBlockDragover(e) {
      e.stopPropagation();
      // if(this.draggedItemType == 'block' && e.target.dataset.bid == this.draggedBlock.blockId) {
      //   return;
      // }
      if(e.target.dataset.bid == '@KEY') return;
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
              blockId: uuid(),
              channel
            } : {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
              children: [targetBlock.arr[targetBlock.index]],
              channel
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
            tmp.channel = channel;
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
            parentBlock.entityMerge = (dir == 'rightchild' || dir == 'bottomchild');
            if(!parentBlock.children) parentBlock.children = [];
            let newBlockId = uuid();
            parentBlock.children.push(this.draggedItemType == 'function' ? {
              function: 'sum',
              blockId: newBlockId,
              channel,
            } : {
              attrName: this.draggedAttr.name,
              blockId: newBlockId,
              entityMerge: false,
              channel,
            })
            // 更新cell的rpid, cpid
            for(let i = 0; i < this.cell.length; i++) {
              if(this.cell[i].rowParentId == parentBlock.blockId) {
                this.cell[i].rowParentId = newBlockId;
              }
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
            tmp.entityMerge = (dir == 'bottomchild');
            // tmp.children = targetBlock.arr[targetBlock.index].children;
            tmp.children = [];
            tmp.channel = channel;
            
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
              channel,
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
              channel,
            } : {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
              children: [targetBlock.arr[targetBlock.index]],
              channel,
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
            tmp.channel = channel;
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
            parentBlock.entityMerge = (dir == 'rightchild' || dir == 'bottomchild');
            if(!parentBlock.children) parentBlock.children = [];
            let newBlockId = uuid();
            parentBlock.children.push(this.draggedItemType == 'function' ? {
              function: 'sum',
              blockId: newBlockId,
              channel,
            } : {
              attrName: this.draggedAttr.name,
              blockId: newBlockId,
              entityMerge: false,
              channel,
            })
            // 更新cell的rpid, cpid
            for(let i = 0; i < this.cell.length; i++) {
              if(this.cell[i].colParentId == parentBlock.blockId) {
                this.cell[i].colParentId = newBlockId;
              }
            }
          } else {
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
            // 然后将被拖动的块加入新的子树
            let targetBlock = this.findBlock(this.columnTree, bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild' || dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
            // tmp.children = targetBlock.arr[targetBlock.index].children;
            tmp.children = [];
            tmp.channel = channel;

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
              channel,
            } : {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
              channel,
            })
          } else {
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
            // 然后将被拖动的块加入新的子树
            tmp.children = undefined;
            tmp.channel = channel;
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
      this.updateTable();
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
          entityMerge = cur;
        } else if(cur != entityMerge) {
          throw new Error("Illegal table!");
        }
        if(entityMerge != isInsertEntityMerge) return false;
      }
      return true;
    },
    handleBlockClick(e) {
      console.log(e)
      let source = (e.target.dataset.channel == 'row') ? this.rowTree : (e.target.dataset.channel == 'column') ? this.columnTree : this.cell;
      let block = this.findBlock(source, e.target.dataset.bid);
      console.log(block)
      if(!block) return;
      block = block.arr[block.index];
      this.$store.commit("storeSelectedBlock", block);
      // this.highlightBlock(e.target);
      let valueList1 = this.getValueList(block), valueList2;
      if(block.children instanceof Array && block.children.length > 0) {
        valueList2 = this.getValueList(block.children[0]);
      }
      this.$store.commit("storeConfigEg", {
        parent1: valueList1[0],
        son1: valueList2 ? valueList2[0] : undefined,
        son2: valueList2 ? valueList2[1] : undefined,
        parent2: valueList1[1],
        parent3: valueList1[2],
        channel: e.target.dataset.channel,
      })
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
      if(this.rowTree.length == 0 && this.columnTree.length == 0) {
        return;
      }
      e.preventDefault();
      e.target.classList.add('tableCanvasBoxHighlight');
    },
    handleCellBlockDrop(e) {
      e.stopPropagation();
      e.target.classList.remove("tableCanvasBoxHighlight");
      let rowParentId, colParentId;
      if(!e.target.dataset.bid) { // 拖入空白块
        let row = e.target.dataset.row, col = e.target.dataset.col;
        let table = this.showCompleteTable ? this.fullTable : this.foldedTable;
        let tabledim = this.tableDim;
        for(let j = 0; j < table[row].length; j++) {
          if(table[row][j].col < tabledim.rdim) {
            rowParentId = table[row][j].sourceBlockId;
          } else {
            break;
          }
        }
        for(let i = 0; i < tabledim.cdim; i++) {
          for(let j = 0; j < table[i].length; j++) {
            if(table[i][j].col == col) {
              colParentId = table[i][j].sourceBlockId;
            }
          }
        }
        console.log(rowParentId, colParentId)
      } else { // 拖入现有块
        rowParentId = e.target.dataset.rowParentId;
        colParentId = e.target.dataset.colParentId;
      }
      if(this.draggedItemType == 'attr') {
        this.cell.push({
          attrName: this.draggedAttr.name,
          blockId: uuid(),
          rowParentId: rowParentId,
          colParentId: colParentId,
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
        for(let i = 0; i < this.cell.length; i++) {
          if(this.cell[i].rowParentId == rowParentId && this.cell[i].colParentId == colParentId) {
            this.cell.splice(i, 1, tmp);
            break;
          }
        }
      }
      this.updateTable();
    },
    handleCellBlockDragleave(e) {
      e.stopPropagation();
      e.target.classList.remove("tableCanvasBoxHighlight");
    },
    drawGraphCanvas(arr, dom) {
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
          channel: 'canvas',
          rowSpan: 1,
          colSpan: 1,
        }
        if(block.rowParentId) newDom.dataset.rowParentId = block.rowParentId;
        if(block.colParentId) newDom.dataset.colParentId = block.colParentId;
        let valueList = block.values ? block.values : block.function ? [block.function] : this.searchValueList(block.attrName);
        newDom.innerText = valueList.length > 1 ? `${valueList[0]} ... ${valueList[valueList.length-1]}` : valueList[0];
        newDom.draggable = (arr[i].blockId != -1);
        newDom.ondragstart = this.handleBlockDragstart;
        newDom.ondragover = this.handleBlockDragover;
        newDom.ondrop = this.handleBlockDrop;
        newDom.ondragleave = this.handleBlockDragleave;
        newDom.oncontextmenu = this.openMenu;
        newDom.onclick = this.handleBlockClick;
        // dom.appendChild(newDom);
        dom.push(newDom);
      }
    },
    drawTable(table, dom) {
      for(let i = table.length - 1; i >= 0; i--) {
        for(let j = 0; j < table[i].length; j++) {
          let cell = table[i][j];
          let newDom = new Object();
          // newDom.className = (arr[i].blockId == '-1') ? 'placeholderBlock' : 'block';
          newDom.className = 'block';
          newDom.style = {
            position: 'absolute',
            top: cell.top,
            left: cell.left,
            height: cell.height,
            width: cell.width,
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
            bid: cell.sourceBlockId,
            channel: cell.channel,
            unfoldbutton: cell.unfoldbutton,
            rowSpan: cell.rowSpan,
            colSpan: cell.colSpan,
            row: cell.row,
            col: cell.col,
          }
          // if(block.rowParentId) newDom.dataset.rowParentId = block.rowParentId;
          // if(block.colParentId) newDom.dataset.colParentId = block.colParentId;

          // let valueList = block.values ? block.values : block.function ? [block.function] : this.searchValueList(block.attrName);
          // if(channel == 'canvas') {
          //   newDom.innerText = valueList.length > 1 ? `${valueList[0]} ... ${valueList[valueList.length-1]}` : valueList[0];
          // } else if(channel == 'row') {
          //   newDom.innerText = valueList.length > 1 ? `${valueList[0]} \n ... \n${valueList[valueList.length-1]}` : valueList[0];
          // } else if(channel == 'column') {
          //   newDom.innerText = valueList.length > 1 ? `${valueList[0]} ... ${valueList[valueList.length-1]}` : valueList[0];
          // } else {
          //   if(arr[i].blockId != '-1') {
          //     newDom.innerText = valueList.length > 1 ? `${valueList[0]} ... ${valueList[valueList.length-1]}` : valueList[0]; // to change
          //   }
          // }
          newDom.innerText = cell.value;
          newDom.draggable = (cell.sourceBlockId != -1 && cell.sourceBlockId != '@KEY');
          newDom.ondragstart = this.handleBlockDragstart;
          newDom.ondragover = (cell.channel == 'cell') ? this.handleCellBlockDragover : this.handleBlockDragover;
          newDom.ondrop = (cell.channel == 'cell') ? this.handleCellBlockDrop : this.handleBlockDrop;
          newDom.ondragleave = (cell.channel == 'cell') ? this.handleCellBlockDragleave : this.handleBlockDragleave;
          newDom.oncontextmenu = this.openMenu;
          newDom.onclick = this.handleBlockClick;
          // dom.appendChild(newDom);
          dom.push(newDom);
        }
      }
      dom.sort((a, b) => {
        let tmp = (b.dataset.row + b.dataset.rowSpan) - (a.dataset.row + a.dataset.rowSpan);
        if(tmp == 0) return a.dataset.col - b.dataset.col;
        else return tmp;
      })
    },
    drawGraph() {
      let table = this.showCompleteTable ? this.fullTable : this.foldedTable;
      this.calcGraphConfig(table);
      this.clearGraph();
      this.drawGraphCanvas(this.canvas, this.canvasDom);
      this.drawTable(table, this.tableDom);
      // this.drawGraphCanvas(this.fcell, this.tableDom);
    },
    fillCell() { // 为cell channel添加一些空白的blocks
      this.fcell = [];
      let rLeaves = this.getLeaves(this.rowTree), cLeaves = this.getLeaves(this.columnTree);
      let dict = new Set();
      for(let i = 0; i < this.cell.length; i++) {
        let key = (this.cell[i].rowParentId ? this.cell[i].rowParentId : "") + (this.cell[i].colParentId ? this.cell[i].colParentId : "");
        dict.add(key);
      }
      if(rLeaves.length == 0 && cLeaves.length != 0) { // 列表
        for(let i = 0; i < cLeaves.length; i++) {
          if(dict.has(cLeaves[i])) continue;
          this.fcell.push({
            blockId: -1, // -1 表示这实际上是个空白块
            colParentId: cLeaves[i]
          });
        }
      } else if(rLeaves.length != 0 && cLeaves.length == 0) { // 行表 
        for(let i = 0; i < rLeaves.length; i++) {
          if(dict.has(rLeaves[i])) continue;
          this.fcell.push({
            blockId: -1,
            rowParentId: rLeaves[i]
          });
        }
      } else if(rLeaves.length != 0 && cLeaves.length != 0) { // 交叉表
        for(let i = 0; i < rLeaves.length; i++) {
          for(let j = 0; j < cLeaves.length; j++) {
            let key = rLeaves[i] + cLeaves[j];
            if(dict.has(key)) continue;
            this.fcell.push({
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
    searchValueList(attrName) {
      if(!attrName) return [];
      for(let i = 0; i < this.attrInfo.length; i++) {
        if(this.attrInfo[i].name == attrName) {
          return this.attrInfo[i].values;
        }
      }
    },
    getValueList(block) {
      return block.values ? block.values : block.function ? [block.function] : this.searchValueList(block.attrName);
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
        tmp.channel = channel;
        this.addPoint(tmp, pos);
      }
      this.updateTable();
    },
    handleDragLeave(e) {
      e.stopPropagation();
      this.dropoverBox = "";
    },
    updateBlock(block) {
      if(block.channel) {
        let source = (block.channel == 'row') ? this.rowTree : (block.channel == 'column') ? this.columnTree : (block.channel == 'cell') ? this.cell : this.canvas;
        let targetBlock = this.findBlock(this.rowTree, block.blockId);
        if(targetBlock) targetBlock.arr[targetBlock.index] = block;
      } else {
        let source = ['rowTree', 'columnTree', 'cell', 'canvas'];
        source.forEach(item => {
          let targetBlock;
          targetBlock = this.findBlock(this[item], block.blockId);
          if(targetBlock) {
            targetBlock.arr[targetBlock.index] = block;
            return;
          }
        })
      }
      this.updateTable();
    },
    cmDelete(e) {
      this.cmVisible = false;
      this.deleteBlock(this.cmBlockDom.dataset.bid, this.cmBlockDom.dataset.channel);
      this.updateTable();
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
      let valueList = this.getValueList(block);
      // let blockType = block.values ? 'Values' : block.function ? 'Function' : 'Entity';
      let blockType = block.function ? 'Function' : block.attrName ? 'Entity' : 'Values';
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
    },
    getTabledim(spec, table) {
      console.log(spec, table);
      if(table[0] && !table[0][0].sourceBlockId) {
        return({
          cdim: table[0][0].rowSpan,
          rdim: table[0][0].colSpan,
        });
      }
      // let cellIdList = new Set();
      // if(spec.cell instanceof Array) {
      //   for(let i = 0; i < spec.cell.length; i++) {
      //     cellIdList.add(spec.cell[i].blockId)
      //   } 
      // }
      // for(let i = 0; i < table.length; i++) {
      //   let colSpan = 0;
      //   for(let j = 0; j < table[i].length; j++) {
      //     if(cellIdList.has(table[i][j].sourceBlockId)) {
      //       return {
      //         cdim: i,
      //         rdim: colSpan,
      //       }
      //     } else {
      //       colSpan += table[i][j].colSpan;
      //     }
      //   }
      // }
      const getDepth = (spec_channel) => {
        let res = 0;
        if(!(spec_channel instanceof Array)) return res;
        for(let i = 0; i < spec_channel.length; i++) {
          let tmp = getDepth(spec_channel[i].children) + 1;
          if(spec_channel[i].key && typeof(spec_channel[i].key.position) != 'undefined' && spec_channel[i].key.position != 'embedded') tmp++;
          if(tmp > res) res = tmp;
        } 
        return res;
      }
      // 没找到，行表或列表
      return {
        rdim: getDepth(spec.rowHeader),
        cdim: getDepth(spec.columnHeader),
      }
    },
    foldTable(data, spec, fullTable) {
      if(!fullTable || !(fullTable instanceof Array) || fullTable.length == 0) return fullTable;
      const clearProperties = (fullTable) => {
        for(let i = 0; i < fullTable.length; i++) {
          for(let j = 0; j < fullTable[i].length; j++) {
            fullTable[i][j].unfoldbutton = false;
            fullTable[i][j].indent = 0;
          }
        }
      }
      clearProperties(fullTable);
      let rSet = new Set(), cSet = new Set();
      let {rdim, cdim} = this.tableDim;
      let stack = [], index = -1; // 用栈维护当前遍历信息
      const max_visible_values = 2; // 折叠时，每个block最多3个值
      const isStackNotEmpty = () => {
        return index >= 0;
      }
      const stackInsert = (item) => {
        index++;
        if(index >= stack.length) stack.push(item);
        else stack[index] = item;
      }
      const stackPop = () => {
        index--;
      }
      const getStackHead = () => {
        return isStackNotEmpty() ? stack[index] : undefined;
      }
      const getIndexInStack = (id) => {
        for(let i = index; i >= 0; i--) {
          if(stack[i].blockId == id) return i;
        }
        return -1;
      }
      const addByRange = (_set, s, t) => {
        for(let i = s; i < t; i++) {
          _set.add(i);
        }
      }
      const queryByRange = (_set, s, t) => {
        let cnt = 0;
        for(let i = s; i < t; i++) {
          if(_set.has(i)) cnt++;
        }
        return cnt;
      }
      // 遍历rowheader
      for(let i = cdim; i < fullTable.length; i++) {
        // if(isStackNotEmpty() && stack[0].count > max_visible_values) break;
        for(let j = 0; j < fullTable[i].length; j++) {
          if(fullTable[i][j].col >= rdim) break;
          let curId = fullTable[i][j].sourceBlockId;
          if(!curId || curId == '@KEY') continue;
          let curBlock = this.findBlock(this.rowTree, curId);
          if(!curBlock) throw new Error("Unable to find block, id=" + String(curId));
          curBlock = curBlock.arr[curBlock.index];
          // let valueList = curBlock.values ? curBlock.values : curBlock.function ? [curBlock.function] : this.searchValueList(curBlock.attrName);
          let unfolded = curBlock.unfolded ? true : false;
          let head = getStackHead();
          if(head && head.blockId == curId) { // 同级
            if(!unfolded && head.count == max_visible_values) {
              fullTable[head.i][head.j].unfoldbutton = true;
            }
            fullTable[i][j].indent = head.indent;
            head.count++;
            // if(valueList.length > max_visible_values && ((!unfolded && head.count == max_visible_values) || (unfolded && head.count == valueList.length - 1))) {
            //   fullTable[i][j].unfoldbutton = true;
            // }
            head.i = i;
            head.j = j;
            head.unfolded = unfolded;
            if(!unfolded && (head.count > max_visible_values || head.inherited)) {
              addByRange(rSet, i, i + fullTable[i][j].rowSpan);
              head.inherited = true;
            }
          } else if(getIndexInStack(curId) == -1){ // 子级
            let indent = ((head && head.entityMerge) ? 10 : 0) + ((head && head.indent) ? head.indent : 0);
            let entityMerge = curBlock.entityMerge;
            console.log(indent, entityMerge)
            stackInsert({
              blockId: curId,
              count: 1,
              inherited: head ? (head.inherited) : false,
              i,
              j,
              unfolded,
              indent,
              entityMerge,
            });
            fullTable[i][j].indent = indent;
          } else { // 父级
            while(isStackNotEmpty()) {
              head = getStackHead();
              if(head && head.blockId != curId) {
                if(head.unfolded && head.count > max_visible_values) {
                  fullTable[head.i][head.j].unfoldbutton = true;
                }
                stackPop();
              } else {
                break;
              }
            }
            head = getStackHead();
            if(!unfolded && head.count == max_visible_values) {
              fullTable[head.i][head.j].unfoldbutton = true;
            }
            fullTable[i][j].indent = head.indent;
            head.count++;
            head.i = i;
            head.j = j;
            head.unfolded = unfolded;
            // if(valueList.length > max_visible_values && ((!unfolded && head.count == max_visible_values) || (unfolded && head.count == valueList.length - 1))) {
            //   fullTable[i][j].unfoldbutton = true;
            // }
            if(!unfolded && (head.count > max_visible_values || head.inherited)) {
              addByRange(rSet, i, i + fullTable[i][j].rowSpan);
              head.inherited = true;
            }
          }
        }
      }
      while(isStackNotEmpty()) {
        let head = getStackHead();
        if(head.unfolded && head.count > max_visible_values) {
          fullTable[head.i][head.j].unfoldbutton = true;
        }
        stackPop();
      }
      // 遍历colheader
      stack = [], index = -1;
      let searchList = [];
      for(let i = 0; i < cdim; i++) {
        for(let j = 0; j < fullTable[i].length; j++) {
          if(fullTable[i][j].sourceBlockId) searchList.push({
            i, j, ...fullTable[i][j]
          });
        }
      }
      searchList.sort((a, b) => {
        if(a.col == b.col) return a.row - b.row;
        return a.col - b.col;
      })
      console.log(searchList)
      for(let i = 0; i < searchList.length; i++) {
        // if(isStackNotEmpty() && stack[0].count > max_visible_values) break;
        let curId = searchList[i].sourceBlockId;
        if(!curId || curId == '@KEY') continue;
        let curBlock = this.findBlock(this.columnTree, curId);
        if(!curBlock) throw new Error("Unable to find block, id=" + String(curId));
        curBlock = curBlock.arr[curBlock.index];
        // let valueList = curBlock.values ? curBlock.values : curBlock.function ? [curBlock.function] : this.searchValueList(curBlock.attrName);
        let unfolded = curBlock.unfolded ? true : false;
        let head = getStackHead();
        if(head && head.blockId == curId) {
          if(!unfolded && head.count == max_visible_values) {
            fullTable[head.i][head.j].unfoldbutton = true;
          }
          head.count++;
          head.i = searchList[i].i;
          head.j = searchList[i].j;
          head.unfolded = unfolded;
          // if(valueList.length > max_visible_values && ((!unfolded && head.count == max_visible_values) || (unfolded && head.count == valueList.length))) {
          //   fullTable[searchList[i].i][searchList[i].j].unfoldbutton = true;
          // }
          if(!unfolded && (head.count > max_visible_values || head.inherited)) {
            addByRange(cSet, searchList[i].col, searchList[i].col + searchList[i].colSpan);
            head.inherited = true;
          }
        } else if(getIndexInStack(curId) == -1){
          stackInsert({
            blockId: curId,
            count: 1,
            inherited: head ? (head.inherited) : false,
            i: searchList[i].i,
            j: searchList[i].j,
            unfolded
          });
        } else {
          while(isStackNotEmpty()) {
            head = getStackHead();
            if(head && head.blockId != curId) {
              if(head.unfolded && head.count > max_visible_values) {
                fullTable[head.i][head.j].unfoldbutton = true;
              }
              stackPop();
            } else {
              break;
            }
          }
          head = getStackHead();
          if(!unfolded && head.count == max_visible_values) {
            fullTable[head.i][head.j].unfoldbutton = true;
          }
          head.count++;
          head.i = searchList[i].i;
          head.j = searchList[i].j;
          head.unfolded = unfolded;
          // if(valueList.length > max_visible_values && ((!unfolded && head.count == max_visible_values) || (unfolded && head.count == valueList.length))) {
          //   fullTable[searchList[i].i][searchList[i].j].unfoldbutton = true;
          // }
          if(!unfolded && (head.count > max_visible_values || head.inherited)) {
            addByRange(cSet, searchList[i].col, searchList[i].col + searchList[i].colSpan);
            head.inherited = true;
          }
        }
      }
      while(isStackNotEmpty()) {
        let head = getStackHead();
        if(head.unfolded && head.count > max_visible_values) {
          fullTable[head.i][head.j].unfoldbutton = true;
        }
        stackPop();
      }

      // 构建新表
      let newTable = [], newrow = -1;
      for(let i = 0; i < fullTable.length; i++) {
        if(rSet.has(i)) {
          continue;
        }
        newTable.push([]);
        newrow++;
        for(let j = 0; j < fullTable[i].length; j++) {
          if(cSet.has(fullTable[i][j].col)) {
            continue;
          }
          let newObj = Utils.deepClone(fullTable[i][j]);
          newObj.rowSpan -= queryByRange(rSet, i, i + fullTable[i][j].rowSpan);
          newObj.colSpan -= queryByRange(cSet, fullTable[i][j].col, fullTable[i][j].col + fullTable[i][j].colSpan);
          newObj.row = newrow;
          newObj.col = fullTable[i][j].col - queryByRange(cSet, 0, fullTable[i][j].col);
          newTable[newrow].push(newObj);
        }
      }
      return newTable;
    },
    addIndex(table) {
      let spanList = [];
      const getNextIndex = (index) => {
        if(spanList.length == 0) return index;
        for(let i = 0; i < spanList.length; i++) {
          if(spanList[i].col <= index && spanList[i].col + spanList[i].colSpan > index) {
            index = spanList[i].col + spanList[i].colSpan;
          } else if(spanList[i].col > index) {
            return index; 
          }
        }
        return index;
      }
      const refreshSpanList = (rid) => {
        for(let i = 0; i < spanList.length; i++) {
          if(spanList[i].row + spanList[i].rowSpan <= rid) {
            spanList.splice(i, 1); i--;
          }
        }
      }
      const addToSpanList = (obj) => {
        if(spanList.length == 0) {
          spanList = [obj];
          return;
        }
        let l = 0, r = spanList.length;
        while(l < r) {
          let mid = Math.trunc((l+r)/2);
          if(spanList[mid].col < obj.col) {
            l = mid + 1;
          } else {
            r = mid;
          }
        }
        if(l >= spanList.length) spanList.push(obj);
        else spanList.splice(l, 0, obj);
      }
      for(let i = 0; i < table.length; i++) {
        let curColIndex = 0;
        refreshSpanList(i);
        for(let j = 0; j < table[i].length; j++) {
          curColIndex = getNextIndex(curColIndex);
          table[i][j].row = i;
          table[i][j].col = curColIndex;
          addToSpanList({
            row: i,
            col: curColIndex,
            rowSpan: table[i][j].rowSpan,
            colSpan: table[i][j].colSpan,
          });
          curColIndex += table[i][j].colSpan;
        }
      }
    },
    handleUnfold(dataset) {
      console.log(dataset);
      let source = (dataset.channel == 'row') ? this.rowTree : (dataset.channel == 'column') ? this.columnTree : this.cell;
      let block = this.findBlock(source, dataset.bid);
      if(block.arr[block.index].unfolded == true) {
        block.arr[block.index].unfolded = false;
      } else {
        block.arr[block.index].unfolded = true;
      }
      let newSpec = {
        rowHeader: this.rowTree,
        columnHeader: this.columnTree,
        cell: this.cell,
        attrInfo: this.attrInfo,
      }
      this.foldedTable = this.foldTable(this.data, newSpec, this.fullTable);
      this.drawGraph();
    },
    updateTable() {
      let spec = {
        data: this.data,
        spec: {
          rowHeader: this.rowTree,
          columnHeader: this.columnTree,
          cell: this.cell,
          attrInfo: this.attrInfo,
        }
      };
      let spec2 = Utils.deepClone(spec.spec);
      console.log(spec2);
      this.fullTable = tableShop.default.utils.transform(spec);
      console.log("Full table: ", this.fullTable);
      this.tableDim = this.getTabledim(spec.spec, this.fullTable);
      this.addIndex(this.fullTable);
      console.log(this.fullTable)
      this.foldedTable = this.foldTable(this.data, spec.spec, this.fullTable);
      this.drawGraph();
    }
  },
  mounted() {
    // 设置回调
    this.$bus.on('update', this.updateBlock);

    let tableCanvasDom = document.getElementById("tableCanvas");
    this.viewHeight = tableCanvasDom.scrollHeight;
    this.viewWidth = tableCanvasDom.scrollWidth;
    // this.updateTable();
    // this.rowTree = EXAMPLE_SPEC.rowHeader;
    // this.columnTree = EXAMPLE_SPEC.columnHeader;
    // this.cell = EXAMPLE_SPEC.cell;
    // this.$store.commit("changeData", EXAMPLE_DATA[1]);
    // this.$store.commit("storeAttrInfo", EXAMPLE_SPEC.attrInfo);
    // this.fullTable = EXAMPLE_OUTPUT;
    // this.addIndex(this.fullTable);
    // this.foldedTable = this.foldTable(this.data, EXAMPLE_SPEC, this.fullTable);
    // this.drawGraph();

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
  width: 100%;
  height: 50%;
  /* margin-top: 5px; */
  /* left: 25%; */
  top: 25%;
  position: relative;
  overflow: scroll;
  z-index: 2000;
  /* border: 1px solid #526D82; */
}

.tableCanvasBox {
  position: absolute;
  background: white;
  border: 1px dashed #dadada;
  /* box-shadow: 0 0 0 1px #cccccc; */
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
  box-shadow: 0 0 0 1px #cccccc;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
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

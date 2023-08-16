<template>
  <div id="graphCanvas" class="graphCanvas" @dragover="handleDragOver($event, 'GC')" @drop="handleDrop($event, 'GC')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'GC'}">
    <!-- <div v-for="(dom, index) in canvasDom" :key="'canvasDom' + String(index)" :class="dom.className" :style="dom.style" :data-bid="dom.dataset.bid"
    :data-channel="dom.dataset.channel" :data-row-parent-id="dom.dataset.rowParentId" :data-col-parent-id="dom.dataset.colParentId" :draggable="dom.draggable"
    @dragover="dom.ondragover" @dragstart="handleBlockDragstart" @dragleave="dom.ondragleave" :drop="dom.ondrop" @click="dom.onclick" @contextmenu="dom.oncontextmenu"
    >
      {{dom.innerText}}
    </div> -->
    <Puzzle :domSource="tableDom" :isCanvas="false" :highlightedBlockId="selectedBlockId" @cell-unfold="handleUnfold($event)" @cell-rotate="handleRotate($event)" :showCompleteTable="showCompleteTable"> </Puzzle>
    <div id="tableCanvas" class="tableCanvas" v-show="false">
      <div id="graphViewLeftTopBox" class="tableCanvasBox" :style="'width:'+vlineLeft+'px;height:'+hlineTop+'px;top:0px;left:0px'" @dragover="handleDragOver($event, 'LT')" @drop="handleDrop($event, 'LT')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'LT'}" @dragleave="handleDragLeave"/>
      <div id="graphViewLeftBottomBox" class="tableCanvasBox" :style="'width:'+vlineLeft+'px;height:'+(viewHeight-hlineTop)+'px;top:'+hlineTop+'px;left:0px'" @dragover="handleDragOver($event, 'LB')" @drop="handleDrop($event, 'LB')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'LB'}" @dragleave="handleDragLeave"/>
      <div id="graphViewRightTopBox" class="tableCanvasBox" :style="'width:'+(viewWidth-vlineLeft)+'px;height:'+hlineTop+'px;top:0px;left:'+vlineLeft+'px'" @dragover="handleDragOver($event, 'RT')" @drop="handleDrop($event, 'RT')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'RT'}" @dragleave="handleDragLeave"/>
      <div id="graphViewRightBottomBox" class="tableCanvasBox" :style="'width:'+(viewWidth-vlineLeft)+'px;height:'+(viewHeight-hlineTop)+'px;top:'+hlineTop+'px;left:'+vlineLeft+'px'" @dragover="handleDragOver($event, 'RB')" @drop="handleDrop($event, 'RB')" :class="{'tableCanvasBoxHighlight': dropoverBox == 'RB'}" @dragleave="handleDragLeave"/>
      
      <!-- <Puzzle :domSource="tableDom" @cell-unfold="handleUnfold($event)" :showCompleteTable="showCompleteTable" :highlightedBlockId="selectedBlockId"> </Puzzle> -->
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
      // rowTree: [],
      // columnTree: [],
      // cell: [],
      // fcell: [], //用于填充cell channel用的空格
      canvas: [],
      // rowDom: [],
      // columnDom: [],
      // cellDom: [],
      // canvasDom: [],
      tableDom: [],
      fullTables: [],
      foldedTables: [],
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
          rBlock = this.findBlock(this.fcell[i].rowParentId);
          rBlock = rBlock.arr[rBlock.index];
        }
        if(this.fcell[i].colParentId) {
          cBlock = this.findBlock(this.fcell[i].colParentId);
          cBlock = cBlock.arr[cBlock.index];
        }
        this.fcell[i].left = cBlock ? cBlock.left : this.vlineLeft;
        this.fcell[i].top = rBlock ? rBlock.top : this.hlineTop;
        this.fcell[i].height = rBlock ? rBlock.height : Graph_Block_Size_Placeholder.height;
        this.fcell[i].width = cBlock ? cBlock.width : Graph_Block_Size_Placeholder.width;
      }
    },
    calcPos(table, dim, vlineLeft, hlineTop) {
      let spanList = [];
      let {rdim, cdim} = dim;
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
          table[i][j].left = Graph_Block_Size.width * curColIndex + vlineLeft;
          table[i][j].top = Graph_Block_Size.height * i + hlineTop;
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
    calcGraphConfig(spec) {
      // let tableCanvasDom = document.getElementById("tableCanvas");
      // let {rdim, cdim} = this.calcHVLine(table);
      console.log(spec)
      let {dim, table, left, top} = spec;
      this.calcPos(table, dim, left, top);
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
      // this.canvasDom = [];
      // this.rowDom = [];
      // this.columnDom = [];
      // this.cellDom = [];
      this.tableDom = [];
    },
    deleteBlock(bid) {
      console.log("deleteBlock: ", bid)
      let deletedBlock = this.findBlock(bid);
      console.log(deletedBlock);
      if(!deletedBlock) return;
      let tmp = deletedBlock.arr[deletedBlock.index];
      if(tmp.children instanceof Array && tmp.children.length > 0) {
        deletedBlock.arr.splice(deletedBlock.index, 1, ...(tmp.children))
      } else {
        deletedBlock.arr.splice(deletedBlock.index, 1);
      }
      for(let i = 0; i < this.canvas.length; i++) {
        if(this.canvas[i].cell) {
          for(let j = 0; j < this.canvas[i].cell.length; j++) {
            let cell = this.canvas[i].cell[j];
            if(cell.rowParentId == tmp.blockId) {
              cell.rowParentId = deletedBlock.parentBid;
            }
            if(cell.colwParentId == tmp.blockId) {
              cell.colParentId = deletedBlock.parentBid;
            }
          }
        }
      }
      tmp.rowParentId = deletedBlock.parentBid; // corner case
      return tmp;
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
      this.dropoverBox = "";
      if(this.draggedItemType == 'block' && e.target == this.draggedBlock) {
        return;
      }
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
        e.target.classList.remove("toprighthover");
        e.target.classList.remove("bottomlefthover");
        e.target.classList.remove("areahover");
      }
      if(x >= box.right - 60 && x < box.right - 20 && y < box.bottom - 20 && (e.target.dataset.channel == 'row' || e.target.dataset.channel == 'column')) {
        clearClass(e);
        e.target.classList.add("areahover");
      } else if (x < box.left + 20) {
        clearClass(e);
        if(e.target.dataset.channel == 'column' && y > box.bottom - 20) {
          e.target.classList.add('bottomlefthover');
        } else {
          e.target.classList.add('lefthover');
        }
      } else if (x > box.right - 20) {
        clearClass(e);
        if(e.target.dataset.channel == 'row' && y < box.top + 10) {
          e.target.classList.add('toprighthover');
        } 
        else if(e.target.dataset.channel == 'column' && y > box.top + 30) {
          e.target.classList.add('rightchildhover');
        } 
        else {
          e.target.classList.add('righthover');
        }
      } else if (y < box.top + box.height / 2) {
        clearClass(e);
        e.target.classList.add('tophover');
      } else {
        clearClass(e);
        if(e.target.dataset.channel == 'row' && x > box.left + 60) {
          e.target.classList.add("bottomchildhover");
        } else 
        {
          e.target.classList.add('bottomhover');
        }
      }
    },
    handleBlockDrop(e) {
      e.stopPropagation();
      this.dropoverBox = "";
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
      } else if(e.target.classList.contains('toprighthover')) {
        dir = 'topright';
      } else if(e.target.classList.contains('bottomlefthover')) {
        dir = 'bottomleft';
      } else if(e.target.classList.contains('areahover')) {
        dir = 'area';
      }
      e.target.classList.remove('lefthover');
      e.target.classList.remove('righthover');
      e.target.classList.remove('tophover');
      e.target.classList.remove('bottomhover');
      e.target.classList.remove("rightchildhover");
      e.target.classList.remove("bottomchildhover");
      e.target.classList.remove("toprighthover");
      e.target.classList.remove("bottomlefthover");
      e.target.classList.remove("areahover");
      if (dir != "") e.preventDefault(); else return;
      console.log(dir);
      console.log(e.target);
      let {bid, channel} = e.target.dataset;
      if(channel == 'row') {
        if(dir == 'left') {
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'bottomchild')) {
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
            let targetBlock = this.findBlock(bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
            tmp.children = [targetBlock.arr[targetBlock.index]];
            tmp.channel = channel;
            targetBlock.arr[targetBlock.index] = tmp;
          }
        } else if(dir == 'right' || dir == 'bottomchild') {
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(bid);
            if(!targetBlock) return;
            let parentBlock = targetBlock.arr[targetBlock.index];
            // 检查插入是否合法
            if(!this.checkInsertValid(parentBlock, dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
            parentBlock.entityMerge = (dir == 'bottomchild');
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
            let cell = this.canvas[targetBlock.tableId].cell;
            for(let i = 0; i < cell.length; i++) {
              if(cell[i].rowParentId == parentBlock.blockId) {
                cell[i].rowParentId = newBlockId;
              }
            }
          } else {
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
            // 然后将被拖动的块加入新的子树
            let targetBlock = this.findBlock(bid);
            if(!targetBlock) return;
            let parentBlock = targetBlock.arr[targetBlock.index];
            // 检查插入是否合法
            if(!this.checkInsertValid(parentBlock, dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
            tmp.entityMerge = (dir == 'bottomchild');
            // tmp.children = targetBlock.arr[targetBlock.index].children;
            tmp.children = [];
            tmp.channel = channel;
            
            let cell = this.canvas[targetBlock.tableId].cell;
            for(let i = 0; i < cell.length; i++) {
              if(cell[i].blockId != -1) {
                if(cell[i].rowParentId == targetBlock.arr[targetBlock.index].blockId) {
                  cell[i].rowParentId = tmp.blockId;
                }
                if(cell[i].colParentId == targetBlock.arr[targetBlock.index].blockId) {
                  cell[i].colParentId = tmp.blockId;
                }
              }
            }
            
            parentBlock.entityMerge = (dir == 'bottomchild');
            if(!parentBlock.children) parentBlock.children = [];
            parentBlock.children.splice(0, 0, tmp);
            // targetBlock.arr[targetBlock.index].children = [tmp];
          }
        } else if(dir == 'top' || dir == 'bottom') { // top || bottom
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'bottomchild')) {
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
            let targetBlock = this.findBlock(bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'bottomchild')) {
              throw new Error("Invalid insert");
              return;
            }
            targetBlock.arr.splice(targetBlock.index + (dir == 'bottom' ? 1 : 0), 0, tmp);
          }
        } else if(dir == 'area') { // right, + cell
          if(this.draggedItemType == 'function') {
            this.$message.error("Illegal drop!");
            return;
          }
          let targetBlock = this.findBlock(bid);
          if(!targetBlock) return;
          let sourceTables = this.showCompleteTable ? this.fullTables : this.foldedTables;
          let {table, dim} = sourceTables[targetBlock.tableId], block = targetBlock.arr[targetBlock.index];
          if(block.children instanceof Array && block.children.length > 0) {
            this.$message.error("Illegal drop!");
            return;
          }
          let rowParentId = block.blockId, colParentId = undefined;
          for(let i = 0; i < dim.cdim; i++) {
            for(let j = 0; j < table[i].length; j++) {
              if(table[i][j].col == dim.rdim) {
                colParentId = table[i][j].sourceBlockId;
              }
            }
          }

          let newBlock;
          if(this.draggedItemType == 'attr') {
            newBlock = {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
              channel: 'cell',
              rowParentId,
              colParentId,
            };
          } else { // block
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid);
            tmp.children = undefined;
            newBlock = tmp;
            newBlock.channel = 'cell';
            newBlock.rowParentId = rowParentId;
            newBlock.colParentId = colParentId;
          }
          let _found = false, cell = this.canvas[targetBlock.tableId].cell;
          for(let i = 0; i < cell.length; i++) {
            if(cell[i].rowParentId == rowParentId && cell[i].colParentId == colParentId) {
              cell[i] = newBlock;
              _found = true;
              break;
            }
          }
          if(!_found) {
            cell.push(newBlock);
          }
        } else if(dir == 'topright') {
          if(this.draggedItemType == 'function') {
            this.$message.error("Illegal drop!");
            return;
          }
          let targetBlock = this.findBlock(bid);
          if(!targetBlock) return;
          let block_r = this.canvas[targetBlock.tableId];
          if(!(block_r.columnHeader instanceof Array && block_r.columnHeader.length == 0)) {
            this.$message.error("Please rotate the dropped block(s) first.");
            return;
          }
          if(this.draggedItemType == 'attr') {
            block_r.columnHeader.push({
              attrName: this.draggedAttr.name,
              blockId: uuid(),
              children: [],
              channel: 'column',
            });
          } else {
            let sourceBlock = this.findBlock(this.draggedBlock.dataset.bid);
            if(!sourceBlock) return;
            let block_c = this.canvas[sourceBlock.tableId];
            
            if(!(block_c.rowHeader instanceof Array && block_c.rowHeader.length == 0)) {
              this.$message.error("Please rotate the dragged block(s) first.");
              return;
            }
            block_r.columnHeader = block_c.columnHeader;
            this.canvas.splice(sourceBlock.tableId, 1);
          }
        }
      } else if(channel == 'column') {
        if(dir == 'top') {
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild')) {
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
            let targetBlock = this.findBlock(bid);
            if(!targetBlock) return
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild')) {
              throw new Error("Invalid insert");
              return;
            };
            tmp.children = [targetBlock.arr[targetBlock.index]];
            tmp.channel = channel;
            targetBlock.arr[targetBlock.index] = tmp;
          }
        } else if(dir == 'bottom' || dir == 'rightchild') {
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(bid);
            if(!targetBlock) return;
            let parentBlock = targetBlock.arr[targetBlock.index];
            // 检查插入是否合法
            if(!this.checkInsertValid(parentBlock, dir == 'rightchild')) {
              throw new Error("Invalid insert");
              return;
            }
            parentBlock.entityMerge = (dir == 'rightchild');
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
            let cell = this.canvas[targetBlock.tableId].cell;
            for(let i = 0; i < cell.length; i++) {
              if(cell[i].colParentId == parentBlock.blockId) {
                cell[i].colParentId = newBlockId;
              }
            }
          } else {
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid, this.draggedBlock.dataset.channel);
            // 然后将被拖动的块加入新的子树
            let targetBlock = this.findBlock(bid);
            if(!targetBlock) return;
            let parentBlock = targetBlock.arr[targetBlock.index];
            // 检查插入是否合法
            if(!this.checkInsertValid(parentBlock, dir == 'rightchild')) {
              throw new Error("Invalid insert");
              return;
            }
            // tmp.children = targetBlock.arr[targetBlock.index].children;
            
            tmp.children = [];
            tmp.channel = channel;

            let cell = this.canvas[targetBlock.tableId].cell;
            for(let i = 0; i < cell.length; i++) {
              if(cell[i].blockId != -1) {
                if(cell[i].rowParentId == targetBlock.arr[targetBlock.index].blockId) {
                  cell[i].rowParentId = tmp.blockId;
                }
                if(cell[i].colParentId == targetBlock.arr[targetBlock.index].blockId) {
                  cell[i].colParentId = tmp.blockId;
                }
              }
            }
            parentBlock.entityMerge = (dir == 'rightchild');
            if(!parentBlock.children) parentBlock.children = [];
            parentBlock.children.splice(0, 0, tmp);
            // targetBlock.arr[targetBlock.index].children = [tmp];
          }
        } else if(dir == 'left' || dir == 'right') { // 'left' || 'right'
          if(this.draggedItemType == 'attr' || this.draggedItemType == 'function') {
            let targetBlock = this.findBlock(bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild')) {
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
            let targetBlock = this.findBlock(bid);
            if(!targetBlock) return;
            // 检查插入是否合法
            if(!this.checkInsertValid(targetBlock.arr[targetBlock.index], dir == 'rightchild')) {
              throw new Error("Invalid insert");
              return;
            }
            targetBlock.arr.splice(targetBlock.index + (dir == 'right' ? 1 : 0), 0, tmp);
          }
        } else if(dir == 'area') { // bottom, + cell
          if(this.draggedItemType == 'function') {
            this.$message.error("Illegal drop!");
            return;
          }
          let targetBlock = this.findBlock(bid);
          if(!targetBlock) return;
          let sourceTables = this.showCompleteTable ? this.fullTables : this.foldedTables;
          let {table, dim} = sourceTables[targetBlock.tableId], block = targetBlock.arr[targetBlock.index];
          if(block.children instanceof Array && block.children.length > 0) {
            this.$message.error("Illegal drop!");
            return;
          }
          let rowParentId = undefined, colParentId = block.blockId;
          if(dim.rdim > 0) {
            for(let j = 0; j < table[dim.cdim].length; j++) {
              if(table[dim.cdim][j].col < tabledim.rdim) {
                rowParentId = table[dim.cdim][j].sourceBlockId;
              } else {
                break;
              }
            }
          }
          
          let newBlock;
          if(this.draggedItemType == 'attr') {
            newBlock = {
              attrName: this.draggedAttr.name,
              blockId: uuid(),
              channel: 'cell',
              rowParentId,
              colParentId,
            };
          } else { // block
            // 首先将被拖动的块从树中删除
            let tmp = this.deleteBlock(this.draggedBlock.dataset.bid);
            tmp.children = undefined;
            newBlock = tmp;
            newBlock.channel = 'cell';
            newBlock.rowParentId = rowParentId;
            newBlock.colParentId = colParentId;
          }
          let _found = false, cell = this.canvas[targetBlock.tableId].cell;
          for(let i = 0; i < cell.length; i++) {
            if(cell[i].rowParentId == rowParentId && cell[i].colParentId == colParentId) {
              cell[i] = newBlock;
              _found = true;
              break;
            }
          }
          if(!_found) {
            cell.push(newBlock);
          }
        } else if(dir == 'bottomleft') {
          if(this.draggedItemType == 'function') {
            this.$message.error("Illegal drop!");
            return;
          }
          let targetBlock = this.findBlock(bid);
          if(!targetBlock) return;
          let block_c = this.canvas[targetBlock.tableId];
          if(!(block_c.rowHeader instanceof Array && block_c.rowHeader.length == 0)) {
            this.$message.error("Please rotate the dropped block(s) first.");
            return;
          }
          if(this.draggedItemType == 'attr') {
            block_c.rowHeader.push({
              attrName: this.draggedAttr.name,
              blockId: uuid(),
              children: [],
              channel: 'row',
            })
          } else {
            let sourceBlock = this.findBlock(this.draggedBlock.dataset.bid);
            if(!sourceBlock) return;
            let block_r = this.canvas[sourceBlock.tableId];
            if(!(block_r.columnHeader instanceof Array && block_r.columnHeader.length == 0)) {
              this.$message.error("Please rotate the dragged block(s) first.");
              return;
            }
            block_c.rowHeader = block_r.rowHeader;
            this.canvas.splice(sourceBlock.tableId, 1);
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
      e.target.classList.remove("toprighthover");
      e.target.classList.remove('bottomlefthover');
      e.target.classList.remove('areahover');
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
      let block = this.findBlock(e.target.dataset.bid);
      console.log(block)
      if(!block) return;
      this.$store.commit("storeSelectedTable", this.canvas[block.tableId].styles);
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
    _findBlock(arr, bid, parentBid, tableId) { // 在arr中寻找blockId=bid的块; parentBid是父亲的blockId; 返回父亲块的blockId, children 及目标块在 children 中的Index, 该block在canvas中的index
      if(!(arr instanceof Array) || arr.length == 0) return;
      for(let i = 0; i < arr.length; i++) {
        if(arr[i].blockId == bid) return {arr, index: i, parentBid, tableId};
        if(arr[i].children) {
          let d = this._findBlock(arr[i].children, bid, arr[i].blockId, tableId);
          if(d) return d;
        }
      }
    },
    findBlock(bid) {
      let source = ['rowHeader', 'columnHeader', 'cell'];
      for(let i = 0; i < this.canvas.length; i++) {
        for(let j = 0; j < source.length; j++) {
          let channel = source[j];
          let tmp = this._findBlock(this.canvas[i][channel], bid, undefined, i);
          if(tmp) return tmp;
        }
      }
    },
    handleCellBlockDragover(e) {
      e.stopPropagation();
      this.dropoverBox = "";
      if(this.draggedItemType == 'block' && e.target == this.draggedBlock) {
        return;
      }
      e.preventDefault();
      let x = e.clientX, y = e.clientY;
      let box = e.target.getBoundingClientRect();
      // e.target.classList.add('tableCanvasBoxHighlight');
      let clearClass = (e) => {
        e.target.classList.remove('lefthover');
        e.target.classList.remove('righthover');
        e.target.classList.remove('tophover');
        e.target.classList.remove('bottomhover');
        e.target.classList.remove("rightchildhover");
        e.target.classList.remove("bottomchildhover");
        e.target.classList.remove("toprighthover");
        e.target.classList.remove("bottomlefthover");
        e.target.classList.remove("tableCanvasBoxHighlight");
      }
      if(!e.target.dataset.bid) {
        clearClass(e);
        e.target.classList.add('tableCanvasBoxHighlight');
        return;
      } else {
        let block = this.findBlock(e.target.dataset.bid);
        if(!block) return; 
        let tableId = block.tableId;
        let isRowEmpty = !(this.canvas[tableId].rowHeader instanceof Array && this.canvas[tableId].rowHeader.length > 0);
        let isColEmpty = !(this.canvas[tableId].columnHeader instanceof Array && this.canvas[tableId].columnHeader.length > 0);
        clearClass(e);
        // console.log(isRowEmpty, isColEmpty)
        if(isColEmpty && y < box.top + 20) {
          e.target.classList.add('tophover');
        } else if(isRowEmpty && x < box.left + 20) {
          e.target.classList.add('lefthover');
        } else {
          e.target.classList.add('tableCanvasBoxHighlight');
        }
      }
    },
    handleCellBlockDrop(e) {
      e.stopPropagation();
      this.dropoverBox = "";
      if(e.target.classList.contains("tableCanvasBoxHighlight")) {
        e.target.classList.remove("tableCanvasBoxHighlight");
        let rowParentId, colParentId;
        if(!e.target.dataset.bid) { // 拖入空白块
          let row = e.target.dataset.row, col = e.target.dataset.col;
          let sourceTables = this.showCompleteTable ? this.fullTables : this.foldedTables;
          let {table, dim} = sourceTables[e.target.dataset.tableId];
          for(let j = 0; j < table[row].length; j++) {
            if(table[row][j].col < dim.rdim) {
              rowParentId = table[row][j].sourceBlockId;
            } else {
              break;
            }
          }
          for(let i = 0; i < dim.cdim; i++) {
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
          if(e.target.dataset.bid) { // 替换现有块
            let cell = this.canvas[e.target.dataset.tableId];
            for(let i = 0; i < cell.length; i++) {
              if(cell[i].rowParentId == rowParentId && cell[i].colParentId == colParentId) {
                cell[i] = {
                  attrName: this.draggedAttr.name,
                  blockId: uuid(),
                  rowParentId: rowParentId,
                  colParentId: colParentId,
                  channel: 'cell',
                }
              }
            }
          } else {
            this.canvas[e.target.dataset.tableId].cell.push({
              attrName: this.draggedAttr.name,
              blockId: uuid(),
              rowParentId: rowParentId,
              colParentId: colParentId,
              channel: 'cell',
            })
          }
        } else if(this.draggedItemType == 'block') {
          // 首先将被拖动的块从树中删除
          let tmp = this.deleteBlock(this.draggedBlock.dataset.bid);
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
          tmp.channel = 'cell';
          let cell = this.canvas[e.target.dataset.tableId].cell;
          if(e.target.dataset.bid) { // 替换现有块
            for(let i = 0; i < cell.length; i++) {
              if(cell[i].rowParentId == rowParentId && cell[i].colParentId == colParentId) {
                cell[i] = tmp;
              }
            }
          } else {
            cell.push(tmp);
          }
        }
      } else if(e.target.classList.contains("tophover")) {
        e.target.classList.remove("tophover");
        let block = this.findBlock(e.target.dataset.bid);
        if(!block) return;
        let tableId = block.tableId;
        let columnHeader = this.canvas[tableId].columnHeader;
        if(this.draggedItemType == 'function') {
          this.$message.error("Illegal dragging!");
          return;
        } else if(this.draggedItemType == 'attr') {
          let bid = uuid();
          columnHeader.push({
            attrName: this.draggedAttr.name,
            blockId: bid,
            children: [],
            channel: 'column',
          })
          block.arr[block.index].colParentId = bid;
        } else {
          let sourceBlock = this.deleteBlock(this.draggedBlock.dataset.bid);
          if(!sourceBlock) return;
          sourceBlock.children = [];
          sourceBlock.channel = 'column';
          columnHeader.push(sourceBlock);
          block.arr[block.index].colParentId = sourceBlock.blockId;
        }
      } else {
        e.target.classList.remove("lefthover");
        let block = this.findBlock(e.target.dataset.bid);
        if(!block) return;
        let tableId = block.tableId;
        let rowHeader = this.canvas[tableId].rowHeader;
        if(this.draggedItemType == 'function') {
          this.$message.error("Illegal dragging!");
          return;
        } else if(this.draggedItemType == 'attr') {
          let bid = uuid();
          rowHeader.push({
            attrName: this.draggedAttr.name,
            blockId: bid,
            children: [],
            channel: 'row',
          })
          block.arr[block.index].colParentId = bid;
        } else {
          let sourceBlock = this.deleteBlock(this.draggedBlock.dataset.bid);
          if(!sourceBlock) return;
          sourceBlock.children = [];
          sourceBlock.channel = 'row';
          rowHeader.push(sourceBlock);
          block.arr[block.index].rowParentId = sourceBlock.blockId;
        }
      }
      
      this.updateTable();
    },
    handleCellBlockDragleave(e) {
      e.stopPropagation();
      e.target.classList.remove("tableCanvasBoxHighlight");
      e.target.classList.remove("tophover");
      e.target.classList.remove("lefthover");
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
    drawTable(table, tableId, dom) {
      for(let i = table.length - 1; i >= 0; i--) {
        for(let j = 0; j < table[i].length; j++) {
          let cell = table[i][j];
          let newDom = new Object();
          // newDom.className = (arr[i].blockId == '-1') ? 'placeholderBlock' : 'block';
          newDom.className = 'block';
          newDom.id = uuid();
          newDom.style = {
            position: 'absolute',
            top: cell.top,
            left: cell.left,
            height: cell.height,
            width: cell.width,
            computed: "",
          };
          let properties = ["background-color", "border", "border-top", "border-bottom", "border-left", "border-right", "font", "font-size", "font-family", "font-weight", "color"];
          properties.forEach(prop => {
            if(cell.style && typeof(cell.style[prop]) != 'undefined') {
              newDom.style.computed += `${prop}: ${cell.style[prop]}; `;
            }
          })
            
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
            rotatebutton: cell.rotatebutton,
            rowSpan: cell.rowSpan,
            colSpan: cell.colSpan,
            row: cell.row,
            col: cell.col,
            tableId,
          }
          if(cell.channel == 'cell' && cell.sourceBlockId) {
            let block = this.findBlock(cell.sourceBlockId);
            if(!block) return;
            block = block.arr[block.index];
            if(block.rowParentId) newDom.dataset.rowParentId = block.rowParentId;
            if(block.colParentId) newDom.dataset.colParentId = block.colParentId;
          }
          

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
      let tables = this.showCompleteTable ? this.fullTables : this.foldedTables;
      this.clearGraph();
      // this.drawGraphCanvas(this.canvas, this.canvasDom);
      for(let i = 0; i < tables.length; i++) {
        this.calcGraphConfig(tables[i]);
        this.drawTable(tables[i].table, i, this.tableDom);
      }
      // this.drawGraphCanvas(this.fcell, this.tableDom);
    },
    // fillCell() { // 为cell channel添加一些空白的blocks
    //   this.fcell = [];
    //   let rLeaves = this.getLeaves(this.rowTree), cLeaves = this.getLeaves(this.columnTree);
    //   let dict = new Set();
    //   for(let i = 0; i < this.cell.length; i++) {
    //     let key = (this.cell[i].rowParentId ? this.cell[i].rowParentId : "") + (this.cell[i].colParentId ? this.cell[i].colParentId : "");
    //     dict.add(key);
    //   }
    //   if(rLeaves.length == 0 && cLeaves.length != 0) { // 列表
    //     for(let i = 0; i < cLeaves.length; i++) {
    //       if(dict.has(cLeaves[i])) continue;
    //       this.fcell.push({
    //         blockId: -1, // -1 表示这实际上是个空白块
    //         colParentId: cLeaves[i]
    //       });
    //     }
    //   } else if(rLeaves.length != 0 && cLeaves.length == 0) { // 行表 
    //     for(let i = 0; i < rLeaves.length; i++) {
    //       if(dict.has(rLeaves[i])) continue;
    //       this.fcell.push({
    //         blockId: -1,
    //         rowParentId: rLeaves[i]
    //       });
    //     }
    //   } else if(rLeaves.length != 0 && cLeaves.length != 0) { // 交叉表
    //     for(let i = 0; i < rLeaves.length; i++) {
    //       for(let j = 0; j < cLeaves.length; j++) {
    //         let key = rLeaves[i] + cLeaves[j];
    //         if(dict.has(key)) continue;
    //         this.fcell.push({
    //           blockId: -1,
    //           rowParentId: rLeaves[i],
    //           colParentId: cLeaves[j],
    //         })
    //       }
    //     }
    //   }
    // },
    // getLeaves(tree) { // 获取row/column header的叶子节点
    //   if(!(tree instanceof Array) || tree.length == 0) return [];
    //   let res = [];
    //   for(let i = 0; i < tree.length; i++) {
    //     if(tree[i].children instanceof Array && tree[i].children.length > 0) {
    //       let d = this.getLeaves(tree[i].children);
    //       res = [...res, ...d];
    //     } else {
    //       res = [...res, tree[i].blockId];
    //     }
    //   }
    //   return res;
    // },
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
    // addPoint(block, channel) {
    //   if(channel == "GC") { // graphcanvas
    //     this.canvas.push(block);
    //   } if(channel == "LB") {
    //     this.rowTree.push(block);
    //   } else if(channel == "RT") {
    //     this.columnTree.push(block);
    //   }
    //   for(let i = 0; i < this.cell.length; i++) {
    //     if(channel == "LB" && !this.cell[i].rowParentId) {
    //       this.cell[i].rowParentId = block.blockId;
    //     }
    //     if(channel == "RT" && !this.cell[i].colParentId) {
    //       this.cell[i].colParentId = block.blockId;
    //     }
    //   }
    // },
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
      // console.log("drop, ", pos);
      this.dropoverBox = "";
      // let channel = (pos == 'LB') ? 'row' : (pos == 'RT') ? 'column' : (pos == 'RB') ? 'cell' : 'canvas';
      let channel = 'row';

      if(this.draggedItemType == 'attr') {
        let newBlock = {
          attrName: this.draggedAttr.name,
          blockId: uuid(),
          channel,
        };
        let table = {
          type: 'block',
          rowHeader: [newBlock],
          columnHeader: [],
          cell: [],
          attrInfo: this.attrInfo,
          left: e.offsetX,
          top: e.offsetY,
        };
        // this.addPoint(newBlock, pos);
        this.canvas.push(table);
      } else if (this.draggedItemType == 'function') {
        let newBlock = {
          function: 'sum',
          blockId: uuid(),
          channel,
        };
        let table = {
          type: 'block',
          rowHeader: [newBlock],
          columnHeader: [],
          cell: [],
          attrInfo: this.attrInfo,
          left: e.offsetX,
          top: e.offsetY,
        };
        // this.addPoint(newBlock, pos);
        this.canvas.push(table);
      } else {
        // 首先将被拖动的块从树中删除
        let tmp = this.deleteBlock(this.draggedBlock.dataset.bid);
        console.log(tmp)
        tmp.children = undefined;
        if(tmp.channel == 'cell') tmp.channel = 'row';
        let table = {
          type: 'block',
          rowHeader: tmp.channel == 'row' ? [tmp] : [],
          columnHeader: tmp.channel == 'column' ? [tmp] : [],
          cell: [],
          attrInfo: this.attrInfo,
          left: e.offsetX,
          top: e.offsetY,
        };
        // this.addPoint(newBlock, pos);
        this.canvas.push(table);
      }
      this.updateTable();
    },
    handleDragLeave(e) {
      e.stopPropagation();
      this.dropoverBox = "";
    },
    updateBlock(block) {
      if(block.channel) {
        let targetBlock = this.findBlock(block.blockId);
        if(targetBlock) targetBlock.arr[targetBlock.index] = block;
      } else {
        let source = ['rowTree', 'columnTree', 'cell', 'canvas'];
        source.forEach(item => {
          let targetBlock;
          targetBlock = this.findBlock(block.blockId);
          if(targetBlock) {
            targetBlock.arr[targetBlock.index] = block;
            return;
          }
        })
      }
      this.updateTable();
    },
    updateGlobal(styles) {
      console.log(JSON.parse(JSON.stringify(styles)))
      let block = this.selectedBlock;
      let source = this.findBlock(block.blockId);
      if(!source) return;
      let table = this.canvas[source.tableId];
      table.styles = styles;
      this.updateTable();
    },
    cmDelete(e) {
      this.cmVisible = false;
      this.deleteBlock(this.cmBlockDom.dataset.bid);
      this.updateTable();
    },
    cmEditValues(e) {
      this.cmVisible = false;
      console.log(this.cmBlockDom);
      let channel = this.cmBlockDom.dataset.channel;
      let block = this.findBlock(this.cmBlockDom.dataset.bid);
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
      const getDepth = (spec_channel) => {
        let res = 0;
        if(!(spec_channel instanceof Array)) return res;
        for(let i = 0; i < spec_channel.length; i++) {
          let tmp = getDepth(spec_channel[i].children) + ((spec_channel[i].entityMerge == true && spec_channel[i].children instanceof Array && spec_channel[i].children.length > 0) ? 0 : 1);
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
    foldTable(dim, fullTable) {
      if(!fullTable || !(fullTable instanceof Array) || fullTable.length == 0) return fullTable;
      const clearProperties = (fullTable) => {
        for(let i = 0; i < fullTable.length; i++) {
          for(let j = 0; j < fullTable[i].length; j++) {
            fullTable[i][j].unfoldbutton = false;
            // fullTable[i][j].rotatebutton = false;
            fullTable[i][j].indent = 0;
          }
        }
      }
      clearProperties(fullTable);
      let rSet = new Set(), cSet = new Set();
      let {rdim, cdim} = dim;
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
          let curBlock = this.findBlock(curId);
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
            if(!unfolded && (head.count > max_visible_values || head.isInherited)) {
              addByRange(rSet, i, i + fullTable[i][j].rowSpan);
              head.isInherited = true;
            }
          } else if(getIndexInStack(curId) == -1){ // 子级
            let indent = ((head && head.entityMerge) ? 10 : 0) + ((head && head.indent) ? head.indent : 0);
            let entityMerge = curBlock.entityMerge;
            console.log(indent, entityMerge)
            stackInsert({
              blockId: curId,
              count: 1,
              isInherited: head ? (head.isInherited) : false,
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
            if(!unfolded && (head.count > max_visible_values || head.isInherited)) {
              addByRange(rSet, i, i + fullTable[i][j].rowSpan);
              head.isInherited = true;
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
        let curBlock = this.findBlock(curId);
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
          if(!unfolded && (head.count > max_visible_values || head.isInherited)) {
            addByRange(cSet, searchList[i].col, searchList[i].col + searchList[i].colSpan);
            head.isInherited = true;
          }
        } else if(getIndexInStack(curId) == -1){
          stackInsert({
            blockId: curId,
            count: 1,
            isInherited: head ? (head.isInherited) : false,
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
          if(!unfolded && (head.count > max_visible_values || head.isInherited)) {
            addByRange(cSet, searchList[i].col, searchList[i].col + searchList[i].colSpan);
            head.isInherited = true;
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
      if(newTable instanceof Array && newTable.length > 0 && newTable[0].length > 0) {
        newTable[0][newTable[0].length - 1].rotatebutton = true; 
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
      let block = this.findBlock(dataset.bid);
      if(block.arr[block.index].unfolded == true) {
        block.arr[block.index].unfolded = false;
      } else {
        block.arr[block.index].unfolded = true;
      }
      let id = block.tableId;
      let newTable = this.foldTable(this.fullTables[id].dim, this.fullTables[id].table);
      this.foldedTables[id].table = newTable;
      this.drawGraph();
    },
    updateTable() {
      this.fullTables = [];
      this.foldedTables = [];
      for(let i = 0; i < this.canvas.length; i++) {
        let spec = this.canvas[i];
        if(spec.rowHeader.length == 0 && spec.columnHeader.length == 0) {
          this.canvas.splice(i, 1);
          i--;
          continue;
        }
        let tableSpec = {
          data: this.data,
          spec
        };
        let spec2 = Utils.deepClone(spec);
        console.log("Processing spec: ", JSON.parse(JSON.stringify(spec2)));
        let res = tableShop.default.utils.transform(tableSpec);
        console.log("Get full table: ", res);
        this.addIndex(res);
        let dim = this.getTabledim(spec, res);
        this.fullTables.push({
          dim,
          table: res,
          left: spec.left,
          top: spec.top,
        });
        let folded_res = this.foldTable(dim, res);
        this.foldedTables.push({
          dim, 
          table: folded_res,
          left: spec.left,
          top: spec.top,
        });
      }
      this.drawGraph();
    },
    rotateTable(table) {
      const changeChannel = (arr) => {
        for(let i = 0; i < arr.length; i++) {
          if(arr[i].channel == 'row') arr[i].channel = 'column';
          else if(arr[i].channel == 'column') arr[i].channel = 'row';
          if(arr[i].children && arr[i].children instanceof Array) changeChannel(arr[i].children);
        }
      }
      changeChannel(table.rowHeader);
      changeChannel(table.columnHeader);
      let tmp = Utils.deepClone(table.columnHeader);
      table.columnHeader = table.rowHeader;
      table.rowHeader = tmp;
    },
    handleRotate(dataset) {
      // if(!this.selectedBlock) {
      //   this.$message.warning("Please select a puzzle first.");
      //   return;
      // }
      // console.log(this.selectedBlock);
      // let block = this.findBlock(dataset.bid);
      // console.log(block);
      // let tableId = block.tableId;
      let tableId = dataset.tableId;
      this.rotateTable(this.canvas[tableId]);
      this.updateTable();
    }
  },
  mounted() {
    // 设置回调
    this.$bus.on('update', this.updateBlock);
    this.$bus.on('rotate', this.handleRotate);
    this.$bus.on('updateglobal', this.updateGlobal);

    // let tableCanvasDom = document.getElementById("tableCanvas");
    // this.viewHeight = tableCanvasDom.scrollHeight;
    // this.viewWidth = tableCanvasDom.scrollWidth;

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
    // let tableCanvasDom = document.getElementById("tableCanvas");
    // this.viewHeight = tableCanvasDom.scrollHeight;
    // this.viewWidth = tableCanvasDom.scrollWidth;
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
  overflow: scroll;
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
  /* font-family: Inter-Regular-9, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; */
  font-family: Inter-Regular-9;
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
  border-left: 3px solid red;
}

.righthover {
  border-right: 3px solid red;
}

.tophover {
  border-top: 3px solid red;
}

.bottomhover{
  border-bottom: 3px solid red;
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

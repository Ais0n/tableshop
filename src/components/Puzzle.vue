<template>
  <div v-for="(dom, index) in domSource" :id="dom.id" :class="dom.className + (dom.dataset.bid == highlightedBlockId ? ' highlightedBlock' : '')" :style="`position: ${dom.style.position}; left: ${dom.style.left}px; top: ${dom.style.top}px; width: ${dom.style.width}px; height: ${dom.style.height}px; ${dom.style.computed}`" :data-bid="dom.dataset.bid"
    :data-channel="dom.dataset.channel" :data-row-parent-id="dom.dataset.rowParentId" :data-col-parent-id="dom.dataset.colParentId" :data-row="dom.dataset.row" :data-col="dom.dataset.col" :data-table-id="dom.dataset.tableId" :draggable="dom.draggable"
    @dragover="(e) => {entered = index; dom.ondragover(e)}" @dragstart="dom.ondragstart" @dragleave="(e) => { entered = -1; dom.ondragleave(e)}" @drop="(e) => {entered = -1; dom.ondrop(e)}" @click="dom.onclick" @contextmenu="dom.oncontextmenu"
  >
    <div class="puzzleText">{{dom.innerText}}</div>
    <div class="childborder" :style="`height: ${dom.style.height - 30}px; width: ${dom.style.width - 30}px;`"></div>
    <div class="trborder1"></div>
    <div class="trborder2"></div>
    <div class="blborder1"></div>
    <div class="blborder2"></div>
    <a-button v-if="!showCompleteTable && !isCanvas && dom.dataset.unfoldbutton" type="text" size="small" class="unfoldButton" :class="dom.dataset.channel == 'row' ? 'rowUnfoldButton' : 'colUnfoldButton'" @click="handleUnfold(dom)"> 
      <template #icon> 
        <i class="iconfont"> {{dom.dataset.channel == 'row' ? "&#xeb10;" : "&#xeb11;"}}</i> 
      </template> 
    </a-button>
    <a-button v-if="!showCompleteTable && !isCanvas && dom.dataset.rotatebutton" type="text" size="small" class="unfoldButton" style="top: 0; right: 0; position: absolute" @click="handleRotate(dom)"> 
      <template #icon> 
        <i class="iconfont"> &#xe607; </i> 
      </template> 
    </a-button>
    <!-- for dragenter -->
    <div v-if="entered == index" class="judgedrag"> </div>

    <!-- top (canvas only) -->
    <div v-if="!showCompleteTable && isCanvas">
      <div v-if="puzzleType == 'horizontal'" v-for="i in dom.dataset.colSpan" class="horizontalSemiCircle upSemiCircle canvasSemiCircle" :style="`right: ${i*bw-bw/2-pr}px; top: ${-pr}px;`" :class="{'phBorder': dom.className == 'placeholderBlock', 'highlightedBlock': dom.dataset.bid == highlightedBlockId}" data-dir='top' style="border-top: 1px solid #DDE6ED"/>
      <div v-else v-for="i in dom.dataset.colSpan" class="horizontalSemiCircle downSemiCircle canvasSemiCircle" :style="`right: ${i*bw-bw/2-pr}px; top: -1px;`" :class="{'phBorder': dom.className == 'placeholderBlock', 'highlightedBlock': dom.dataset.bid == highlightedBlockId}" data-dir='top' style="border-top: 1px solid #DDE6ED"/>
    </div>
    <!-- bottom -->
    <div v-if="!showCompleteTable">
      <div v-if="puzzleType == 'horizontal'" v-for="i in dom.dataset.colSpan" class="horizontalSemiCircle upSemiCircle" :style="`right: ${i*bw-bw/2-pr}px; top: ${dom.style.height-pr+1}px;`" :class="{'phBorder': dom.className == 'placeholderBlock', 'highlightedBlock': dom.dataset.bid == highlightedBlockId}" data-dir='bottom'/>
      <div v-else v-for="i in dom.dataset.colSpan" class="horizontalSemiCircle downSemiCircle" :style="`right: ${i*bw-bw/2-pr}px; top: ${dom.style.height-1}px;`" :class="{'phBorder': dom.className == 'placeholderBlock', 'highlightedBlock': dom.dataset.bid == highlightedBlockId}" data-dir='bottom'/>
    </div>
    <!-- left  -->
    <div v-if="!showCompleteTable">
      <div v-if="puzzleType == 'horizontal'" v-for="i in dom.dataset.rowSpan" class="verticalSemiCircle rightSemiCircle" :style="`left: -1px; bottom: ${i*bh-bh/2-pr}px;`" :class="{'phBorder': dom.className == 'placeholderBlock', 'highlightedBlock': dom.dataset.bid == highlightedBlockId}" data-dir='left'/>
      <div v-else v-for="i in dom.dataset.rowSpan" class="verticalSemiCircle leftSemiCircle" :style="`left: ${-pr}px; bottom: ${i*bh-bh/2-pr}px;`" :class="{'phBorder': dom.className == 'placeholderBlock', 'highlightedBlock': dom.dataset.bid == highlightedBlockId}" data-dir='left'/>
    </div>
    <!-- right (canvas only) -->
    <div v-if="!showCompleteTable && isCanvas">
      <div v-if="puzzleType == 'horizontal'" v-for="i in dom.dataset.rowSpan" class="verticalSemiCircle rightSemiCircle canvasSemiCircle" :style="`left: ${dom.style.width - 1}px; bottom: ${i*bh-bh/2-pr}px;`" :class="{'phBorder': dom.className == 'placeholderBlock', 'highlightedBlock': dom.dataset.bid == highlightedBlockId}" data-dir='right' style="border-right: 1px solid #DDE6ED"/>
      <div v-else v-for="i in dom.dataset.rowSpan" class="verticalSemiCircle leftSemiCircle canvasSemiCircle" :style="`left: ${dom.style.width-pr+1}px; bottom: ${i*bh-bh/2-pr}px;`" :class="{'phBorder': dom.className == 'placeholderBlock', 'highlightedBlock': dom.dataset.bid == highlightedBlockId}" data-dir='right' style="border-right: 1px solid #DDE6ED"/>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { mapState, mapMutations, mapActions } from "vuex";
import { Puzzle_Radius, Graph_Block_Size } from "../CONSTANT.js";
export default {
  name: "Puzzle",
  emits: ['cell-unfold', 'cell-rotate'],
  props: {
    domSource: {
      type: Object,
      // default: [],
    },
    puzzleType: {
      type: String,
      default: "vertical"
    },
    showCompleteTable: {
      type: Boolean,
      default: false,
    },
    isCanvas: {
      type: Boolean,
      default: false,
    },
    highlightedBlockId: {
      type: String,
      default: undefined,
    }
  },
  data() {
    return ({
      entered: -1,
    });
  },
  computed: {
    pr() {
      return Puzzle_Radius;
    },
    bw() {
      return Graph_Block_Size.width;
    },
    bh() {
      return Graph_Block_Size.height;
    },
    // reversed_domSource() {
    //   // return [...this.domSource].reverse();
    //   return this.domSource;
    // }
  },
  methods: {
    handleUnfold(dom) {
      dom.dataset.unfoldbutton = dom.dataset.unfoldbutton ? false : true;
      this.$emit('cell-unfold', dom.dataset);
    },
    handleRotate(dom) {
      this.$emit('cell-rotate', dom.dataset);
    }
  },
  watch: {

  }
}
// defineProps({
//   msg: String,
// })

// const count = ref(0)
</script>

<style scoped>
.highlightedBlock {
  /* border: 2px solid black; */
  /* box-shadow: 0 0 0 1px black; */
  background-color: #dddddd;
}

.highlightedBlock .verticalSemiCircle {
  border-right: 1px solid #dddddd;
  background-color: #dddddd;
}

.highlightedBlock .horizontalSemiCircle {
  border-top: 1px solid #dddddd;
  background-color: #dddddd;
}

.puzzleText {
  overflow: hidden;
  pointer-events: none;
  white-space: pre-wrap;
  padding: 9px 9px;
  /* height: 100%; */
  margin: 0;
  /* line-height: 1em; */
}

.horizontalSemiCircle {
  z-index: 5000;
  pointer-events: none;
  height: 7px;
  width: 14px;
  position: absolute;
  border: 1px solid #cccccc;
  background-color: white;
}

.verticalSemiCircle {
  z-index: 5000;
  pointer-events: none;
  height: 14px;
  width: 7px;
  position: absolute;
  border: 1px solid #cccccc;
  background-color: white;
}

.upSemiCircle {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: 1px solid white;
}

.downSemiCircle {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top: 1px solid white;
}

.leftSemiCircle {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-right: 1px solid white;
}

.rightSemiCircle {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-left: 1px solid white;
}

.phBorder {
  border-color: #dadada;
}

.childborder {
  display: none;
}

.rightchildhover .childborder {
  display: block !important;
  position: absolute;
  right: 0;
  bottom: 0;
  /* height: 30px; */
  width: 0 !important;
  border-right: 3px solid red;
  z-index: 6000;
}

.bottomchildhover .childborder {
  display: block !important;
  position: absolute;
  right: 0;
  bottom: 0;
  /* width: 110px; */
  height: 0 !important;
  border-bottom: 3px solid red;
}

.trborder1 {
  display: none;
}

.toprighthover .trborder1 {
  display: block !important;
  position: absolute;
  right: 0;
  top: 0;
  height: 30px;
  width: 0;
  border-right: 3px solid red;
  z-index: 6000;
}

.trborder2 {
  display: none;
}

.toprighthover .trborder2 {
  display: block !important;
  position: absolute;
  right: 0;
  top: 0;
  height: 0;
  width: 30px;
  border-bottom: 3px solid red;
  z-index: 6000;
}

.blborder1 {
  display: none;
}

.bottomlefthover .blborder1 {
  display: block !important;
  position: absolute;
  left: 0;
  bottom: 0;
  height: 30px;
  width: 0;
  border-left: 3px solid red;
  z-index: 6000;
}

.blborder2 {
  display: none;
}

.bottomlefthover .blborder2 {
  display: block !important;
  position: absolute;
  left: 0;
  bottom: 0;
  height: 0;
  width: 30px;
  border-bottom: 3px solid red;
  z-index: 6000;
}

.unfoldButton {
  position: absolute;
  background-color: #eeeeee;
  border: none;
  color: #aaaaaa;
}

.unfoldButton:hover {
  /* font-weight: bold; */
  background-color: #cccccc;
}

.rowUnfoldButton {
  right: 0px;
  bottom: 0px;
}

.colUnfoldButton {
  right: 0px;
  bottom: 0px;
}

.canvasSemiCircle {
  background-color: #DDE6ED;
}

.judgedrag {
  position: absolute;
  right: 20px;
  height: 100%;
  width: 40px;
  top: 0;
  background-color: rgba(200, 200, 200, 0.5);
  border: 1px solid #eeeeee;
  pointer-events: none;
}

.areahover .judgedrag {
  border: 2px solid red; 
}
</style>

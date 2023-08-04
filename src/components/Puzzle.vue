<template>
  <div v-for="(dom, index) in domSource" :class="dom.className + (dom.dataset.bid == highlightedBlockId ? ' highlightedBlock' : '')" :style="`position: ${dom.style.position}; left: ${dom.style.left}px; top: ${dom.style.top}px; width: ${dom.style.width}px; height: ${dom.style.height}px;`" :data-bid="dom.dataset.bid"
    :data-channel="dom.dataset.channel" :data-row-parent-id="dom.dataset.rowParentId" :data-col-parent-id="dom.dataset.colParentId" :data-row="dom.dataset.row" :data-col="dom.dataset.col" :draggable="dom.draggable"
    @dragover="dom.ondragover" @dragstart="dom.ondragstart" @dragleave="dom.ondragleave" @drop="dom.ondrop" @click="dom.onclick" @contextmenu="dom.oncontextmenu"
  >
    <pre class="puzzleText">{{dom.innerText}}</pre>
    <div class="childborder"></div>
    <a-button v-if="!showCompleteTable && !isCanvas && dom.dataset.unfoldbutton" type="text" size="small" class="unfoldButton" :class="dom.dataset.channel == 'row' ? 'rowUnfoldButton' : 'colUnfoldButton'" @click="handleUnfold(dom)"> ... </a-button>
    <!-- top (canvas only) -->
    <div v-if="isCanvas">
      <div v-if="puzzleType == 'horizontal'" v-for="i in dom.dataset.colSpan" class="horizontalSemiCircle upSemiCircle canvasSemiCircle" :style="`right: ${i*bw-bw/2-pr}px; top: ${-pr}px;`" :class="{'phBorder': dom.className == 'placeholderBlock', 'highlightedBlock': dom.dataset.bid == highlightedBlockId}" data-dir='top' style="border-top: 1px solid #DDE6ED"/>
      <div v-else v-for="i in dom.dataset.colSpan" class="horizontalSemiCircle downSemiCircle canvasSemiCircle" :style="`right: ${i*bw-bw/2-pr}px; top: -1px;`" :class="{'phBorder': dom.className == 'placeholderBlock', 'highlightedBlock': dom.dataset.bid == highlightedBlockId}" data-dir='top' style="border-top: 1px solid #DDE6ED"/>
    </div>
    <!-- bottom -->
    <div v-if="puzzleType == 'horizontal'" v-for="i in dom.dataset.colSpan" class="horizontalSemiCircle upSemiCircle" :style="`right: ${i*bw-bw/2-pr}px; top: ${dom.style.height-pr+1}px;`" :class="{'phBorder': dom.className == 'placeholderBlock', 'highlightedBlock': dom.dataset.bid == highlightedBlockId}" data-dir='bottom'/>
    <div v-else v-for="i in dom.dataset.colSpan" class="horizontalSemiCircle downSemiCircle" :style="`right: ${i*bw-bw/2-pr}px; top: ${dom.style.height-1}px;`" :class="{'phBorder': dom.className == 'placeholderBlock', 'highlightedBlock': dom.dataset.bid == highlightedBlockId}" data-dir='bottom'/>
    <!-- left  -->
    <div v-if="puzzleType == 'horizontal'" v-for="i in dom.dataset.rowSpan" class="verticalSemiCircle rightSemiCircle" :style="`left: -1px; bottom: ${i*bh-bh/2-pr}px;`" :class="{'phBorder': dom.className == 'placeholderBlock', 'highlightedBlock': dom.dataset.bid == highlightedBlockId}" data-dir='left'/>
    <div v-else v-for="i in dom.dataset.rowSpan" class="verticalSemiCircle leftSemiCircle" :style="`left: ${-pr}px; bottom: ${i*bh-bh/2-pr}px;`" :class="{'phBorder': dom.className == 'placeholderBlock', 'highlightedBlock': dom.dataset.bid == highlightedBlockId}" data-dir='left'/>
    <!-- right (canvas only) -->
    <div v-if="isCanvas">
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
  emits: ['cell-unfold'],
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
  background-color: #dddddd !important;
}

.highlightedBlock .verticalSemiCircle {
  border-right: 1px solid #dddddd !important;
}

.highlightedBlock .horizontalSemiCircle {
  border-top: 1px solid #dddddd !important;
}

.puzzleText {
  font-family: Inter-Light-7, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
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

.rightchildhover .childborder {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 50px;
  width: 0;
  border: 1px solid red;
}

.bottomchildhover .childborder {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 110px;
  height: 0;
  border: 1px solid red;
}

.unfoldButton {
  position: absolute;
  background-color: #eeeeee;
  border: none;
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
  top: 0px;
}

.canvasSemiCircle {
  background-color: #DDE6ED;
}
</style>

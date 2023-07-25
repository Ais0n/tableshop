<template>
  <div v-for="(dom, index) in reversed_domSource" :class="dom.className" :style="`position: ${dom.style.position}; left: ${dom.style.left}px; top: ${dom.style.top}px; width: ${dom.style.width}px; height: ${dom.style.height}px;`" :data-bid="dom.dataset.bid"
    :data-channel="dom.dataset.channel" :data-row-parent-id="dom.dataset.rowParentId" :data-col-parent-id="dom.dataset.colParentId" :draggable="dom.draggable"
    @dragover="dom.ondragover" @dragstart="dom.ondragstart" @dragleave="dom.ondragleave" @drop="dom.ondrop" @click="dom.onclick" @contextmenu="dom.oncontextmenu"
  >
    <pre class="puzzleText">{{dom.innerText}}</pre>
    <div class="childborder"></div>
    <!-- top -->
    <!-- <div v-if="puzzleType == 'horizontal'" class="horizontalSemiCircle upSemiCircle" :style="`left: ${dom.style.width /2 - puzzle_radius}px; top: ${-puzzle_radius}px;`" :class="{'phBorder': dom.className == 'placeholderBlock'}" data-dir='top'/>
    <div v-else class="horizontalSemiCircle downSemiCircle" :style="`left: ${dom.style.width /2 - puzzle_radius}px; top: -1px;`" :class="{'phBorder': dom.className == 'placeholderBlock'}" data-dir='top'/> -->
    <!-- bottom -->
    <!-- <div v-if="puzzleType == 'horizontal'" class="horizontalSemiCircle upSemiCircle" :style="`left: ${dom.style.width /2 - puzzle_radius}px; top: ${dom.style.height-puzzle_radius+1}px;`" :class="{'phBorder': dom.className == 'placeholderBlock'}" data-dir='bottom'/>
    <div v-else class="horizontalSemiCircle downSemiCircle" :style="`left: ${dom.style.width /2 - puzzle_radius}px; top: ${dom.style.height-1}px;`" :class="{'phBorder': dom.className == 'placeholderBlock'}" data-dir='bottom'/> -->
    <!-- left  -->
    <!-- <div v-if="puzzleType == 'horizontal'" class="verticalSemiCircle rightSemiCircle" :style="`left: -1px; top: ${dom.style.height / 2 - puzzle_radius}px;`" :class="{'phBorder': dom.className == 'placeholderBlock'}" data-dir='left'/>
    <div v-else class="verticalSemiCircle leftSemiCircle" :style="`left: ${-puzzle_radius}px; top: ${dom.style.height / 2 - puzzle_radius}px;`" :class="{'phBorder': dom.className == 'placeholderBlock'}" data-dir='left'/> -->
    <!-- right -->
    <!-- <div v-if="puzzleType == 'horizontal'" class="verticalSemiCircle rightSemiCircle" :style="`left: ${dom.style.width - 1}px; top: ${dom.style.height / 2 - puzzle_radius}px;`" :class="{'phBorder': dom.className == 'placeholderBlock'}" data-dir='right'/>
    <div v-else class="verticalSemiCircle leftSemiCircle" :style="`left: ${dom.style.width-puzzle_radius+1}px; top: ${dom.style.height / 2 - puzzle_radius}px;`" :class="{'phBorder': dom.className == 'placeholderBlock'}" data-dir='right'/> -->
  </div>
</template>

<script>
import { ref } from 'vue';
import { mapState, mapMutations, mapActions } from "vuex";
import { Puzzle_Radius } from "../CONSTANT.js";
export default {
  props: {
    domSource: {
      type: Object,
      // default: [],
    },
    puzzleType: {
      type: String,
      default: "vertical"
    }
  },
  data() {
    return ({

    });
  },
  computed: {
    puzzle_radius() {
      return Puzzle_Radius;
    },
    reversed_domSource() {
      return [...this.domSource].reverse();
    }
  },
  methods: {

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
.puzzleText {
  font-family: Inter-Light-7, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  overflow: hidden;
  pointer-events: none;
  white-space: pre-wrap;
  padding: 9px 9px;
  height: 100%;
  margin: 0;
  line-height: 1em;
}

.horizontalSemiCircle {
  z-index: 5000;
  pointer-events: none;
  height: 10px;
  width: 20px;
  position: absolute;
  border: 1px solid black;
  background-color: white;
}

.verticalSemiCircle {
  z-index: 5000;
  pointer-events: none;
  height: 20px;
  width: 10px;
  position: absolute;
  border: 1px solid black;
  background-color: white;
}

.upSemiCircle {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: 1px solid white !important;
}

.downSemiCircle {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top: 1px solid white !important;
}

.leftSemiCircle {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-right: 1px solid white !important;
}

.rightSemiCircle {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-left: 1px solid white !important;
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
</style>

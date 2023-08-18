<template>
  <div v-for="(dom, index) in domSource" :id="dom.id" :class="dom.className + (dom.dataset.bid == highlightedBlockId ? ' highlightedBlock' : '')" :style="`position: ${dom.style.position}; left: ${dom.style.left}px; top: ${dom.style.top}px; width: ${dom.style.width}px; height: ${dom.style.height}px; ${dom.style.computed}`" :data-bid="dom.dataset.bid"
    :data-channel="dom.dataset.channel" :data-row-parent-id="dom.dataset.rowParentId" :data-col-parent-id="dom.dataset.colParentId" :data-row="dom.dataset.row" :data-col="dom.dataset.col" :data-table-id="dom.dataset.tableId" :draggable="dom.draggable" @dragend="dom.ondragend"
    @dragover="(e) => {entered = index; dom.ondragover(e)}" @dragstart="dom.ondragstart" @dragleave="(e) => { entered = -1; dom.ondragleave(e)}" @drop="dropSelect($event, dom)" @click="dom.onclick" @contextmenu="dom.oncontextmenu"
  >
    <div class="puzzleText">{{dom.innerText}}</div>
    <div class="childborder" :style="`height: ${dom.style.height - 30}px; width: ${dom.style.width - 30}px;`"></div>
    <div class="trborder1"></div>
    <div class="trborder2"></div>
    <div class="blborder1"></div>
    <div class="blborder2"></div>
    <a-button v-if="!showCompleteTable && !isCanvas && dom.dataset.unfoldbutton && !dragging" type="text" size="small" class="unfoldButton" :class="dom.dataset.channel == 'row' ? 'rowUnfoldButton' : 'colUnfoldButton'" @click="handleUnfold(dom)"> 
      <template #icon> 
        <i class="iconfont"> {{dom.dataset.channel == 'row' ? "&#xeb10;" : "&#xeb11;"}}</i> 
      </template> 
    </a-button>
    <a-button v-if="!showCompleteTable && !isCanvas && dom.dataset.rotatebutton && entered != index && !dragging" type="text" size="small" class="unfoldButton" style="top: 0; right: 0; position: absolute" @click="handleRotate(dom)"> 
      <template #icon> 
        <i class="iconfont"> &#xe607; </i> 
      </template> 
    </a-button>
    <!-- for the dragovered puzzle -->
    <!-- <div v-if="entered == index" class="judgedrag"> </div> -->

    <!-- for drag hints -->
    <!-- <div style="width: calc(50% - 35px); height: 30px; position: absolute; left: 35px; top: 2px; border: 2px solid #526D82; pointer-events: none; background-color: #eeeeee;"><i class="iconfont" style="width: 20px; height: 20px;"> &#xe602; </i></div>
    <div style="width: calc(50% - 35px); height: 30px;  position: absolute; right: 35px; top: 2px; border: 2px solid #9DB2BF; pointer-events: none; background-color: #eeeeee; "><i class="iconfont" style="width: 20px; height: 20px;"> &#xe605; </i></div>
    <div style="width: calc(50% - 35px); height: 30px; position: absolute; left: 35px; bottom: 2px; border: 2px solid #526D82; pointer-events: none; background-color: #eeeeee; "> <i class="iconfont" style="width: 20px; height: 20px;"> &#xe600; </i> </div>
    <div style="width: calc(50% - 35px); height: 30px; position: absolute; right: 35px; bottom: 2px; border: 2px solid #9DB2BF;pointer-events: none; background-color: #eeeeee; "> <i class="iconfont" style="width: 20px; height: 20px;"> &#xe608; </i> </div>
    <div style="height: calc(100% - 4px); width: 30px; position: absolute; left: 5px; top: 2px; border: 2px solid #9DB2BF;pointer-events: none; background-color: #eeeeee;">  <i class="iconfont" style="width: 20px; height: 20px; position: absolute; top: calc(50% - 12px); left: 2px;"> &#xe601; </i></div> -->
    <!-- <div style="height: 25px; position: absolute; right: 5px; top: 2px; border-left: 2px solid #9DB2BF; pointer-events: none; background-color: #eeeeee; "> </div> -->
    <!-- <div style="height: calc(100% - 4px); width: 30px; position: absolute; right: 5px; top: 2px; border: 2px solid #526D82; pointer-events: none; background-color: #eeeeee;"> <i class="iconfont" style="width: 20px; height: 20px; position: absolute; right: 2px; top: calc(50% - 10px);"> &#xe603; </i> </div> -->

    <!-- for drag disambiguition -->
    <a-popconfirm v-if="openPanel_id == index" :placement="tmp_dir" cancel-text="Cancel" @cancel="dropSelectCancel"  :open="openPanel">
      <template #okButton></template>
      <template #title>
        <p class="dropSelectText"> Select the desired result: </p>
        <div v-if="dom.dataset.channel == 'row' && tmp_dir == 'right'">
          <div class="dropSelectOption" @click="dropSelectFinish('right')">
            <i class="iconfont"> &#xe603; </i>
            <!-- <a-radio :checked="selectedDir == 'right'" @change="selectedDir = 'right'"> </a-radio> -->
            <div class="dropSelectText"> Insert by hierarchy </div>
            <div class="dropSelectOptionGlyph">
              <div style="border: 1px solid #aaaaaa; height: 60px; width: 80px; display: flex; justify-content: center; align-items: center; "> 
                {{ dom.innerText }}
              </div>
              <div style="width: 80px;"> 
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{egValue}} </div>
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> ...... </div>
              </div>
            </div>
          </div>
          <div class="dropSelectOption" @click="dropSelectFinish('area')">
            <i class="iconfont"> &#xeb76; </i>
            <!-- <a-radio :checked="selectedDir == 'area'" @change="selectedDir = 'area'"> </a-radio> -->
            <div class="dropSelectText"> Append to the right </div>
            <div class="dropSelectOptionGlyph">
              <div style="border: 1px solid #aaaaaa; height: 30px; width: 80px; display: flex; justify-content: center; align-items: center; "> 
                {{ dom.innerText }}
              </div>
              <div style="width: 80px;"> 
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{egValue}}, ...... </div>
              </div>
            </div>
          </div>
          <div class="dropSelectOption" @click="dropSelectFinish('topright')">
            <i class="iconfont"> &#xe605; </i>
            <!-- <a-radio :checked="selectedDir == 'topright'" @change="selectedDir = 'topright'"> </a-radio> -->
            <div class="dropSelectText"> Build a crosstab </div>
            <div class="dropSelectOptionGlyph">
              <div style="width: 80px;"> 
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> </div>
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{dom.innerText}} </div>
              </div>
              <div style="width: 80px;"> 
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{egValue}} </div>
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> ...... </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="dom.dataset.channel == 'row' && tmp_dir == 'top'">
          <div class="dropSelectOption" @click="dropSelectFinish('top')">
            <i class="iconfont"> &#xe602; </i>
            <!-- <a-radio :checked="selectedDir == 'top'" @change="selectedDir = 'top'"> </a-radio> -->
            <div class="dropSelectText"> Append to the top </div>
            <div class="dropSelectOptionGlyph">
              <div style="width: 160px;"> 
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{egValue}} </div>
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{dom.innerText}} </div>
              </div>
            </div>
          </div>
          <div class="dropSelectOption" @click="dropSelectFinish('topright')">
            <i class="iconfont"> &#xe605; </i>
            <!-- <a-radio :checked="selectedDir == 'topright'" @change="selectedDir = 'topright'"> </a-radio> -->
            <div class="dropSelectText"> Build a crosstab </div>
            <div class="dropSelectOptionGlyph">
              <div style="width: 80px;"> 
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> </div>
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{dom.innerText}} </div>
              </div>
              <div style="width: 80px;"> 
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{egValue}} </div>
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> ...... </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="dom.dataset.channel == 'row' && tmp_dir == 'bottom'">
          <div class="dropSelectOption" @click="dropSelectFinish('bottomchild')">
            <i class="iconfont"> &#xe608; </i>
            <!-- <a-radio :checked="selectedDir == 'bottomchild'" @change="selectedDir = 'bottomchild'"> </a-radio> -->
            <div class="dropSelectText"> Insert by hierarchy </div>
            <div class="dropSelectOptionGlyph">
              <div style="width: 160px;"> 
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{dom.innerText}} </div>
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center; margin-left: 20px; width: 140px;"> {{ egValue }} </div>
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center; margin-left: 20px; width: 140px;">  ......  </div>
              </div>
            </div>
          </div>
          <div class="dropSelectOption" @click="dropSelectFinish('bottom')">
            <i class="iconfont"> &#xe600; </i>
            <!-- <a-radio :checked="selectedDir == 'bottom'" @change="selectedDir = 'bottom'"> </a-radio> -->
            <div class="dropSelectText" style="font-size: 13px"> Append to the bottom </div>
            <div class="dropSelectOptionGlyph">
              <div style="width: 160px;"> 
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{dom.innerText}} </div>
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{egValue}} </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="dom.dataset.channel == 'column' && tmp_dir == 'bottom'">  
          <div class="dropSelectOption" @click="dropSelectFinish('bottom')">
            <i class="iconfont"> &#xeb78; </i>
            <!-- <a-radio :checked="selectedDir == 'bottom'" @change="selectedDir = 'bottom'"> </a-radio> -->
            <div class="dropSelectText"> Insert by hierarchy </div>
            <div class="dropSelectOptionGlyph" style="flex-direction: column">
              <div style="border: 1px solid #aaaaaa; height: 30px; width: 160px; display: flex; justify-content: center; align-items: center; "> 
                {{ dom.innerText }}
              </div>
              <div style="display: flex; flex-direction: row"> 
                <div style="height: 30px; width: 80px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{egValue}} </div>
                <div style="height: 30px; width: 80px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> ...... </div>
              </div>
            </div>
          </div>
          <div class="dropSelectOption" @click="dropSelectFinish('area')">
            <i class="iconfont"> &#xe600; </i>
            <!-- <a-radio :checked="selectedDir == 'area'" @change="selectedDir = 'area'"> </a-radio> -->
            <div class="dropSelectText" style="font-size: 13px"> Append to the bottom </div>
            <div class="dropSelectOptionGlyph" style="flex-direction: column">
              <div style="border: 1px solid #aaaaaa; height: 30px; width: 160px; display: flex; justify-content: center; align-items: center; "> 
                {{ dom.innerText }}
              </div>
              <div style="width: 160px;"> 
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{egValue}}, ...... </div>
              </div>
            </div>
          </div>
          <div class="dropSelectOption" @click="dropSelectFinish('bottomleft')">
            <i class="iconfont"> &#xe604; </i>
            <!-- <a-radio :checked="selectedDir == 'bottomleft'" @change="selectedDir = 'bottomleft'"> </a-radio> -->
            <div class="dropSelectText"> Build a crosstab </div>
            <div class="dropSelectOptionGlyph">
              <div style="width: 80px;"> 
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> </div>
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{egValue}} </div>
              </div>
              <div style="width: 80px;"> 
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{dom.innerText}} </div>
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> ...... </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="dom.dataset.channel == 'column' && tmp_dir == 'left'">
          <div class="dropSelectOption" @click="dropSelectFinish('left')">
            <i class="iconfont"> &#xeb77; </i>
            <!-- <a-radio :checked="selectedDir == 'left'" @change="selectedDir = 'left'"> </a-radio> -->
            <div class="dropSelectText"> Append to the left </div>
            <div class="dropSelectOptionGlyph" style="width: 160px; display: flex;">
              <div style="height: 30px; width: 80px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{egValue}} </div>
              <div style="height: 30px; width: 80px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{dom.innerText}} </div>
            </div>
          </div>
          <div class="dropSelectOption" @click="dropSelectFinish('bottomleft')">
            <i class="iconfont"> &#xe604; </i>
            <!-- <a-radio :checked="selectedDir == 'bottomleft'" @change="selectedDir = 'bottomleft'"> </a-radio> -->
            <div class="dropSelectText"> Build a crosstab </div>
            <div class="dropSelectOptionGlyph">
              <div style="width: 80px;"> 
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> </div>
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{egValue}} </div>
              </div>
              <div style="width: 80px;"> 
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{dom.innerText}} </div>
                <div style="height: 30px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> ...... </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="dom.dataset.channel == 'column' && tmp_dir == 'right'">
          <div class="dropSelectOption" @click="dropSelectFinish('rightchild')">
            <i class="iconfont"> &#xe606; </i>
            <!-- <a-radio :checked="selectedDir == 'rightchild'" @change="selectedDir = 'rightchild'"> </a-radio> -->
            <div class="dropSelectText"> Insert by hierarchy </div>
            <div class="dropSelectOptionGlyph" >
              <div style="width: 60px; height: 60px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{dom.innerText}} </div>
              <div style="width: 60px; height: 40px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center; margin-top: 20px;"> {{ egValue }} </div>
              <div style="width: 60px; height: 40px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center; margin-top: 20px;">  ......  </div>
            </div>
          </div>
          <div class="dropSelectOption" @click="dropSelectFinish('right')">
            <i class="iconfont"> &#xeb76; </i>
            <!-- <a-radio :checked="selectedDir == 'right'" @change="selectedDir = 'right'"> </a-radio> -->
            <div class="dropSelectText"> Append to the right </div>
            <div class="dropSelectOptionGlyph">
              <div style="width: 90px; height: 40px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;"> {{ dom.innerText }} </div>
              <div style="width: 90px; height: 40px; border: 1px solid #aaaaaa; display: flex; justify-content: center; align-items: center;">  {{ egValue }} </div>
            </div>
          </div>
        </div>
      </template>
       <div style="width: 100%; height: 100%; position: absolute; top: 0px; right: 0px; pointer-events: none"></div>
    </a-popconfirm>

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
    },
    dragging: {
      type: Boolean,
      default: false,
    },
    rightpanel: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return ({
      entered: -1,
      tmp_e: undefined,
      tmp_dom: undefined,
      tmp_dir: undefined,
      openPanel: false,
      openPanel_id: -1,
      selectedDir: "",
      egValue: undefined,
    });
  },
  computed: { ...mapState(["draggedItemType", "draggedBlock", "draggedAttr"]),
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
    },
    dropSelect(e, dom) {
      e.stopPropagation();
      e.preventDefault();
      console.log(e, dom);
      this.openPanel_id = this.entered;
      this.entered = -1;
      // dom.ondrop(e);
      this.tmp_e = e;
      this.tmp_dom = dom;

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
      if(this.draggedItemType == 'function' || (dom.dataset.channel == 'row' && dir == 'left') || (dom.dataset.channel == 'column' && dir == 'top')) {
        dom.ondrop(e, dir);
        return;
      }
      this.tmp_dir = dir;

      if(this.draggedItemType == 'attr') {
        if(!(this.draggedAttr.values instanceof Array) || this.draggedAttr.values.length == 0) {
          throw new Warning("Invalid drag: there is no values in the dragged block.");
          this.egValue = "...";
        } else {
          this.egValue = this.draggedAttr.values[0];
        }
      } else if(this.draggedItemType == 'block') {
        this.egValue = this.draggedBlock.innerText;
      } else {
        this.egValue = "sum";
      }

      // if(dom.dataset.channel == 'row') {
      //   if(dir == 'right') this.selectedDir = 'right';
      //   else if(dir == 'bottom') this.selectedDir = 'bottomchild';
      //   else if(dir == 'top') this.selectedDir = 'top';
      // } else if(dom.dataset.channel == 'column') {
      //   if(dir == 'bottom') this.selectedDir = 'bottom';
      //   else if(dir == 'right') this.selectedDir = 'rightchild';
      //   else if(dir == 'left') this.selectedDir = 'left';
      // }

      this.openPanel = true;
    },
    dropSelectFinish(dir) {
      this.openPanel = false;
      this.tmp_dom.ondrop(this.tmp_e, dir);
    },
    dropSelectCancel() {
      this.openPanel = false;
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

.dropSelectText {
  font-family: Inter-Regular-9, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  display: inline-block;
  margin-left: 5px;
}

.dropSelectOption {
  /* margin-top: 5px; */
  margin-bottom: 20px;
  width: 180px;
  padding: 5px 5px 5px 5px;
}

.dropSelectOption:hover{
  background-color: #ddeaed;
}

.dropSelectOptionGlyph {
  margin-top: 5px;
  display: flex;
}
</style>

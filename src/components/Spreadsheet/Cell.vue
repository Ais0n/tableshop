<template>
  <div
    class="cell"
    :id="givenId"
    :class="{'text-bold': cellBold, 'select-highlight': highlight }"
    :contenteditable="editable"
    @blur="handleChange"
    @click="handleClick"
  >
    {{realValue}}
    <slot title="toolbar"></slot>
  </div>
</template>

<script>
import Utils from "../../utils.js";
export default {
  name: "SpreadsheetCell",
  props: {
    cellValue: [String, Object, Number],
    cellBold: {
      type: Boolean,
      default: false,
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    givenId: { //cell的标识符，格式为：[表格名]_cell_[行]_[列]
      type: String,
      required: true, 
    },
    editable: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    realValue(){ //真正要显示的数据
      let cv = this.cellValue;
      // if (cv != undefined) {
      //   if (cv.value != undefined) {
      //     if (!cv.value.lower) { //一般走这个If
      //       return String(Utils.toFix(cv.value));
      //     } else if (cv.value.isRightOpen == true) {
      //       return `[${Utils.toFix(cv.value.lower)}, ${Utils.toFix(cv.value.upper)})`;
      //     } else {
      //       return `[${Utils.toFix(cv.value.lower)}, ${Utils.toFix(cv.value.upper)}]`;
      //     }
      //   } else if(typeof cv === "string" || typeof cv === "number"){
      //     return String(Utils.toFix(cv));
      //   } else { //或者走这个If，即Index.vue有输入但.value是null/undefined
      //     return ""; 
      //   }
      // } else { //再或者走这个if，是undefined或者null，即Index.vue完全没有东西输入
      //   return "";
      // }
      return cv;
    },
  },
  data() {
    return {
    };
  },
  methods: {
    handleChange(e) { //处理单元格编辑
      console.log("blur")
      this.$emit("cell-change", e.target.innerText);
    },
    handleClick(e) { //处理选中单元格
      console.log("clicked")
      this.$emit("cell-click", this.realValue);
    },
  }
};
</script>

<style scoped>
.text-bold {
  font-family: Inter-Bold-4, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
.select-highlight {
  border: 2px solid black !important;
  border-radius: 5px;
}
/* .cell:hover {
  background-color: white;
} */
</style>

<template>
  <div class="spreadsheet">
    <div v-if="header" class="row">
      <div
        class="cell-container"
        v-for="(headerValue, j) in header"
        :key="`${name}_header_${j}`"
      >
        <cell
          :cellValue="headerValue"
          :givenId="`${name}_header_${j}`"
          :cellBold="true"
        >
          <slot title="toolbar"></slot>
        </cell>
      </div>
    </div>
    <div class="row" v-for="(row, i) in Table" :key="`${name}_row_${i}`">
      <div
        class="cell-container"
        v-for="(rowValue, j) in row"
        :key="`${name}_cell_${i}_${j}`"
      >
        <cell
          :class="{'qsep': qsep && i != Table.length - 1}"
          :cellValue="rowValue"
          :givenId="`${name}_cell_${i}_${j}`"
          :editable="editable && highlightedId == `${name}_cell_${i}_${j}`"
          :highlight="editable && highlightedId == `${name}_cell_${i}_${j}`"
          @cell-change="handleCellChange(name, i, j, $event)"
          @cell-click="handleCellClick(name, i, j, `${name}_cell_${i}_${j}`, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Cell from "./Cell.vue";
import { mapState, mapMutations, mapActions } from "vuex";
import Utils from "../../utils.js";

export default {
  name: "Spreadsheet",
  props: {
    table: Array, //The table to be shown or edited, maybe undefined
    header: Array,
    name: {//表格的名字，用以区分左表右表
      type: String,
      default: "initTable",
    },
    // highlight: {
    //   type: Object,
    //   default: null,
    // },
    initRowNum: { //暂时没用
      type: Number,
      default: 1,
    },
    initColNum: { //暂时没用
      type: Number,
      default: 1,
    },
    fixedRowNum: { //暂时没用
      type: Number,
      default: 0,
    },
    fixedColNum: { //暂时没用
      type: Number,
      default: 0,
    },
    minRowNum: { //暂时没用
      type: Number,
      default: 0,
    },
    minColNum: { //暂时没用
      type: Number,
      default: 0,
    },
    qsep: { // 用于quick separate
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      Table: [], //The table after processing the props `table`
      Header: [], //The header after processing the props `table`
      leftHightlightedRow: -1,
      leftHightlightedColumn: -1,
      topHightlightedRow: -1,
      topHightlightedColumn: -1,
      leftHovered: false,
      topHovered: false,
      highlightedId: {}
    };
  },
  created() {
    this.initTable();
  },

  watch: {
    table() {
      if(this.editMode === "r" || this.editMode === "rw") {
        //in sync with the `Table`
        this.initTable();
      }
    },
    header() {
      if(this.editMode === "r" || this.editMode === "rw") {
        //in sync with the `Table`
        this.initTable();
      }
    }
  },
  methods: {
    // cellStyle(i, rowValue) {
    //   if(rowValue && rowValue.attrColor) {
    //     return {
    //       "background-color": rowValue.attrColor
    //     };
    //   } else {
    //     return {
    //       "background-color": (i % 2 == 1) ? "#eaebee" : ""
    //     };
    //   }
    // },
    initTable() {
      let tableRowNum = 0, tableColNum = 0;
      if(this.table && this.table instanceof Array) {
        tableRowNum = this.table.length;
        tableColNum = 0;
        for (let i = 0; i < tableRowNum; i++) {
          if (tableColNum < this.table[i].length) {
            tableColNum = this.table[i].length;
          }
        }
      }
      tableRowNum = (tableRowNum && tableColNum) ? tableRowNum : this.initRowNum;
      tableColNum = (tableRowNum && tableColNum) ? tableColNum : this.initColNum;
      let finalRowNum = this.fixedRowNum ? this.fixedRowNum : (tableRowNum < this.minRowNum ? this.minRowNum : tableRowNum);
      let finalColNum = this.fixedColNum ? this.fixedColNum : (tableColNum < this.minColNum ? this.minColNum : tableColNum);
      if (this.table && this.table instanceof Array) {
        let table = Utils.deepClone(this.table);
        for (let i = 0; i < table.length; i++) {
          // console.log(table[i].length);
          Utils.fillNull(table[i], finalColNum - table[i].length);
        }
        let len = table.length;
        if (len < finalRowNum) {
          for (let i = 0; i < finalRowNum - len; i++) {
            table.push(new Array(finalColNum));
          }
        }
        this.Table = table;
        if(this.header) {
          let header = Utils.deepClone(this.header);
          Utils.fillNull(header, finalColNum - header.length);
          this.Header = header;
        }
        // console.log("initTable:",this.Table);
      } else { //如果传入的table是undefined，则生成一个全为undefined的二维数组
        let table = new Array(finalRowNum);
        for (let i = 0; i < finalRowNum; i++) {
          table[i] = new Array(finalColNum);
          for(let j = 0; j < finalColNum; j++){
            table[i][j] = undefined;
          }
        }
        this.Table = table;
      }
    },
    handleCellChange(name, row, col, value) {
      this.Table[row][col] = value;
      this.highlightedId = "";
      this.$emit("cell-change", this.Table);
    },
    handleCellClick(name, row, col, id, value) {
      if(this.qsep) {
        this.$emit("cell-separate", {
          name,
          row,
          col
        })
      } else {
        this.highlightedId = id;
      }
    },
  },
  components: {
    Cell,
  },
};
</script>

<style>
.spreadsheet {
  text-align: left;
  /* display: table; */
  /* overflow: scroll; */
}

.row {
  width: 100%;
  /* height: 32px; */
  /* display: flex;
  flex-direction: row; */
  display: table-row;
}

/* .row:first-child {
  height: 32.5px;
}

.row:last-child {
  height: 32.5px;
} */


.cell-container {
  /* flex: 1 1; */
  /* border: 1px solid #bbb;  */
  /* font: 100 16px/20px Times; */
  /* overflow-y: auto; */
  display: table-cell;
  position: relative;
  text-align: center;
  margin: 0 auto;
  height: 24px;
  font-family: Inter-Regular-9, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.cell-container .cell {
  width: 100px;
  height: 100%;
  /* vertical-align: middle; */
  padding: 7px 5px 1px 5px;
  text-align: center;
  /* white-space: pre; */
  overflow-x: hidden;
  white-space: nowrap;
  display: inline-block;
  cursor: pointer;
  border: 1px solid #bbb;
}

.cell-container::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.refreshIcon {
  display: inline-block;
  float: right;
  cursor: pointer;
}

/* .row:first-child .cell-container {
  border-top: 1.5px solid ;
}

.row .cell-container:first-child {
  border-left: 1.5px solid;
}

.row .cell-container:last-child {
  border-right: 1.5px solid ;
}

.row:last-child .cell-container {
  border-bottom: 1.5px solid ;
} */
</style>

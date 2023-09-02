<template>
  <div class="dataview" id="dataview">
    <div class="dataSubview">
      <div class="title2" style="margin-bottom: 5px"> Data </div>
      <a-popconfirm title="Choose a dataset" ok-text="Import" cancel-text="Cancel" @confirm="importDataset" placement="rightTop">
        <template #description>
          <a-select
            ref="select"
            v-model:value="dataset"
            class="header-select"
            size="small"
            placeholder="Select data"
          >
            <a-select-option
              v-for="expdata in EXAMPLE_DATA"
              :key="expdata.name"
              :value="JSON.stringify(expdata)"
            >
              {{ expdata.name }}
            </a-select-option>
          </a-select>
        </template>
        <a-button class="header-button"> Import Dataset </a-button>
      </a-popconfirm>
      <a-popconfirm title="Choose the table type" ok-text="Select File" cancel-text="Cancel" @confirm="importTable" placement="rightTop">
        <template #description>
          <a-radio-group v-model:value="tableType">
            <a-radio value="crosstab"> Crosstab </a-radio>
            <a-radio value="relational"> Relational table </a-radio>
          </a-radio-group>
        </template>
        <a-button class="header-button"> Import Table </a-button>
      </a-popconfirm>
      <div style="margin-top: 15px; background-color:white; border-radius: 5px; padding: 7px 7px;">
        <!-- <a-table v-if="data" :columns="headers"  :data-source="data.values" >
          <template #headerCell="{ column }">
            {{ column.title }}
          </template>

          <template #bodyCell="{ column, record }">
            {{ record[column.dataIndex] }}
          </template>
        </a-table> -->
        <Spreadsheet v-if="data" :header="headers" :table="data.values" :editable="false" class="sourceView"/>
        <a-empty v-else> </a-empty>
      </div>
    </div>
    <div class="entitySubview">
      <div class="title2"> Entities </div>
      <div id="entitySubviewContainer">
        <div v-for="(attr, i) in this.attrInfo" :key="'attrInfo_'+String(i)">
          <div class="attrInfoItem">
            <div @dragstart="handleDragStart(attr)" :draggable="true" @dragend="handleDragend">
              <i v-if="attr.dataType == 'categorical'" class="iconfont attrInfoItemIcon">&#xe624;</i>
              <i v-else class="iconfont attrInfoItemIcon">&#xe6da;</i> 
              <div class="attrInfoItemText"> {{attr.name}} </div>
              <a-button shape="circle" size="small" class="title-button" @dragstart="handleTitleDragStart($event, attr)" :draggable="true" @dragend="handleDragend">
                <i class="iconfont"> &#xe680; </i>
              </a-button>
            </div>
            <div style="display: flex">
              <mychart style="margin-left: 20px;" :chartId="`attr_${i}`" :attr="attr" :draggable="false"> </mychart>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal v-model:open="open" :footer="null"> 
      
    </a-modal>
    <!-- <div class="datamodelSubview">
      <div class="title2"> Data Model </div>
      <div class="datamodelList"> </div>
    </div> -->
    <!-- <div class="graphviewSubview">
      <div class="title2" style="display: inline-block"> Graph View </div>
      <i class="iconfont iconsigma" :draggable="true" @dragstart="this.handleSigmaDragStart">&#xe853;</i>
      <GraphView/>
    </div> -->
  </div>

</template>

<script>
import { ref } from 'vue'
import { mapState, mapMutations, mapActions } from "vuex";
import GraphView from '../components/GraphView.vue';
import Mychart from '../components/Mychart.vue';
import { EXAMPLE_DATA } from "../CONSTANT.js";
import csvtojson from "csvtojson";
import Spreadsheet from '../components/Spreadsheet/Index.vue';
import * as tableShop from "../process/tableshop.js";
export default {
  name: "DataView",
  data() {
    return ({
      // selected: 0,
      dataset: "",
      fileName: undefined,
      open: false,
      tableType: "crosstab",
    });
  },
  computed: {
    ...mapState(["attrInfo", "data"]),
    headers() {
      if(!this.data || !(this.data.values instanceof Array) || this.data.values.length == 0) return [];
      let tmp = Object.keys(this.data.values[0]);
      // let res = [];
      // for(let i = 0; i < tmp.length; i++) {
      //   res.push({
      //     title: tmp[i],
      //     dataIndex: tmp[i],
      //   })
      // }
      // return res;
      return tmp;
    },
    EXAMPLE_DATA() {
      return EXAMPLE_DATA;
    }
  },
  methods: {
    async importDataset() {
      // console.log(this.dataset)
      if(!this.dataset || this.dataset == "") {
        this.$message.error("Please select a dataset");
        return;
      }
      try {
        this.importData(this.dataset);
      } catch (e) {
        console.log(e);
        this.$message.error("Unsupported File Type");
      }
    },
    async importData(rawData) {
      // console.log("importData:", rawData);
      // console.log("fileName:", this.fileName);

      try {
        let data;
        if(this.fileName && (this.fileName.slice(-3) == "csv" || this.fileName.slice(-3) == "CSV")) {
          let parsedJSONData = await csvtojson.fromString(rawData);
          console.log("parsedJSONData:", parsedJSONData);
          data = {
            "name": this.fileName.slice(0, -3),
            "values": parsedJSONData
          };
        } else if(this.fileName && (this.fileName.slice(-4) == "json" || this.fileName.slice(-4) == "JSON")) {
          data = {
            "name": this.fileName.slice(0, -4),
            "values": rawData
          };
        } else if(!this.fileName) {
          data = JSON.parse(rawData);
        } else {
          throw new Error("Unsupported File Type");
        }
        this.$store.commit("changeData", data);
        console.log(data);
        let attrs = Object.keys(data.values[0]);
        let attrInfo = [];
        for(let j = 0; j < attrs.length; j++) {
          let attr = attrs[j], valueList = [];
          for(let i = 0; i < data.values.length; i++) {
            valueList.push(data.values[i][attr])
          }
          valueList = Array.from(new Set(valueList));
          let dataType = typeof(valueList[0]) == "string" ? "categorical" : "numerical";
          attrInfo.push({
            "name": attr,
            "values": valueList,
            "dataType": dataType,
          });
        }
        this.$store.commit("storeAttrInfo", attrInfo);
      } catch (e) {
        console.log(e);
        this.$message.error("Unsupported File Type");
        return;
      }
    },
    async importTable() {
      let rawData = await this.selectData();
      let name = this.fileName;
      // if(typeof this.fileName != "undefined") {
      //   for(let i = 0; i < this.fileName.length; i++) {
      //     if(this.fileName[i] == '.') {
      //       name = this.fileName.slice(0, i);
      //       break;
      //     }
      //   }
      // } else {
      //   this.$message.error("Please choose a file");
      //   throw new Error("No file name");
      // }
      // this.importData({
      //   name,
      //   values: rawData
      // });
      console.log(name)
      let spec = await tableShop.default.utils.parseTable(rawData, this.tableType);
      console.log(spec)
      
    },
    async selectData() {
      return new Promise((resolve, reject) => {
        let input = document.createElement("input");
        input.value = "select file";
        input.type = "file";
        input.onchange = (event) => {
          let file = event.target.files[0];
          this.fileName = file.name;
          let file_reader = new FileReader();
          file_reader.onload = () => {
            let fc = file_reader.result;
            resolve(fc); // 返回文件文本内容到Promise
          };
          file_reader.readAsArrayBuffer(file);
        };
        input.click();
      });
    },
    // viewDataset() {
    //   if(!this.data) {
    //     this.$message.error("Please first import a dataset.");
    //     return;
    //   }
    //   this.open = true;
    // },
    handleSigmaDragStart() {
      console.log("drag")
      this.$store.commit("storeDraggedItemType", 'function');
    },
    handleDragStart(attr) {
      console.log("dragstart")
      this.$store.commit("storeDraggedAttr", attr);
      this.$store.commit("storeDraggedItemType", 'attr');
      this.$bus.emit("attrdragstart");
    },
    handleTitleDragStart(e, attr) {
      e.stopPropagation();
      console.log("titleDragstart");
      this.$store.commit("storeDraggedValue", attr.name);
      this.$store.commit("storeDraggedItemType", 'value');
    },
    handleDragend() {
      this.$bus.emit("attrdragend");
    }
  },
  updated() {
    let tmp = document.getElementById("entitySubviewContainer"), tmp2 = document.getElementById("dataview");
    tmp2 = tmp2.getBoundingClientRect().height;
    console.log(tmp2);
    tmp.style.height = `${tmp2 - 400}px`;
  },
  components: {
    GraphView,
    Mychart,
    Spreadsheet,
  }
}
</script>

<style scoped>
.dataview {
  height: calc(100% - 55px);
  width: 20%;
  position: absolute;
  padding: 15px 20px 15px 20px;
}

.dataSubview {
  width: 100%;
  margin-bottom: 15px;
}

.entitySubview {
  width: 100%;
  margin-bottom: 15px;
  position: relative;
}

#entitySubviewContainer {
  overflow-y: scroll;
  padding: 5px 5px;
  width: 100%;
}

#entitySubviewContainer::-webkit-scrollbar {
  display: none;
}

.sourceView {
  height: 250px;
  overflow: scroll;
}

.sourceView::-webkit-scrollbar:vertical {
  display: none;
}

/* .entityList {
  background: white;
  width: 100%;
  height: calc(100% - 28px);
  margin-top: 5px;
  padding: 5px 10px 5px 10px;
  overflow-y: scroll;
} */

.datamodelSubview {
  width: 100%;
  height: 30%;
  margin-bottom: 15px;
}

.datamodelList {
  background: white;
  width: 100%;
  height: calc(100% - 28px);
  margin-top: 5px;
}

.graphviewSubview {
  width: 100%;
  height: 20%;
  margin-bottom: 15px;
}

.header-bar {
  height: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  color: black;
  white-space: nowrap;
}

.header-select {
  display: inline-block;
  margin-left: 30px;
  width: 120px;
  border-radius: 5px !important;
  height: 28px;
}

.header-button {
  display: inline-block;
  line-height: 24px;
  height: 24px;
  margin-right: 20px;
  text-align: center;
  padding: 0px 9px 0px 9px;
  border-radius: 5px;
  font-family: Inter-Regular-9, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

#system-title {
  display: inline-block;
  margin-left: 27px;
  width: 57px;
  font-size: 1.3rem;
  font-weight: 650;
  line-height: 1.75rem;
  letter-spacing: 0;
  font-family: Inter-ExtraBold-5, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.attrInfoItem {
  /* border-bottom: 1px solid #dadada; */
  background: white;
  border: 1px solid #aaaaaa;
  border-radius: 5px;
  margin-top: 7px;
  margin-bottom: 5px;
  padding: 3px 5px;
  position: relative;
}

.attrInfoItemIcon {
  display: inline-block;
  font-size: 17px;
  margin-right: 5px;
}

.attrInfoItemText {
  display: inline-block;
  font-size: 17px;
  font-family: Inter-Medium-8, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  cursor: pointer;
}

.iconsigma {
  display: inline-block;
  cursor: pointer;
  font-size: 18px;
  float: right;
}

.valueList {
  margin-top: 10px;
  border: 1px solid #aaaaaa;
  overflow-y: scroll;
}

.title-button {
  /* display: inline-block; */
  /* float: right; */
  position: absolute;
  right: 5px;
  top: 1px;
}

.contextmenu::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}

::-webkit-scrollbar :horizontal {
  height: 4px;
  background: gray;
}
</style>

<template>
  <div class="header-bar">
    <div id="system-title">Tableshop</div>
    <!-- <i class="iconData iconfont">&#xe685;</i> -->
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
    <a-button class="header-button" @click="importDataset"> Import </a-button>
    <a-button class="header-button" @click="viewDataset"> View Data </a-button>
    <i class="iconfont header-icon" @click="undo"> &#xebbd; </i>
    <i class="iconfont header-icon" @click="redo"> &#xeb83; </i>
    <a-modal v-model:open="open" :footer="null"> 
      <a-table :columns="headers"  :data-source="data.values">
        <template #headerCell="{ column }">
          {{ column.title }}
        </template>

        <template #bodyCell="{ column, record }">
           {{ record[column.dataIndex] }}
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { EXAMPLE_DATA } from "../CONSTANT.js";
import csvtojson from "csvtojson";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "HeaderView",
  data() {
    return ({
      dataset: "",
      fileName: undefined,
      open: false,
    });
  },
  computed: {
    ...mapState(["data"]),
    headers() {
      if(!this.data || !(this.data.values instanceof Array) || this.data.values.length == 0) return [];
      let tmp = Object.keys(this.data.values[0]);
      let res = [];
      for(let i = 0; i < tmp.length; i++) {
        res.push({
          title: tmp[i],
          dataIndex: tmp[i],
        })
      }
      return res;
    },
    EXAMPLE_DATA() {
      return EXAMPLE_DATA;
    }
  },
  methods: {
    async importDataset() {
      console.log(this.dataset)
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
      console.log("importData:", rawData);
      console.log("fileName:", this.fileName);

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
    viewDataset() {
      if(!this.data) {
        this.$message.error("Please first import a dataset.");
        return;
      }
      this.open = true;
    },
    undo() {
      this.$bus.emit("undo");
    },
    redo() {
      this.$bus.emit("redo");
    }
  }


  //Store raw data
  // let jsonData;
  // try {
  //   if (
  //     (this.fileName && (this.fileName.slice(-3) == "csv" ||
  //     this.fileName.slice(-3) == "CSV")) // 这里这个csv的判断还是留着了后面有用，虽然下面的操作是一样的
  //   ) {
  //     // jsonData = this.importCSVData(rawData);
  //     this.storeRawData(rawData);
  //     this.fileName = null;
  //   } else {
  //     // jsonData = JSON.parse(rawData);
  //     this.storeRawData(rawData);
  //     this.fileName = null;
  //   }
  // } catch (e) {
  //   console.log(e);
  //   this.$message.error("Unsupported File Type");
  //   return;
  // }
}
</script>

<style scoped>
.header-bar {
  height: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  color: white;
  white-space: nowrap;
}

.header-button {
  display: inline-block;
  line-height: 24px;
  height: 24px;
  margin-left: 20px;
  text-align: center;
  padding: 0px 9px 0px 9px;
  border-radius: 5px;
  font-family: Inter-Regular-9, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.header-icon {
  display: inline-block;
  line-height: 24px;
  height: 24px;
  margin-left: 15px;
  text-align: center;
  color: black;
  padding: 0px 3px;
}

.header-icon:hover {
  /* background-color: #9DB2BF; */
  color: white;
  cursor: pointer;
}

.header-select {
  display: inline-block;
  margin-left: 30px;
  width: 120px;
  border-radius: 5px !important;
  height: 28px;
}

#system-title {
  display: inline-block;
  margin-left: 27px;
  /* width: 57px; */
  font-size: 1.2rem;
  font-weight: 650;
  line-height: 1.75rem;
  letter-spacing: 0;
  font-family: Inter-ExtraBold-5, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.iconData {
  font-size: 25px !important;
  line-height: 28px;
  margin-left: 20px;
}
</style>

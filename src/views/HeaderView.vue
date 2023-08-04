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
  </div>
</template>

<script>
import { EXAMPLE_DATA } from "../CONSTANT.js";
import csvtojson from "csvtojson";

export default {
  name: "HeaderView",
  data() {
    return ({
      dataset: "",
      fileName: undefined,
    });
  },
  computed: {
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

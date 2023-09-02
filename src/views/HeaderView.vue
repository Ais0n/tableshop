<template>
  <div class="header-bar">
    <div id="system-title">Table Illustrator</div>
    <!-- <i class="iconData iconfont">&#xe685;</i> -->
    <i class="iconfont header-icon" @click="undo"> &#xebbd; </i>
    <i class="iconfont header-icon" @click="redo"> &#xeb83; </i>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "HeaderView",
  data() {
    return ({
    });
  },
  computed: {
  },
  methods: {
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

<template>
  <div class="dataview">
    <div class="entitySubview">
      <div class="title2"> Entities </div>
      <div class="entityList">
        <div v-for="(attr, i) in this.attrInfo" :key="'attrInfo_'+String(i)" class="attrInfoItem" @dragstart="handleDragStart(attr)" :draggable="true">
          <i v-if="attr.dataType == 'Categorical'" class="iconfont attrInfoItemIcon">&#xe624;</i>
          <i v-else class="iconfont attrInfoItemIcon">&#xe6da;</i> 
          <div class="attrInfoItemText"> {{attr.name}} </div>
        </div>
      </div>
    </div>
    <!-- <div class="datamodelSubview">
      <div class="title2"> Data Model </div>
      <div class="datamodelList"> </div>
    </div> -->
    <div class="graphviewSubview">
      <div class="title2" style="display: inline-block"> Graph View </div>
      <i class="iconfont iconsigma" :draggable="true" @dragstart="this.handleSigmaDragStart">&#xe853;</i>
      <GraphView/>
    </div>
  </div>

  <!-- <div class="header-bar">
    <div id="system-title">Tableshop</div>
  </div> -->

</template>

<script>
import { ref } from 'vue'
import { mapState, mapMutations, mapActions } from "vuex";
import GraphView from '../components/GraphView.vue';
export default {
  name: "DataView",
  data() {
    return ({

    });
  },
  computed: {
    ...mapState(["attrInfo"])
  },
  methods: {
    handleSigmaDragStart() {
      console.log("drag")
      this.$store.commit("storeDraggedItemType", 'function');
    },
    handleDragStart(attr) {
      console.log("dragstart")
      this.$store.commit("storeDraggedAttr", attr);
      this.$store.commit("storeDraggedItemType", 'attr');
    }
  },
  components: {
    GraphView,
  }
}
</script>

<style scoped>
.dataview {
  height: calc(100% - 55px);
  width: 20%;
  position: absolute;
  padding: 15px 15px 15px 15px;
}

.entitySubview {
  width: 100%;
  height: 20%;
  margin-bottom: 15px;
}

.entityList {
  background: white;
  width: 100%;
  height: calc(100% - 28px);
  margin-top: 5px;
  padding: 5px 10px 5px 10px;
  overflow-y: scroll;
}

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
  height: 30%;
  margin-bottom: 15px;
}

.header-bar {
  height: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  color: black;
  white-space: nowrap;
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
  border-bottom: 1px solid #dadada;
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

.contextmenu::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}

::-webkit-scrollbar :horizontal {
  height: 4px;
  background: gray;
}
</style>

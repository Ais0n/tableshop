<template>
  <div class="configview">
    <div v-if="this.selectedBlock">
      <div class="configAttrHeader">
        <i v-if="this.dataType == 'Categorical'" class="iconfont configAttrHeaderIcon">&#xe624;</i>
        <i v-else class="iconfont configAttrHeaderIcon">&#xe6da;</i> 
        <div class="configAttrHeaderText"> {{this.selectedBlock.attrName}} </div>
      </div>
      <div class="configAttrPanel">
        <div class="configAttrPanelTitle"> Structure </div>
        <div class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> entityMerge </div> 
          <a-select
            v-model:value="this.entityMerge"
            class="configAttrSubpanelSelect"
            size="small"
            placeholder="Select parameter"
          >
            <a-select-option
              v-for="op in [true, false]"
              :key="'entityMerge_'+String(op)"
              :value="op"
            >
              {{ String(op) }}
            </a-select-option>
          </a-select>
        </div>
        <div class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> gridMerge </div> 
          <a-select
            v-model:value="this.gridMerge"
            class="configAttrSubpanelSelect"
            size="small"
            placeholder="Select parameter"
          >
            <a-select-option
              v-for="op in [true, false]"
              :key="'gridMerge_'+String(op)"
              :value="op"
            >
              {{ String(op) }}
            </a-select-option>
          </a-select>
        </div>
        <div class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> facet </div> 
          <a-select
            v-model:value="this.facet"
            class="configAttrSubpanelSelect"
            size="small"
            placeholder="Select parameter"
          >
            <a-select-option
              v-for="op in [true, false]"
              :key="'facet_'+String(op)"
              :value="op"
            >
              {{ String(op) }}
            </a-select-option>
          </a-select>
        </div>
        <div class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> key </div> 
          <a-select
            v-model:value="this.key"
            class="configAttrSubpanelSelect"
            size="small"
            placeholder="Select parameter"
          >
            <a-select-option
              v-for="op in [true, false]"
              :key="'key_'+String(op)"
              :value="op"
            >
              {{ String(op) }}
            </a-select-option>
          </a-select>
        </div>
        <div class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> blankLine </div> 
          <a-select
            v-model:value="this.blankLine"
            class="configAttrSubpanelSelect"
            size="small"
            placeholder="Select parameter"
          >
            <a-select-option
              v-for="op in [true, false]"
              :key="'blankLine_'+String(op)"
              :value="op"
            >
              {{ String(op) }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="configAttrPanel">
        <div class="configAttrPanelTitle"> Style </div>
        <div class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> border </div> 
          <a-select
            v-model:value="this.border"
            class="configAttrSubpanelSelect"
            size="small"
            placeholder="Select parameter"
          >
            <a-select-option
              v-for="op in [true, false]"
              :key="'border_'+String(op)"
              :value="op"
            >
              {{ String(op) }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="configAttrPanel">
        <div class="configAttrPanelTitle"> Templates </div>
      </div>
    </div>
  </div>

  <!-- <div class="header-bar">
    <div id="system-title">Tableshop</div>
  </div> -->

</template>

<script>
import { ref } from 'vue';
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return ({
      entityMerge: false,
      gridMerge: true,
      facet: 'window',
      key: true,
      blankLine: false,
      border: false,
    });
  },
  computed: {
    ...mapState(["selectedBlock", "attrInfo"]),
    dataType() {
      let attrName = this.selectedBlock.attrName;
      for(let i = 0; i < this.attrInfo.length; i++) {
        if(this.attrInfo[i].name == attrName) {
          return this.attrInfo[i].dataType;
        }
      }
      return "categorical";
    }
  },
  methods: {
    ...mapMutations(["storeSelectedBlock"]),
    autoApply() {
      // 更新selectedBlock
      let tmp = this.selectedBlock;
      tmp.entityMerge = this.entityMerge;
      this.storeSelectedBlock(tmp);

      // 更新tree
      this.$bus.emit("update", tmp);
    }
  },
  watch: {
    selectedBlock(val, oldval) {
      if(typeof(val) != 'undefined' && val != oldval) {
        this.entityMerge = (typeof(val.entityMerge) != 'undefined') ? val.entityMerge : false;
      }
    },
    entityMerge(val, oldval) {
      if(typeof(val) != 'undefined' && val != oldval) {
        this.autoApply();
      }
    }
  }
}
// defineProps({
//   msg: String,
// })

// const count = ref(0)
</script>

<style scoped>
.configview {
  height: calc(100% - 55px);
  width: 20%;
  position: absolute;
  padding: 15px 15px 15px 15px;
}

.configAttrHeader {
  /* height: 50px; */
  border-bottom: 1px solid #dadada;
}

.configAttrHeaderIcon {
  display: inline-block;
  font-size: 17px;
  margin-right: 5px;
}

.configAttrHeaderText {
  display: inline-block;
  font-size: 17px;
  font-family: Inter-Medium-8, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  /* cursor: pointer; */
}

.configAttrPanel {
  /* margin-top: 10px; */
  border-bottom: 1px solid #dadada;
  padding-top: 10px;
  padding-bottom: 10px;
}

.configAttrPanelTitle {
  font-size: 15px;
  font-family: Inter-Bold-4, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.configAttrSubpanel {
  margin-top: 7px;
}

.configAttrSubpanelSelect {
  float: right;
  width: 100px;
  font-family: Inter-Regular-9, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.configAttrSubpanelTitle {
  display: inline-block;
  font-size: 15px;
  font-family: Inter-Medium-8, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
</style>

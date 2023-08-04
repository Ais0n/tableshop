<template>
  <div class="targetview">
    <div class="toolbar">
      <i class="iconfont iconsigma" :draggable="true" @dragstart="this.handleSigmaDragStart">&#xe853;</i>
      <i class="iconfont iconsigma" :draggable="true" @dragstart="this.handleCutDragStart">&#xe650;</i>
    </div>
    <div class="showCompleteTable">
      Show complete table: 
      <a-switch v-model:checked="showCompleteTable" style="display: inline-block; margin-left: 10px;"/>
    </div>
    <div class="graphviewSubview">
      <GraphView :showCompleteTable="showCompleteTable"/>
    </div>
  </div>

</template>

<script>
import { ref } from 'vue'
import { mapState, mapMutations, mapActions } from "vuex";
import GraphView from '../components/GraphView.vue';
export default {
  data() {
    return ({
      showCompleteTable: false,
    });
  },
  computed: {
    ...mapState(["selectedBlock", "attrInfo"]),
  },
  methods: {
    handleSigmaDragStart() {
      console.log("drag")
      this.$store.commit("storeDraggedItemType", 'function');
    },
    handleCutDragStart() {
      
    }
  },
  components: {
    GraphView,
  }
}
</script>

<style scoped>
.targetview {
  height: 100%;
  width: 100%;
  position: absolute;
}

.graphviewSubview {
  width: 100%;
  height: 100%;
  margin-bottom: 15px;
  /* padding: 15px 20px 15px 20px; */
  background-color: #DDE6ED;
}

.iconsigma {
  display: inline-block;
  cursor: pointer;
  font-size: 20px;
  margin: 4px 0px 4px 15px;
  width: 32px;
  text-align: center;
  /* background-color: #9DB2BF; */
  border-radius: 10px;
  /* float: right; */
}

.iconsigma:hover{
  background-color: #9DB2BF;
}

.toolbar {
  /* border-bottom: 1px solid #27374D; */
  background-color: rgb(194, 211, 225);
  position: absolute;
  border-radius: 15px;
  width: 50%;
  left: 25%;
  top: 10px;
  height: 32px;
  z-index: 3000;
  padding-left: 30px;
  padding-right: 30px;
}

.showCompleteTable {
  position: absolute;
  top: 10px;
  right: 50px;
  z-index: 3000;
}
</style>

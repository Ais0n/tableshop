<template>
  <div v-for="(dom, index) in domSource" :class="dom.className" :style="dom.style" :data-bid="dom.dataset.bid"
    :data-channel="dom.dataset.channel" :data-row-parent-id="dom.dataset.rowParentId" :data-col-parent-id="dom.dataset.colParentId" :draggable="dom.draggable"
    @dragover="dom.ondragover" @dragstart="dom.ondragstart" @dragleave="dom.ondragleave" @drop="dom.ondrop" @click="dom.onclick" @contextmenu="dom.oncontextmenu"
  >
    <div> {{dom.innerText}} </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  props: {
    domSource: {
      type: Object,
      // default: [],
    },
  },
  data() {
    return ({

    });
  },
  computed: {

  },
  methods: {

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

</style>

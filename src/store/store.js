import { createStore } from 'vuex'

export const store = createStore({
  state () {
    return {
      data: undefined,
      attrInfo: [],

      //temporary variables
      draggedItemType: "",
      draggedAttr: undefined,
      draggedBlock: undefined,
      
      selectedBlock: undefined,
      selectedTable: undefined,
      configEg: undefined,
    }
  },
  mutations: {
    changeData (state, data) {
      state.data = data;
    },
    storeAttrInfo (state, attrInfo) {
      state.attrInfo = attrInfo;
    },
    storeDraggedItemType (state, draggedItemType) {
      state.draggedItemType = draggedItemType;
    },
    storeDraggedAttr (state, draggedAttr) {
      state.draggedAttr = draggedAttr;
    },
    storeDraggedBlock (state, draggedBlock) {
      state.draggedBlock = draggedBlock;
    },
    storeSelectedBlock (state, selectedBlock) {
      state.selectedBlock = selectedBlock;
    },
    storeSelectedTable (state, selectedTable) {
      state.selectedTable = selectedTable;
    },
    storeConfigEg (state, configEg) {
      state.configEg = configEg;
    }
  }
})

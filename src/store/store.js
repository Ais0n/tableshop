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
      draggedValue: "", 
      
      selectedBlock: undefined,
      selectedTable: undefined,
      selectedPos: undefined,
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
    storeDraggedValue (state, draggedValue) {
      state.draggedValue = draggedValue;
    },
    storeSelectedBlock (state, selectedBlock) {
      state.selectedBlock = selectedBlock;
    },
    storeSelectedTable (state, selectedTable) {
      state.selectedTable = selectedTable;
    },
    storeSelectedPos (state, selectedPos) {
      state.selectedPos = selectedPos;
    },
    storeConfigEg (state, configEg) {
      state.configEg = configEg;
    }
  }
})

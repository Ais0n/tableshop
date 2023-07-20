import { createStore } from 'vuex'
let testSpec = {
  rowHeader: [{
    attr: {
      name: "state",
      type: "categorical",
      values: ["Alabama", "Alaska"]
    },
    children: [{
      attr: {
        name: "year",
        type: "categorical",
        values: [2004, 2005]
      }
    }]
  }],
	// columnHeader: [...],
	cell: [{
    name: "crime",
    type: "numerical",
    values: [4029.3, 3900, 3370.9, 3615],
  }],
	// attrInfo: [...],
	// styles: [{"class1": {...}, "class2": {...}, ...}] // 样式声明部分
}

export const store = createStore({
  state () {
    return {
      data: undefined,
      attrInfo: [],
      specification: testSpec,

      //temporary variables
      draggedItemType: "",
      draggedAttr: undefined,
      draggedBlock: undefined,
      
      selectedBlock: undefined,
    }
  },
  mutations: {
    changeData (state, data) {
      state.data = data;
    },
    storeAttrInfo (state, attrInfo) {
      state.attrInfo = attrInfo;
    },
    storeSpecification (state, specification) {
      state.specification = specification;
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
    }
  }
})

export const EXAMPLE_DATA = [
  {
    name: "crime", // 数据集的名称
    values: [
      { state: "Alabama", year: "2004", crime: 4029.3 },
      { state: "Alabama", year: "2005", crime: 3900 },
      { state: "Alaska", crime: 3370.9, year: "2004" },
      { state: "Alaska", crime: 3615, year: "2005" },
    ],
  },
  {
    name: "sales",
    values: [
      { continent: "Asia", country: "CHN", year: "2019", season: "spr", sales: 105 },
      { continent: "Asia", country: "CHN", year: "2019", season: "aut", sales: 110 },
      { continent: "Asia", country: "CHN", year: "2020", season: "spr", sales: 120 },
      { continent: "Asia", country: "CHN", year: "2020", season: "aut", sales: 125 },
      { continent: "Asia", country: "CHN", year: "2021", season: "spr", sales: 131 },
      { continent: "Asia", country: "CHN", year: "2021", season: "aut", sales: 150 },
      { continent: "Asia", country: "JPN", year: "2019", season: "spr", sales: 60 },
      { continent: "Asia", country: "JPN", year: "2019", season: "aut", sales: 80 },
      { continent: "Asia", country: "JPN", year: "2020", season: "spr", sales: 82 },
      { continent: "Asia", country: "JPN", year: "2020", season: "aut", sales: 92 },
      { continent: "Asia", country: "JPN", year: "2021", season: "spr", sales: 95 },
      { continent: "Asia", country: "JPN", year: "2021", season: "aut", sales: 110 },
      { continent: "Europe", country: "GBR", year: "2019", season: "spr", sales: 80 },
      { continent: "Europe", country: "GBR", year: "2019", season: "aut", sales: 92 },
      { continent: "Europe", country: "GBR", year: "2020", season: "spr", sales: 95 },
      { continent: "Europe", country: "GBR", year: "2020", season: "aut", sales: 104 },
      { continent: "Europe", country: "GBR", year: "2021", season: "spr", sales: 112 },
      { continent: "Europe", country: "GBR", year: "2021", season: "aut", sales: 136 },
      { continent: "Europe", country: "FRA", year: "2019", season: "spr", sales: 59 },
      { continent: "Europe", country: "FRA", year: "2019", season: "aut", sales: 63 },
      { continent: "Europe", country: "FRA", year: "2020", season: "spr", sales: 72 },
      { continent: "Europe", country: "FRA", year: "2020", season: "aut", sales: 79 },
      { continent: "Europe", country: "FRA", year: "2021", season: "spr", sales: 86 },
      { continent: "Europe", country: "FRA", year: "2021", season: "aut", sales: 90 },
    ],
  }
]

export const Graph_Padding = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

export const Graph_Block_Size = {
  width: 140,
  height: 60,
};

export const Graph_Block_Size_Placeholder = {
  width: 140,
  height: 60,
}

export const Graph_Block_Ellipsis_Height = 20;
export const Graph_Block_Margin = 5;

export const Puzzle_Radius = 7;


// export const EXAMPLE_DATA = [
//   {
//     id: "crime",
//     name: "US Crime Rate By State (2004--2008)",
//     url: "http://localhost:5000/dataset/crime",
//   },
// ];

// export const EXTRACT_URL = "http://localhost:5000/extract";
// export const EXAMPLE_SPEC = {
//   rowHeader: [{
//     attrName: "continent",
//     blockId: "11111",
//     entityMerge: false,
//     children: [{
//       attrName: "country",
//       blockId: "22222",
//       entityMerge: false,
//     }]
//     // }, {
//     //   function: "sum",
//     //   blockId: "33333",
//     //   entityMerge: false,
//     // }],
//   }],
//   columnHeader: [{
//     attrName: "year",
//     blockId: "44444",
//     entityMerge: false,
//     children: [{
//       attrName: "season",
//       blockId: "55555",
//       entityMerge: false,
//     }],
//   }],
//   cell: [{
//     attrName: "crime",
//     rowParentId: "22222",
//     colParentId: "55555",
//     blockId: "66666",
//   }, 
//   // {
//   //   attrName: "crime",
//   //   rowParentId: "33333",
//   //   colParentId: "55555",
//   // }
//   ],
//   attrInfo: [{
//     name: "continent",
//     dataType: "categorical",
//     values: ["Asia", "Europe"],
//   }, {
//     name: "country",
//     dataType: "categorical",
//     values: ["CHN", "JPN", "GBR", "FRA"]
//   }, {
//     name: "year",
//     dataType: "categorical",
//     values: ["2019", "2020", "2021"]
//   }, {
//     name: "season",
//     dataType: "categorical",
//     values: ["spr", "aut"],
//   }, {
//     name: "crime",
//     dataType: "numerical",
//     values: [105, 110, 120, 125, 131, 150, 60, 80, 82, 92, 95, 110, 80, 92, 95, 104, 112, 136, 59, 63, 72, 79, 86, 90],
//   },],
//   styles: undefined
// }

export const EXAMPLE_SPEC = {
  rowHeader: [{
    attrName: "continent",
    blockId: "11111",
    values: ["Asia"],
    entityMerge: false,
    // blankLine: true,
    // key: {
    //   position: "left",
    //   // position: "embedded",
    //   pattern: "1",
    //   isInherited: true
    // },
    children: [{
      attrName: "country",
      blockId: "22222",
      values: ["CHN", "JPN"],
      entityMerge: false,
      // facet: 2,
    }]
    // }, {
    //   function: "sum",
    //   blockId: "33333",
    //   entityMerge: false,
    // }],
  },{
    attrName: "continent",
    blockId: "11111",
    values: ["Europe"],
    entityMerge: false,
    // blankLine: true,
    children: [{
      attrName: "country",
      blockId: "22222",
      values: ["GBR", "FRA"],
      entityMerge: false,
      // facet: 2,
    }]
  }],
  columnHeader: [{
    attrName: "year",
    blockId: "44444",
    entityMerge: false,
    // facet: 3,
    // blankLine: true,
    // key: {
    //   position: "top",
    //   // position: "embedded",
    //   pattern: "I",
    //   isInherited: true
    // },
    children: [{
      attrName: "season",
      blockId: "55555",
      entityMerge: false,
    }],
  }],
  cell: [{
    attrName: "sales",
    rowParentId: "22222",
    colParentId: "55555",
    blockId: "66666",
  }, 
  // {
  //   attrName: "crime",
  //   rowParentId: "33333",
  //   colParentId: "55555",
  // }
  ],
  attrInfo: [{
    name: "continent",
    dataType: "categorical",
    values: ["Asia", "Europe"],
  }, {
    name: "country",
    dataType: "categorical",
    values: ["CHN", "JPN", "GBR", "FRA"]
  }, {
    name: "year",
    dataType: "categorical",
    values: ["2019", "2020", "2021"]
  }, {
    name: "season",
    dataType: "categorical",
    values: ["spr", "aut"],
  }, {
    name: "sales",
    dataType: "numerical",
    values: [105, 110, 120, 125, 131, 150, 60, 80, 82, 92, 95, 110, 80, 92, 95, 104, 112, 136, 59, 63, 72, 79, 86, 90],
  },],
  styles: undefined
}

export const EXAMPLE_OUTPUT = [
  [
    { // 最左上角的empty block
      "rowSpan": 2,
      "colSpan": 2,
      "style": undefined,
    },
    {
      "value": "2019",
      "sourceBlockId": "44444",
      "rowSpan": 1,
      "colSpan": 2,
      "style": undefined,
    },
    {
      "value": "2020",
      "sourceBlockId": "44444",
      "rowSpan": 1,
      "colSpan": 2,
      "style": undefined,
    },
    {
      "value": "2021",
      "sourceBlockId": "44444",
      "rowSpan": 1,
      "colSpan": 2,
      "style": undefined,
    }
  ], 
  [
    {
      "value": "spr",
      "sourceBlockId": "55555",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": "aut",
      "sourceBlockId": "55555",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": "spr",
      "sourceBlockId": "55555",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": "aut",
      "sourceBlockId": "55555",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": "spr",
      "sourceBlockId": "55555",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": "aut",
      "sourceBlockId": "55555",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
  ],
  [
    {
      "value": "Asia",
      "sourceBlockId": "11111",
      "rowSpan": 2,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": "CHN",
      "sourceBlockId": "22222",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 105,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 110,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 120,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 125,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 131,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 150,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
  ],
  [
    {
      "value": "JPN",
      "sourceBlockId": "22222",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 60,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 80,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 82,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 92,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 95,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 110,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
  ],
  [
    {
      "value": "Europe",
      "sourceBlockId": "11111",
      "rowSpan": 2,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": "GBR",
      "sourceBlockId": "22222",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 80,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 92,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 95,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 104,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 112,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 136,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
  ],
  [
    {
      "value": "FRA",
      "sourceBlockId": "22222",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 59,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 63,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 72,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 79,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 86,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
    {
      "value": 90,
      "sourceBlockId": "66666",
      "rowSpan": 1,
      "colSpan": 1,
      "style": undefined,
    },
  ],
]

// export const EXAMPLE_OUTPUT = [
//   [
//     { // 最左上角的empty block
//       "rowSpan": 2,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": "2019",
//       "sourceBlockId": "44444",
//       "rowSpan": 1,
//       "colSpan": 2,
//       "style": undefined,
//     },
//     {
//       "value": "2020",
//       "sourceBlockId": "44444",
//       "rowSpan": 1,
//       "colSpan": 2,
//       "style": undefined,
//     },
//     {
//       "value": "2021",
//       "sourceBlockId": "44444",
//       "rowSpan": 1,
//       "colSpan": 2,
//       "style": undefined,
//     }
//   ], 
//   [
//     {
//       "value": "spr",
//       "sourceBlockId": "55555",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": "aut",
//       "sourceBlockId": "55555",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": "spr",
//       "sourceBlockId": "55555",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": "aut",
//       "sourceBlockId": "55555",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": "spr",
//       "sourceBlockId": "55555",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": "aut",
//       "sourceBlockId": "55555",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//   ],
//   [
//     {
//       "value": "Asia",
//       "sourceBlockId": "11111",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     }
//   ],
//   [
//     {
//       "value": "CHN",
//       "sourceBlockId": "22222",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 105,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 110,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 120,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 125,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 131,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 150,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//   ],
//   [
//     {
//       "value": "JPN",
//       "sourceBlockId": "22222",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 60,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 80,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 82,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 92,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 95,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 110,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//   ],
//   [
//     {
//       "value": "Europe",
//       "sourceBlockId": "11111",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     }
//   ],
//   [
//     {
//       "value": "GBR",
//       "sourceBlockId": "22222",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 80,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 92,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 95,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 104,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 112,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 136,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//   ],
//   [
//     {
//       "value": "FRA",
//       "sourceBlockId": "22222",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 59,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 63,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 72,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 79,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 86,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//     {
//       "value": 90,
//       "sourceBlockId": "66666",
//       "rowSpan": 1,
//       "colSpan": 1,
//       "style": undefined,
//     },
//   ],
// ]
export const EXAMPLE_DATA = [
  {
    name: "crime", // 数据集的名称
    values: [
      { state: "Alabama", year: "2004", crime: 4029.3 },
      { state: "Alabama", year: "2005", crime: 3900 },
      { state: "Alaska", crime: 3370.9, year: "2004" },
      { state: "Alaska", crime: 3615, year: "2005" },
    ],
  }
]

export const Graph_Padding = {
  top: 5,
  bottom: 5,
  left: 5,
  right: 5,
};

export const Graph_Block_Size = {
  width: 60,
  height: 40,
};

export const Graph_Block_Size_Placeholder = {
  width: 150,
  height: 120,
}

export const Graph_Block_Ellipsis_Height = 20;
export const Graph_Block_Margin = 5;


// export const EXAMPLE_DATA = [
//   {
//     id: "crime",
//     name: "US Crime Rate By State (2004--2008)",
//     url: "http://localhost:5000/dataset/crime",
//   },
// ];

// export const EXTRACT_URL = "http://localhost:5000/extract";
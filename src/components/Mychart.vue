<template>
  <div :id="chartId" style="height: 100px"></div>
</template>

<script>
import { transform } from "echarts-stat";
import * as ecStat from "echarts-stat";
import * as echarts from "echarts";
export default {
  name: "Mychart",
  props: {
    chartId: String,
    attr: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    console.log(this.attr.fullValues);
    if (this.attr.fullValues.length <= 1 || this.attr.dataType == "categorical") {
      this.drawLine_barchart(this.attr.fullValues);
    } else {
      this.drawLine_histogram(this.attr.fullValues);
    }
  },
  methods: {
    drawLine_barchart(valueList) {
      let newList = Array.from(new Set(valueList));
      let len = 0;
      newList.forEach((item) => {
        len += String(item).length;
      });
      let el = document.getElementById(this.chartId);
      el.style.width = `${len * 8 + 80 > 170 ? len * 8 + 80 : 170}px`;
      let myChart = echarts.init(el);
      let tmp = [];
      let dict = {};
      for (let i = 0; i < valueList.length; i++) {
        dict[valueList[i]] = dict[valueList[i]] ? dict[valueList[i]] + 1 : 1;
      }
      for (let i = 0; i < newList.length; i++)
        tmp.push(dict[newList[i]] ? dict[newList[i]] : 0);
      let labels = [];
      for (let i = 0; i < newList.length; i++) {
        let str = String(newList[i]);
        if (str.length > 6) str = str.slice(0, 6) + "...";
        labels.push(str);
      }
      var option = {
        grid: {
          left: 10,
          right: 0,
          top: 10,
          bottom: 10,
          containLabel: true,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            show: true,
          },
        },
        xAxis: {
          type: "category",
          data: labels,
          axisLabel: {
            interval: 0,
          },
        },
        dataZoom: labels.length <= 8 ? [] : [
          //滑动条
          {
            id: "dataZoomX",
            show: true, //是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
            backgroundColor: "rgba(47,69,84,0)", //组件的背景颜色
            type: "inside", //slider表示有滑动块的，inside表示内置的
            fillerColor: "rgba(167,183,204,0.4)", //选中范围的填充颜色。
            borderColor: "#ddd", //边框颜色。
            filterMode: "filter", //'filter'：当前数据窗口外的数据，被 过滤掉。即 会 影响其他轴的数据范围。每个数据项，只要有一个维度在数据窗口外，整个数据项就会被过滤掉。
            //'weakFilter'：当前数据窗口外的数据，被 过滤掉。即 会 影响其他轴的数据范围。每个数据项，只有当全部维度都在数据窗口同侧外部，整个数据项才会被过滤掉。
            //'empty'：当前数据窗口外的数据，被 设置为空。即 不会 影响其他轴的数据范围。
            //'none': 不过滤数据，只改变数轴范围。
            xAxisIndex: 0, //设置 dataZoom-inside 组件控制的 x轴,可以用数组表示多个轴
            // yAxisIndex:[0,2],                        //设置 dataZoom-inside 组件控制的 y轴,可以用数组表示多个轴
            radiusAxisIndex: 3, //设置 dataZoom-inside 组件控制的 radius 轴,可以用数组表示多个轴
            angleAxisIndex: [0, 2], //设置 dataZoom-inside 组件控制的 angle 轴,可以用数组表示多个轴
            start: 30, //数据窗口范围的起始百分比,表示30%
            end: 70, //数据窗口范围的结束百分比,表示70%
            startValue: 10, //数据窗口范围的起始数值
            endValue: 100, //数据窗口范围的结束数值。
            orient: "horizontal", //布局方式是横还是竖。不仅是布局方式，对于直角坐标系而言，也决定了，缺省情况控制横向数轴还是纵向数轴。'horizontal'：水平。'vertical'：竖直。
            zoomLock: false, //是否锁定选择区域（或叫做数据窗口）的大小。如果设置为 true 则锁定选择区域的大小，也就是说，只能平移，不能缩放。
            throttle: 100, //设置触发视图刷新的频率。单位为毫秒（ms）。
            zoomOnMouseWheel: true, //如何触发缩放。可选值为：true：表示不按任何功能键，鼠标滚轮能触发缩放。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标滚轮能触发缩放。'ctrl'：表示按住 ctrl 和鼠标滚轮能触发缩放。'alt'：表示按住 alt 和鼠标滚轮能触发缩放。
            moveOnMouseMove: true, //如何触发数据窗口平移。true：表示不按任何功能键，鼠标移动能触发数据窗口平移。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标移动能触发数据窗口平移。'ctrl'：表示按住 ctrl 和鼠标移动能触发数据窗口平移。'alt'：表示按住 alt 和鼠标移动能触发数据窗口平移。
            left: "center", //组件离容器左侧的距离,'left', 'center', 'right','20%'
            top: "top", //组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
            right: "auto", //组件离容器右侧的距离,'20%'
            bottom: "auto", //组件离容器下侧的距离,'20%'
          },
        ],
        series: [
          {
            // name: "2011",
            type: "bar",
            data: tmp,
            barWidth: "35px",
          },
        ],
      };

      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    drawLine_histogram(valueList) {
      echarts.registerTransform(transform.histogram);
      let el = document.getElementById(this.chartId);
      el.style.width = "280px";
      let myChart = echarts.init(el);
      // var girth = [8.3,8.6, 8.8, 10.5, 10.7, 10.8, 11.0, 11.0, 11.1, 11.2, 11.3, 11.4, 11.4, 11.7, 12.0, 12.9, 12.9, 13.3, 13.7, 13.8, 14.0, 14.2, 14.5, 16.0, 16.3, 17.3, 17.5, 17.9, 18.0, 18.0, 20.6];
      var bins = ecStat.histogram(valueList, "sturges");
      // console.log(bins.data);

      var option = {
        color: ["rgb(25, 183, 207)"],
        grid: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 0,
          containLabel: true,
          show: true,
          splitLine: {
            show: true,
            lineStyle: {
              type: "solid",
            },
          },
        },
        xAxis: {
          // boundaryGap: '5%',
          scale: true, //这个一定要设，不然barWidth和bins对应不上
          axisLabel: {
            rotate: 15,
          },
        },
        yAxis: {},
        series: [
          {
            name: "height",
            type: "bar",
            barWidth: "99.3%",
            // barCategoryGap: 0,
            // label: {
            // 	normal: {
            // 		show: true,
            // 		position: 'insideTop'
            // 	}
            // },
            data: bins.data,
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      // setTimeout(function (){
      // 		window.onresize = function () {
      // 			myChart.resize();
      // 		}
      // },200)
    },
  },
};
</script>

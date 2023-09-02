<template>
  <div :id="chartId" style="height: 100px;"></div>
</template>

<script>
import { transform } from "echarts-stat";
import * as ecStat from "echarts-stat";
import * as echarts from 'echarts'
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
    if (this.attr.fullValues.length <= 1 || this.attr.dataType == 'categorical') {
      this.drawLine_barchart(this.attr.fullValues);
    } else {
      this.drawLine_histogram(this.attr.fullValues);
    }
  },
  methods: {
    drawLine_barchart(valueList) {
			let newList = Array.from(new Set(valueList));
			let len = 0;
			newList.forEach(item => {
				len += String(item).length
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
          data: newList,
          axisLabel: {
            interval: 0,
          },
        },
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
			window.addEventListener("resize",function(){
				myChart.resize();
			});
    },
    drawLine_histogram(valueList) {
      echarts.registerTransform(transform.histogram);
			let el = document.getElementById(this.chartId);
			el.style.width = '280px';
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
              type: 'solid'
            }
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
			window.addEventListener("resize",function(){
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
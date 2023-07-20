<script setup>
import HeaderView from './views/HeaderView.vue'
import DataView from './views/DataView.vue'
import ConfigView from './views/ConfigView.vue'
import TargetView from './views/TargetView.vue'
</script>

<template>
  <div id="header-container">
    <HeaderView />
  </div>
  <div id="body-container">
    <div id="dataview-container">
      <DataView />
    </div>
    <div id="configview-container">
      <ConfigView />
    </div>
    <div id="targetview-container">
      <TargetView />
    </div>
  </div>
</template>

<style>
#app {
  height: 100%;
}

#header-container {
  width: 100%;
  height: 50px;
  line-height: 20px;
  display: flex;
  flex-direction: column;
  background-color: #c3c3c3;
}

#body-container {
  overflow: hidden;
  width: 100%;
  height: calc(100% - 55px);
  /* position: relative; */
  /* padding-top: 10px; */
  /* display: flex;
  flex-direction: row; */
  /* position: absolute; */
  /* border: 3px solid rgba(0, 0, 0, 0.87); */
  /* border: 1px solid rgba(187, 187, 187, 100); */
}

#dataview-container {
  /* flex: 0 1 200px; */
  display: inline-block;
  width: 20%;
  height: 100%;
  background-color: #ECECEC;
  /* border: 3px solid rgba(0, 0, 0, 0.87); */
}

#configview-container {
  display: inline-block;
  width: 20%;
  height: 100%;
  background-color: #F8F8F8;
  border-left: 1px solid #B7B7B7;
  border-right: 1px solid #B7B7B7;
}

#targetview-container {
  display: inline-block;
  width: 60%;
  height: 100%;
}

.title2 {
  font-size: 18px;
  font-family: Inter-ExtraBold-5, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #F9F9F9;
}
 
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #fff;
}
 
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #dedede;
}

@font-face{
  font-family: 'Inter-Black-3';
  src: url("./assets/fonts/Inter-Black-3.otf");
}

@font-face{
  font-family: 'Inter-Bold-4';
  src: url("./assets/fonts/Inter-Bold-4.otf");
}

@font-face{
  font-family: 'Inter-ExtraBold-5';
  src: url("./assets/fonts/Inter-ExtraBold-5.otf");
}

@font-face{
  font-family: 'Inter-ExtraLight-6';
  src: url("./assets/fonts/Inter-ExtraLight-6.otf");
}

@font-face{
  font-family: 'Inter-Light-7';
  src: url("./assets/fonts/Inter-Light-7.otf");
}

@font-face{
  font-family: 'Inter-Medium-8';
  src: url("./assets/fonts/Inter-Medium-8.otf");
}

@font-face{
  font-family: 'Inter-Regular-9';
  src: url("./assets/fonts/Inter-Regular-9.otf");
}

@font-face{
  font-family: 'Inter-SemiBold-10';
  src: url("./assets/fonts/Inter-SemiBold-10.otf");
}

@font-face{
  font-family: 'Inter-Thin-11';
  src: url("./assets/fonts/Inter-Thin-11.otf");
}
</style>

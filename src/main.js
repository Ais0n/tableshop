import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import {Select, Input, Button, message, Card, AutoComplete, Empty, Modal, Radio, Progress, Tag, Spin, Popover, Tooltip, List, Avatar} from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import './assets/icons/iconfont.css';
import { store } from "./store/store.js"
import mitt from 'mitt'

let app = createApp(App)
const bus = mitt()
app.config.globalProperties.$bus = bus
app.use(Select);
app.use(Input);
app.use(Button);
// app.use(Tabs);
// app.use(Icon);
app.use(Card);
app.use(AutoComplete);
app.use(Empty);
app.use(Modal);
app.use(Radio);
app.use(Progress);
app.use(Tag);
app.use(Spin);
app.use(Popover);
app.use(Tooltip);
app.use(List);
app.use(Avatar);
app.use(store);
app.mount('#app')
app.config.globalProperties.$message = message;

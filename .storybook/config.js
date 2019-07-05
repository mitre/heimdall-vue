import { configure } from '@storybook/vue';

import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


// Import your global components.

// import ControlDetail from '../src/components/ControlDetail.vue';
import VxCard from '../src/components/vx-card/VxCard.vue';
import AboutContent from '../src/components/AboutContent.vue';
import CountCard from '../src/components/CountCard.vue';
import SspContent from '../src/components/SspContent.vue';
import ControlStatus from '../src/components/ControlStatus.vue';
import FileReader from '../src/components/FileReader.vue';
import ComplianceChart from '../src/components/ComplianceChart.vue';
import ControlImpact from '../src/components/ControlImpact.vue';
import DataTable from '../src/components/DataTable.vue';
import NavHeader from '../src/components/NavHeader.vue';
import Treemap from '../src/components/Treemap.vue';
import Home from '../src/views/Home.vue';

// Vue.component('ControlDetail',ControlDetail);
Vue.component('AboutContent',AboutContent);
Vue.component('CountCard',CountCard);
Vue.component('SspContent',SspContent);
Vue.component('ControlStatus',ControlStatus);
Vue.component('FileReader',FileReader);
Vue.component('ComplianceChart',ComplianceChart);
Vue.component('ControlImpact',ControlImpact);
Vue.component('DataTable',DataTable);
Vue.component('NavHeader',NavHeader);
Vue.component('Treemap',Treemap);
Vue.component('Home',Home);
Vue.component('VxCard',VxCard);


// Register global components.
// Vue.component('my-button', Mybutton);


// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  console.log("requirements!");
  req.keys().forEach(filename => console.log(filename));
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

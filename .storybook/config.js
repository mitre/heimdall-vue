import { configure } from '@storybook/vue';

import Vue from 'vue';

// Import Vue plugins
import Vuex from 'vuex';

// Import your global components.
import Mybutton from '../src/components/AboutContent.vue';

'../src/App.vue';
import AboutContent from '../src/components/AboutContent.vue';
import ControlDetail from '../src/components/ControlDetail.vue';
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

// Install Vue plugins.
Vue.use(Vuex);

// Register global components.
Vue.component('my-button', Mybutton);


// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

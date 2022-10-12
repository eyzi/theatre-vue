import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { TroisJSVuePlugin } from 'troisjs';

const app = createApp(App);
app.mount('#app');
app.use(TroisJSVuePlugin);

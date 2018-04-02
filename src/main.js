import Vue from 'vue'
import TruffleContract from 'truffle-contract'
import VueRouter from 'vue-router'
Vue.use(VueRouter)


import App from './App.vue'
import Forms from './components/Forms.vue'

const routes = [
    {
        path: '/forms/:type',
        component: Forms
    }
]

const router = new VueRouter({
    routes
})


Object.defineProperty(Vue.prototype, '$TruffleContract', {value: TruffleContract})


new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
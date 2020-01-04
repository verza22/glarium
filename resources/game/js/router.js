import Vue from 'vue'
import VueRouter from 'vue-router'

import City from 'Views/City.vue'
import Island from 'Views/Island.vue'
import World from 'Views/World.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/game/city/:city', name: 'City', component: City },
    { path: '/game/island/:island', name: 'Island', component: Island },
    { path: '/game/world/:x/:y', name: 'World', component: World },
]

export default new VueRouter({
    mode: 'history',
    routes
})

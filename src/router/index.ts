import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutPokemonView from '@/views/AboutPokemonView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about/pokemon/:name',
      name: 'about-pokemon',
      component: AboutPokemonView
    }
  ],
  scrollBehavior: () => {
    window.scrollTo(0, 0)
  }
})

export default router

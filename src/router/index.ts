import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layouts'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/home')
      },
      {
        path: 'catalog',
        name: 'catalog',
        component: () => import('@/pages/catalog')
      },
      {
        path: 'accessories',
        name: 'accessories',
        component: () => import('@/pages/accessories')
      },
      {
        path: 'catalog/:category/:id',
        name: 'catalog.single',
        component: () => import('@/pages/product')
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/pages/about')
      }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'auto'
      }
    }

    return { top: 0 }
  }
})

import Vue from 'vue'
import Router from 'vue-router'
/* import Recommend from '@/components/recommend/recommend'
import Singer from '@/components/singer/singer'
import Rank from '@/components/rank/rank'
import Search from '@/components/search/search'
import SingerDetail from '@/components/singer/components/singerdetail'
import Disc from '@/components/disc/disc'
import RankList from '@/components/rank/components/ranklist'
import userCenter from '@/components/userCenter/userCenter' */

const Recommend = () => import('@/components/recommend/recommend')
const Singer = () => import('@/components/singer/singer')
const Rank = () => import('@/components/rank/rank')
const Search = () => import('@/components/search/search')
const SingerDetail = () => import('@/components/singer/components/singerdetail')
const Disc = () => import('@/components/disc/disc')
const RankList = () => import('@/components/rank/components/ranklist')
const userCenter = () => import('@/components/userCenter/userCenter')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankList
        }
      ]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/userCenter',
      name: 'userCenter',
      component: userCenter
    }
  ]
})

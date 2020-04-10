import Vue from 'vue'
import Router from 'vue-router'


const Login = () =>
    import ('../components/Login/Login');
import Home from '../pages/Home/Home'
import Search from '../pages/Search/Search'
import Movie from '../pages/Movie/Movie'
import SearchMovie from '../pages/Movie/children/SearchMovie'
import MovieDetail from '../components/MovieDetail/MovieDetail'
import CommentPanel from '../components/MovieDetail/children/CommentPanel'
import Cinema from '../pages/Cinema/Cinema'
import DetailCinema from '../pages/Cinema/children/DetailCinema'
import SearchCinema from '../pages/Cinema/children/SearchCinema'
import SelectCinema from '../pages/Cinema/children/SelectCinema'
import SelectSeat from '../pages/Cinema/children/SelectSeat'
import SubmitOrder from '../components/SubmitOrder/SubmitOrder'
import Pay from '../components/Pay/Pay'
import My from '../pages/My/My'
import MyInfo from '../pages/My/children/MyInfo'
import MyOrder from '../pages/My/children/MyOrder'
import MyMovie from '../pages/My/children/MyMovie'
import ModifyUserName from '../pages/My/children/ModifyUserName'
import ModifyUserSign from '../pages/My/children/ModifyUserSign'

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            meta: {
                showTabBar: true,
            }
        },
        {
            path: '/movie',
            name: 'movie',
            component: Movie,
            meta: { showTabBar: true }
        },
        {
            path: '/cinema',
            name: 'cinema',
            component: Cinema,
            meta: { showTabBar: true }
        },
        {
            path: '/my',
            name: 'my',
            component: My,
            meta: { showTabBar: true }
        },
        {
            path: '/my_info',
            name: 'my_info',
            component: MyInfo,
            meta: { showTabBar: true }
        },
        {
            path: '/my_order',
            name: 'my_order',
            component: MyOrder
        },
        {
            path: '/my_movie',
            name: 'my_movie',
            component: MyMovie
        },
        {
            path: '/modify_username',
            name: 'modify_username',
            component: ModifyUserName
        },
        {
            path: '/modify_usersign',
            name: 'modify_usersign',
            component: ModifyUserSign
        },
        {
            path: '/search',
            name: 'search',
            component: Search,
            meta: { showTabBar: true }
        },
        {
            path: '/search_movie',
            component: SearchMovie
        },
        {
            path: '/detail_movie',
            name: 'detail_movie',
            component: MovieDetail,
            meta: { showTabBar: true }
        },
        {
            path: '/detail_cinema',
            component: DetailCinema,
            meta: {
                showTabBar: true,
            }
        },
        {
            path: '/cinema_select',
            component: SelectCinema,
            meta: { showTabBar: true }
        },
        {
            path: '/select_seat',
            component: SelectSeat,
            meta: { showTabBar: true }
        },
        {
            path: '/comment_panel',
            component: CommentPanel
        },
        {
            path: '/search_cinema',
            component: SearchCinema
        },
        {
            path: '/submit_order',
            component: SubmitOrder,
            meta: { showTabBar: true }
        },
        {
            path: '/pay',
            component: Pay,
            meta: { showTabBar: true }
        },
        {
            path: '/login',
            component: Login
        },
    ]
})
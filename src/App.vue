<template>
  <div id="app">
    <tab-bar v-if="$route.meta.showTabBar" />
    <router-view />
    <tail v-if="$route.meta.showTabBar"/>
  </div>
</template>

<script>
import TabBar from './components/TabBar/TabBar'
import Tail from './components/Tail/Tail'
import 'mint-ui/lib/style.css'
export default {
  name: 'App',
  components: {
    TabBar,
    Tail
  },
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#app {
  width: 100%;
  height: 100%;
}
</style>

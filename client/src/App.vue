<template>
  <div id="app">
    <div id="nav">
      <router-link class="router" to="/">Home</router-link>
      <a class="source" href="https://github.com/duanyytop/ckb-oracle-bridge" target="_blank">GitHub</a>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  background: black;
  height: 60px;
  line-height: 60px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;

  a {
    color: white;
    text-decoration: none;
  }

  .router {
    font-size: 24px;
    font-weight: 600;
  }

  .source {
    font-size: 16px;
    font-weight: 600;
  }
}
</style>

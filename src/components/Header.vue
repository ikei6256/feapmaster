<template>
  <nav class="navbar mb-3">
    <div class="container-sm pl-0 pr-0 pl-sm-2 pr-sm-2">
      <router-link :to="{ name: 'Home' }">
        <!-- <span class="navbar-brand mb-0 h1">FEAPMaster</span> -->
        <img src="/img/logo.png" alt="FE AP Master" />
      </router-link>
      <!-- <div>
        <router-link :to="{ name: 'Signin' }">
          <button class="btn btn-success">ログイン</button>
        </router-link>
      </div> -->
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
img {
  height: 2rem;
}
</style>

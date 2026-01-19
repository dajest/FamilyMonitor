<template>
  <div class="home-page">
    <h2>{{ $t('home.welcome') }}</h2>
    <p>{{ $t('home.description') }}</p>
  </div>
</template>

<script setup>
// Home page content
</script>

<style lang="scss" scoped>
.home-page {
  max-width: 1440px;
  margin: 0 auto;

  h2 {
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.87);
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
  }
}

[data-theme="light"],
:root:not([data-theme="dark"]) {
  .home-page {
    h2 {
      color: #213547;
    }

    p {
      color: #666;
    }
  }
}
</style>
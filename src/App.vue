<script setup lang="ts">
import './assets/global.scss'
</script>

<template>

    <header id="head-navbar">

        <router-link :to="{ name: 'home' }">

            <img src="/images/icon-k.png" alt="Logo K" draggable="false" />

            <img src="/images/kotas/kotas.png" alt="Logo Kotas" draggable="false" />

        </router-link>
        
    </header>

    <section class="container">

        <router-view></router-view>

    </section>

</template>

<style lang="scss">
body {
  padding-top: 48px;
}

#head-navbar {
    display: flex;
    align-items: center;
    padding: 6px;
    z-index: 10;

    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 48px;

    /* Branco */

    background: #FFFFFF;
    box-shadow: 0px 1px 1px #E1E1E1;

    @media screen and (max-width: 766px) {
        justify-content: center;
    }
}
</style>
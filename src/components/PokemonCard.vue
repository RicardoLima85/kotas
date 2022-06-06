<script lang="ts">
import { defineComponent } from "vue";
import LoadingBox from "./LoadingBox.vue";

export default defineComponent({
    props: {
        pokemon: {
            type: <any> Object,
            required: true
        }
    },
    mounted() {
        this.getInfoPokemon();
    },
    data: () => ({
        infoPokemon: <any> null,
        loading: false
    }),
    methods: {
        getInfoPokemon() {
            this.loading = true;
            
            fetch(this.pokemon.url)
                .then((res) => res.json())
                .then((data) => {
                this.infoPokemon = data;
            })
            .finally(() => this.loading = false);
        }
    },
    components: { LoadingBox }
})
</script>

<template>

    <router-link :to="{ name: 'about-pokemon', params: { name: pokemon.name} }" class="pokemon-card">

        <LoadingBox v-if="loading"></LoadingBox>

        <img v-if="infoPokemon != null" 
            :src="`${ infoPokemon.sprites.other['official-artwork'].front_default }`"
            :alt="`${ pokemon.name }`"
            loading="lazy"
            draggable="false" />

        <h3>{{ pokemon.name }}</h3>

        <h5 v-if="infoPokemon != null">Cód: {{ infoPokemon.id }}</h5>

        <div v-if="infoPokemon != null" class="pokemon-card-types">

            <span v-for="(typ, i) in infoPokemon.types" :key="i" :class="`pokemon-card-type ${typ.type.name}`">
                {{ typ.type.name }}
            </span>

        </div>

    </router-link>

</template>

<style lang="scss">
.pokemon-card {
    position: relative;
    display: block;
    text-decoration: none;
    width: 153px;
    height: 190px;
    padding: 12px;
    margin: 0 3.9px 22px;
    background: #FFFFFF;
    box-shadow: 0px 4px 20px #E1E1E1;
    border-radius: 8px;
    color: #272727;

    h3 {
        text-transform: capitalize;
        text-align: center;
        margin: 10px 0;
        font-size: 14px;
    }

    h5 {
        text-align: center;
        font-size: 9px;
        font-family: 'Quicksand', sans-serif;
    }

    img {
        margin: 0 auto;
        display: block;
        width: 50px;
    }
}
</style>
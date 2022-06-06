<script setup lang="ts">
// aqui um exemplo de composition api
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import LoadingBox from '../components/LoadingBox.vue';

const route = useRoute()

const namePokemon = ref(route.params.name)
const infoPokemon = ref<any>(null)
const abilitiesPokemon = ref<any>([])

const getInfoPokemon = function () {
    return new Promise((resolve) => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${namePokemon.value}`)
            .then((res) => res.json())
            .then((data) => {
                infoPokemon.value = data
                resolve(infoPokemon.value)
            })
    })
}

const getAbilities = function (pokemon: any) {
    pokemon.abilities.forEach((ability: any) => {
        fetch(ability.ability.url)
            .then((res) => res.json())
            .then((data) => {
                abilitiesPokemon.value = abilitiesPokemon.value.concat(data.effect_entries)
            })
    });
}

onMounted(function () {
    getInfoPokemon()
        .then(getAbilities)
})
</script>

<template>

    <div class="card-ability">

        <LoadingBox v-if="infoPokemon == null"></LoadingBox>

        <img v-if="infoPokemon != null" :src="infoPokemon.sprites.other['official-artwork'].front_default" :alt="`${namePokemon}`" />

        <h2 style="margin-bottom: 60px">{{ namePokemon }}</h2>

        <div v-if="infoPokemon != null" class="pokemon-card-types">

            <span v-for="(typ, i) in infoPokemon.types" :key="i" :class="`pokemon-card-type ${typ.type.name}`">
                {{ typ.type.name }}
            </span>

        </div>

    </div>

    <div class="card-ability">

        <h2 style="margin-bottom: 20px">Habilidades</h2>

        <ul>

            <li v-for="(ability, i) in abilitiesPokemon" :key="i">
                {{ ability.short_effect }}
            </li>

        </ul>

    </div>

    <div id="box-back-button">

        <router-link :to="{ name: 'home' }">Voltar</router-link>

    </div>

</template>

<style lang="scss">
.card-ability {
    position: relative;
    width: 100%;
    max-width: 540px;
    margin: 20px auto;
    background: #FFFFFF;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    padding: 20px;
    
    h2 {
        font-size: 14px;
        text-align: center;
        text-transform: capitalize;
    }

    img {
        display: block;
        width: 185px;
        margin: 0 auto;
    }

    ul {
        list-style-type: none;

        li {
            font-size: 12px;
            padding: 16px 0;
            border-top: 1px solid #F1F4F5;
        }
    }
}

#box-back-button {
    text-align: center;
    margin: 32px 0;

    a {
        text-decoration: none;
        color: #00A3FF;
        font-weight: bold;
        font-size: 14px;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
<script lang="ts">
import { defineComponent, computed, reactive } from 'vue';
import LoadingBox from '../components/LoadingBox.vue';
import PokemonCard from '../components/PokemonCard.vue';
import VueBasicAlert from 'vue-basic-alert'
import { useHead } from '@vueuse/head';

export default defineComponent({
    setup() {
        const siteData = reactive({
            title: 'Kotas',
            description: 'Busca de pokémons'
        })

        useHead({
            title: computed(() => siteData.title),
            meta: [
                {
                    name: 'description',
                    content: computed(() => siteData.description)
                }
            ]
        })
    },
    name: 'HomeView',
    mounted() {
        this.getPekemons()
            .then(this.createPokemonPages);

        window.onscroll = () => {

            // verifica se a pagina não é a home
            // para não ser executada em outras páginas
            if (this.$route.name != 'home') {
                return false;
            }

            let buttonToTop = <any> this.$refs.button_to_top

            if (document.documentElement.scrollTop > 600) {
                buttonToTop.classList.add('show-button')
            } else {
                buttonToTop.classList.remove('show-button')
            }

        }
    },
    data: () => ({
        inputSearch: "",
        loading: false,
        loadingButtonSearch: false,
        pokemons: <any> [],
        pokemonPages: <any> [],
        currentPage: <any> null,
        currentPageNumber: 0
    }),
    methods: {
        getPekemons() {
            return new Promise((resolve) => {

                this.loading = true;
                
                fetch("https://pokeapi.co/api/v2/pokemon?limit=144")
                    .then((res) => res.json())
                    .then((data) => {
                        this.pokemons = data.results
                        resolve(data.results)
                    })
                    .finally(() => this.loading = false);
            })
        },
        validSearchAndDo() {
            if (this.inputSearch.trim() == '') {
                return false;
            }

            if (isNaN((this.inputSearch as any))) {
                this.searchPokemonByName(this.inputSearch)
                    .then(this.createPokemonPages)
            } else {
                this.searchPokemonByNumberAndRedirectToInfo()
            }
        },
        searchPokemonByNumberAndRedirectToInfo() {
            this.loadingButtonSearch = true;

            fetch(`https://pokeapi.co/api/v2/pokemon/${ this.inputSearch.trim().toLowerCase() }`)
                .then((res) => {
                    if (res.ok) {
                        return res.json()
                    }

                    throw new Error()
                })
                .then((data) => {
                    this.$router.push({ name: 'about-pokemon', params: { name: data.name } })
                })
                .catch(() => {
                    (this.$refs as any).alert.showAlert('error', 'Pokémon não encontrado.', 'Houve um erro')
                })
                .finally(() => this.loadingButtonSearch = false);
        },
        searchPokemonByName(name: string) {
            return new Promise((resolve) => {
                let searchRegularExpression = new RegExp(`${name}+`, 'gi')
    
                let foundPokemons = this.pokemons.filter((pokemon: any) => 
                    searchRegularExpression.test(pokemon.name))

                if (foundPokemons.length > 0) {
                    resolve(foundPokemons)
                }
            })
        },
        createPokemonPages(pokemons: any) {
            let totItemByPage = Math.ceil(pokemons.length / 6) == 24 ? 24 : pokemons.length
            let page = <any>[]
            let pages = <any>[]

            pokemons.forEach((pokemon: any) => {
                if (page.length < totItemByPage) {
                    page.push(pokemon)
                } 
                
                if (page.length == totItemByPage) {
                    pages.push(page)

                    page = []
                }
            })

            this.pokemonPages = pages
            this.currentPageNumber = 0
            this.currentPage = pages[0]
        },
        setPagePokemon(page: number) {
            this.currentPage = this.pokemonPages[page]
            this.currentPageNumber = page
        },
        prevPage() {
            if (this.currentPageNumber > 0) {
                this.currentPageNumber -= 1
                this.currentPage = this.pokemonPages[this.currentPageNumber]
            }
        },
        nextPage() {
            if (this.currentPageNumber < (this.pokemonPages.length - 1)) {
                this.currentPageNumber += 1
                this.currentPage = this.pokemonPages[this.currentPageNumber]
            }
        },
        // dispara o metodo de pesquisa ao pressionar "Enter"
        keyPressInputSearch(event: any) {
            if (event.keyCode == 13) {
                this.validSearchAndDo()
            }
        },
        clearAllSearch() {
            this.inputSearch = '';

            this.createPokemonPages(this.pokemons)
        },
        toTop() {
            window.scrollTo(0, 0);
        }
    },
    components: { LoadingBox, PokemonCard, VueBasicAlert }
})
</script>

<template>
    
    <div id="box-input-search">

        <input v-model="inputSearch" type="text" placeholder="Pesquise por nome ou código" @keypress="keyPressInputSearch" />

        <!-- se o campo de pesquisa não está vazio -->
        <div v-if="!!inputSearch.trim()" style="display: flex; align-items: center;">

            <button @click="clearAllSearch">
                <box-icon name='x' color="#616161"></box-icon>
            </button>
    
            <div class="vr"></div>

        </div>

        <button @click="validSearchAndDo" :disabled="loadingButtonSearch">
            <box-icon v-if="loadingButtonSearch" name='loader-alt' color="#616161" animation="spin"></box-icon>

            <box-icon v-else name='search' color="#616161"></box-icon>
        </button>

    </div>

    <h2>Pokémons</h2>

    <LoadingBox v-if="loading"></LoadingBox>

    <div v-if="currentPage != null" id="box-pokemon-cards">
        <PokemonCard v-for="(pk, i) in currentPage" :key="i" :pokemon="pk"></PokemonCard>
    </div>

    <!-- Botões de paginação -->
    <div id="box-pagination">

        <button class="box-pagination-control" @click="toTop(); prevPage()">
            <box-icon name='skip-previous' ></box-icon>
        </button>

        <div id="box-pagination-items">
            <button v-for="(page, i) in pokemonPages" :key="i"
                @click="toTop(); setPagePokemon(i)" class="box-pagination-item-button"
                :class="{ active: currentPageNumber == i }">
                {{ i+1 }}
            </button>
        </div>

        <button class="box-pagination-control" @click="toTop(); nextPage()">
            <box-icon name='skip-next'></box-icon>
        </button>

    </div>

    <!-- botão para voltar ao topo da página -->
    <button id="button-to-top" @click="toTop" ref="button_to_top">
        <box-icon type='solid' name='arrow-to-top' color="#ffffff"></box-icon>
    </button>

    <!-- componente de alertas -->
    <vue-basic-alert 
       :duration="300"
       :closeIn="10000"
       ref="alert" />

</template>

<style scoped lang="scss">

#box-input-search {
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 50px;
    border: 1px solid #E1E1E1;
    overflow: hidden;
    margin: 0 auto;
    
    input {
        padding: 10px 20px;
        width: 100%;
        height: 50px;
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        padding: 10px 16px;
        cursor: pointer;
        background-color: white;
        color: #616161;
        font-weight: bold;

        &:hover {
            background-color: #f3f3f3;
        }
    }

}

h2 {
    font-size: 14px;
    margin: 25px auto;
}

#box-pokemon-cards {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;

    @media screen and (max-width: 760px) {
        justify-content: center;
    }
}


#box-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px 0;

    button {
        cursor: pointer;
        background-color: white;

        &:hover {
            background-color: #efefef;
        }

        &.active {
            background-color: #dadada;
        }
    }

    .box-pagination-control {
        display: flex;
        align-items: center;
        padding: 6px;
        border-radius: 50%;
        margin: 0 10px;
        border: 1px solid #E1E1E1;
    }

    #box-pagination-items {
        border: 1px solid #E1E1E1;
        border-radius: 8px;

        .box-pagination-item-button {
            padding: 6px 12px;

            &:first-child {
                border-radius: 8px 0 0 8px;
            }

            &:last-child {
                border-radius: 0 8px 8px 0;
            }
        }
    }
}

#button-to-top {
    display: none;
    position: fixed;
    border-radius: 50%;
    height: 60px;
    width: 60px;
    right: 10px;
    bottom: 80px;
    background-color: #30455C;

    &:hover {
        background-color: #0f3359;
    }

    &.show-button {
        display: block;
    }
}
</style>
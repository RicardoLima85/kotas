<template>

    <div class="box-loading">

        <box-icon name='loader-alt' animation="spin"></box-icon>

        <em>Carregando...</em>

    </div>

</template>

<style lang="scss">

.box-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 160px;

    em {
        font-size: 10pt;
        margin-left: 8px;
        color: #616161;
    }
}

</style>
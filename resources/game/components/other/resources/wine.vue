<template>
    <div class="d-inline-block" :title="$t('resources.wine')">
        <img :src="require('Img/icon/icon_wine.png')"> {{$money(cant)}}
    </div>
</template>

<script>
export default {
    name:'wine',
    props:['cant']
}
</script>
<template>
    <div class="d-inline-block" :title="$t('resources.glass')">
        <img :src="require('Img/icon/icon_glass.png')"> {{$money(cant)}}
    </div>
</template>

<script>
export default {
    name:'glass',
    props:['cant']
}
</script>
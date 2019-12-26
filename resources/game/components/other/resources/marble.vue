<template>
    <div class="d-inline-block" :title="$t('resources.marble')">
        <img :src="require('Img/icon/icon_marble.png')"> {{$money(cant)}}
    </div>
</template>

<script>
export default {
    name:'marble',
    props:['cant']
}
</script>
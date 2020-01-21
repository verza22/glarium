<template>
    <div class="d-inline-block" :title="$t('resources.marble')" v-if="cant>0||visible||disabled">
        <img :src="require('Img/icon/icon_marble.png')" :class="disabled ? 'opacity-5' : ''"> {{$money(cant)}}
    </div>
</template>

<script>
export default {
    name:'marble',
    props:{
        cant:Number,
        visible:{
            type:Boolean,
            default:false
        },
        disabled:{
            type:Boolean,
            default:false
        }
    }
}
</script>

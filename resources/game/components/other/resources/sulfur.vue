<template>
    <div class="d-inline-block" :title="$t('resources.sulfur')" v-if="cant>0||visible||disabled">
        <img :src="require('Img/icon/icon_sulfur.png')" :class="disabled ? 'opacity-5' : ''"> {{$money(cant)}}
    </div>
</template>

<script>
export default {
    name:'sulfur',
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

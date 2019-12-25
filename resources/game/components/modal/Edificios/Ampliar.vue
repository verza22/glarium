<template>
    <div class="box">
        <div class="d-flex justify-content-center">
            <div>
                <div><img :src="require('Img/icon/btn_upgrade.jpg')"></div>
                <div>Ampliar</div>
            </div>
            <div class="px-2">
                <div>Nivel</div>
                <div class="number">3</div>
            </div>
            <div>
                <div><img :src="require('Img/icon/btn_downgrade.jpg')"></div>
                <div>Demoler</div>
            </div>
        </div>
        <div class="text-center mt-3">{{$t('building.upgrade', { level: info.level })}}</div>
        <div class="my-2">
            <div class="d-inline-block" :title="$t('resources.wood')" v-if="info.wood!=0"><img :src="require('Img/icon/icon_wood.png')"> {{info.wood}}</div>
            <div class="d-inline-block" :title="$t('resources.wine')" v-if="info.wine!=0"><img :src="require('Img/icon/icon_wine.png')"> {{info.wine}}</div>
            <div class="d-inline-block" :title="$t('resources.marble')" v-if="info.marble!=0"><img :src="require('Img/icon/icon_marble.png')"> {{info.marble}}</div>
            <div class="d-inline-block" :title="$t('resources.glass')" v-if="info.glass!=0"><img :src="require('Img/icon/icon_glass.png')"> {{info.glass}}</div>
            <div class="d-inline-block" :title="$t('resources.sulfur')" v-if="info.sulfur!=0"><img :src="require('Img/icon/icon_sulfur.png')"> {{info.sulfur}}</div>
        </div>
        <div class="text-center" :title="$t('resources.time')" v-if="info.time!=0"><img :src="require('Img/icon/icon_time.png')"> {{$sectotime(info.time)}}</div>
    </div>
</template>

<script>
export default {
    name:'Ampliar',
    props:['info']
}
</script>

<style lang="scss" scoped>
    .box{
        font-size: 0.83rem;
        padding: 12px 20px!important;
    }
    .number{
        text-align: center;
        font-size: 1.8rem;
        font-weight: bold;
        line-height: 1.8rem;
    }
</style>
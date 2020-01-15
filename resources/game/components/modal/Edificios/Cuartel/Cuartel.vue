<template>
    <div class="box">
        <div class="gtitle text-center mb-3">Formar unidades</div>
        <div v-for="(unit,index) in data.units" :key="index">
            <div class="d-flex celda">
                <div class="flex-1">
                    <img :src="require(`Img/unit/${unit.id}.png`)">
                </div>
                <div class="flex-5 box2">
                    <div class="gtitle">{{$t(`units[${unit.id}].name`)}}</div>
                    <div class="texto">{{$t(`units[${unit.id}].text`)}}</div>
                    <hr class="hred">
                </div>
                <div class="flex-2">3</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'Cuartel',
    props:['data']
}
</script>

<style lang="scss" scoped>
    .box{
        font-size: 0.83rem
    }
    .celda{
        text-align: justify;
    }
    .texto{
        line-height: 1rem;
        margin-top: 5px;
    }
    .box2{
        padding: 0px 20px
    }
</style>

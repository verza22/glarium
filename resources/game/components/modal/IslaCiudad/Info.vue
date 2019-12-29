<template>
    <div class="box">
        <div class="d-flex my-1">
            <div class="flex-1">{{$t('actions.info.name')}}:</div>
            <div class="flex-2">{{data.city.name}} ({{data.city.level}})</div>
        </div>
        <div class="d-flex my-1">
            <div class="flex-1">{{$t('actions.info.player')}}:</div>
            <div class="flex-2">{{data.city.user}}</div>
        </div>
        <div class="d-flex my-1">
            <div class="flex-1">{{$t('actions.info.alliance')}}:</div>
            <div class="flex-2">-</div>
        </div>
        <div class="d-flex my-1">
            <div class="flex-1">{{$t('actions.info.points')}}:</div>
            <div class="flex-2">-</div>
        </div>
    </div>
</template>

<script>
export default {
    name:'Info',
    props:['data']
}
</script>

<style lang="scss" scoped>
    .box{
        font-size: 0.83rem;
        line-height: 0.83rem;
    }
</style>

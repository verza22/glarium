<template>
    <div class="conte">
        <div>
            <div class="text-left mb-2">¿Estás seguro?</div>
            <div>
                <div class="btnGeneral" @click='close(data)'>Cancelar</div>
                <div class="btnGeneral" @click='confirm(data)'>Confirmar</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'Confirmar',
    props:['close','confirm','data']
}
</script>

<style lang="scss" scoped>
    .conte{
        position: absolute;
        background: #dfc594;
        color: #212529;
        width: 200px;
        right: 50px;
        top: -5px;
        padding: 6px 12px;
        font-size: 0.70rem;
    }
    .btnGeneral{
        display: inline-block;
        padding: 5px;
    }
</style>

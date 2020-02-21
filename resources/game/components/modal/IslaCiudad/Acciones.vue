<template>
    <div>
        <div class="mHeader2">
            <div class="gtitle">{{$t('actions.title')}}</div>
        </div>
        <div class="py-2">
            <div class="box-acciones" v-if='!data.city.type'>
                <div class="btn-accion" :title="$t('actions.diplomacy')" @click='changeType(1)'>
                    <div class="btn-image btn-diplomacy"></div>
                    <div class="mt-1">{{$t('actions.diplomacy')}}</div>
                </div>
            </div>
            <div class="box-acciones">
                <div class="btn-accion" :title="$t('actions.transport')" @click='changeType(2)'>
                    <div class="btn-image btn-transport"></div>
                    <div class="mt-1">{{$t('actions.transport')}}</div>
                </div>
            </div>
            <div class="box-acciones" v-if='!data.city.type'>
                <div class="btn-accion" :title="$t('actions.defend')">
                    <div class="btn-image btn-defend" :class="exists_units ? '' : 'inactive'"></div>
                    <div class="mt-1">{{$t('actions.defend')}}</div>
                </div>
            </div>
            <div class="box-acciones" v-if='!data.city.type'>
                <div class="btn-accion" :title="$t('actions.attack')">
                    <div class="btn-image btn-attack" :class="exists_units ? '' : 'inactive'"></div>
                    <div class="mt-1">{{$t('actions.attack')}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $city from 'Stores/city'
import $unit from 'Stores/unit'

export default {
    name:'Acciones',
    props:['changeType','data'],
    computed:{
        city_id(){
            return $city.state.city_id
        },
        exists_units(){
            return $unit.getters.getUnits(this.city_id).length > 0
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '~Sass/modal';
    .box-acciones{
        width: 49%;
        display: inline-block;
        text-align: center;
    }
    .btn-image{
        width: 50px;
        height: 34px;
        margin: auto;
    }
    .btn-accion:hover .btn-image{
        background-position-y: center;
    }
    .inactive{
        background-position-y: bottom!important;
    }
    .btn-transport{
        background-image: url('~Img/island/transport.jpg');
    }
    .btn-diplomacy{
        background-image: url('~Img/island/diplomacy.jpg');
    }
    .btn-defend{
        background-image: url('~Img/island/defend.jpg');
    }
    .btn-attack{
        background-image: url('~Img/island/attack.jpg');
    }
    .btn-accion{
        font-size: 0.7rem;
        line-height: 0.7rem;
        display: inline-block;
        padding: 8px;
        cursor: pointer;
    }
</style>

<template>
  <div class="marcoSuperior d-flex">
      <div class="flex-1">
          <div class="premium"></div>
          <div class="ships"></div>
          <div class="gold"></div>
      </div>
      <div class="flex-4 d-flex flex-column">
          <div class="flex-2 d-flex">
              <div class="flex-2 d-flex flex-column btn-navi-popu">
                  <Cities></Cities>
                  <div class="flex-1 d-flex">
                    <ActionPoint></ActionPoint>
                    <Population></Population>
                  </div>
              </div>
              <Buttons></Buttons>
          </div>
        <Resources></Resources>
      </div>
  </div>
</template>

<script>
    import axios from 'axios'
    import Resources from 'Components/layout/navigation/Resources.vue'
    import Population from 'Components/layout/navigation/Population.vue'
    import ActionPoint from 'Components/layout/navigation/ActionPoint.vue'
    import Cities from 'Components/layout/navigation/Cities.vue'
    import Buttons from 'Components/layout/navigation/Buttons.vue'

    export default {
        name:'Navegacion',
        components:{
            Resources,
            Population,
            ActionPoint,
            Cities,
            Buttons
        }
    }
</script>

<style lang="css" scoped>
    .marcoSuperior{
        font-size: 0.83rem;
        z-index: 2;
        width: 600px;
        padding: 25px 40px 10px 10px;
        border-radius: 5px;
        position: absolute;
        background-repeat: no-repeat;
        background-image: url('~Img/icon/navegacion_fondo.png');
    }
    .ships{
        background-image: url('~Img/icon/ships.jpg');
        width: 110px;
        height: 30px;
    }
    .gold{
        background-image: url('~Img/icon/gold.jpg');
        width: 110px;
        height: 30px;
    }
    .premium{
        background-image: url('~Img/icon/premium.png');
        width: 110px;
        height: 30px;
        background-size: cover;
    }
    .btn-navi-popu{
        padding-left: 2px;
    }
</style>
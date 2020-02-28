<template>
  <div class="marcoSuperior d-flex">
      <UserResources></UserResources>
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
    import UserResources from 'Components/layout/navigation/UserResources.vue'

    export default {
        name:'Navegacion',
        components:{
            Resources,
            Population,
            ActionPoint,
            Cities,
            Buttons,
            UserResources
        }
    }
</script>

<style lang="css" scoped>
    .marcoSuperior{
        font-size: 0.83rem;
        z-index: 2;
        width: 600px;
        padding: 18px 40px 20px 10px;
        border-radius: 5px;
        position: absolute;
        background-repeat: no-repeat;
        background-image: url('~Img/icon/navegacion_fondo.png');
    }
    .btn-navi-popu{
        padding-left: 6px;
    }
</style>

<template>
  <div class="fixed-top">
    <div class="opciones">Opciones</div>
    <div class="marco">
      <Navegacion></Navegacion>
      <Consejeros></Consejeros>
    </div>
  </div>
</template>

<script>
import Consejeros from "Components/layout/Consejeros.vue";
import Navegacion from "Components/layout/Navegacion.vue";

export default {
  components: {
    Consejeros,
    Navegacion
  }
};
</script>
<style scoped>
.weight {
  font-weight: bold;
}
.opciones {
  width: 100%;
  text-align: center;
  background: white;
}
.marco{
  position: relative;
}
</style>
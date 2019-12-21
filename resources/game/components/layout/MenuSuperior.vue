<template>
  <div class="fixed-top">
    <div class="opciones">Opciones</div>
    <Navegacion></Navegacion>

    <Consejeros></Consejeros>

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
  position: fixed;
  width: 100%;
  text-align: center;
  background: white;
}
</style>
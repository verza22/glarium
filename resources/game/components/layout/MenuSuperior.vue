<template>
  <div class="fixed">
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
.fixed{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100%;
}
</style>
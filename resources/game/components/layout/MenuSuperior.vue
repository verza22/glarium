<template>
  <div class="fixed">
    <div class="opciones gtitle">
      <div class="opcion">Clasificación</div>
      <div class="opcion">Opciones</div>
      <div class="opcion">Foro</div>
      <div class="opcion">Salir</div>
      <div class="opcion">Salir</div>
      <div class="opcion">v1.0.0</div>
      <div class="fecha">Fecha</div>
    </div>
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
<style lang='scss' scoped>
.marco{
  position: relative;
  bottom: 25px;
}
.fixed{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100%;
}
.opciones {
  font-weight: 500;
  font-size: 11px;
  height: 45px;
  display: flex;
  justify-content: center;
  background-image: url('~Img/icon/header_bg.jpg');
}
.opcion,.fecha{
  padding: 5px 25px;
}
.opcion:hover{
  text-decoration: underline;
  cursor: pointer;
}
.fecha{
  cursor: default;
}
</style>
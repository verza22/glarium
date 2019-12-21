<template>
  <div class="float-right marcoSuperior">
    <div class="d-inline-block marco" v-for="index in 4" :key='index'>
      <div
        class="consejeros"
        v-bind:style="{'background-image': backgroundImage(index-1)}"
      ></div>
      <div class="nombre">{{$t(`advisor[${index-1}]`)}}</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    backgroundImage(imagen) {
      return "url(/img/advisor/" + imagen + ".png)";
    }
  }
};
</script>

<style lang="css" scoped>
.marcoSuperior {
  z-index: 2;
  position: relative;
  margin-top: 24px;
}
.consejeros {
  height: 90px;
  width: 90px;
  background-repeat: no-repeat;
  background-position: center;
}
.nombre {
  width: 100%;
  text-align: center;
  background: #cecece;
  border: 1px solid #cecece;
}
.marco:hover {
  background: #967a54;
}
.marco:hover .nombre {
  border: 1px solid black;
}
.marco {
  background: #bf9e72;
  cursor: pointer;
}
.marco:first-child {
  border-top-left-radius: 5px;
}
.marco:last-child {
  border-top-right-radius: 5px;
}
</style>
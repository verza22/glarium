<template>
  <div class="marcoSuperior">
    <div class="marco" v-for="index in 4" :key='index'>
      <div class="consejeros" :class="`consejero_${index}`"></div>
      <div class="nombre">{{$t(`advisor[${index-1}]`)}}</div>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="css" scoped>
.marcoSuperior {
  z-index: 2;
  margin-top: 24px;
  position: absolute;
  top: 0;
  right: 0;
}
.consejeros {
  height: 90px;
  width: 90px;
  background-repeat: no-repeat;
  background-position: center;
}
.consejero_1{
  background-image: url('~Img/advisor/0.png');
}
.consejero_2{
  background-image: url('~Img/advisor/1.png');
}
.consejero_3{
  background-image: url('~Img/advisor/2.png');
}
.consejero_4{
  background-image: url('~Img/advisor/3.png');
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
  display: inline-block;
}
.marco:first-child {
  border-top-left-radius: 5px;
}
.marco:last-child {
  border-top-right-radius: 5px;
}
</style>
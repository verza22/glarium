<template>
  <div class="marcoSuperior">
    <div class="marco" v-for="index in 4" :key='index'>
      <div class="advisors" :class="`advisor_${index}`"></div>
      <div class="nombre">{{$t(`advisor[${index-1}]`)}}</div>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>

@mixin advisor($n) {
  background-image: url('~Img/advisor/'+($n - 1)+'.png');
}

@for $i from 1 through 4 {
  .advisor_#{$i}{
    @include advisor($i);
  }
}

.marcoSuperior {
  z-index: 2;
  position: absolute;
  right: 5px;
}
.advisors {
  height: 90px;
  width: 90px;
  background-repeat: no-repeat;
  background-position: center;
}
.nombre {
  width: 100%;
  text-align: center;
  background: #cecece;
}
.marco:hover {
  background: #967a54;
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
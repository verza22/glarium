<template>
    <div class="mDiv">
        <div class="mHeader">
            <div class="gtitle">{{titulo}}</div>
            <div class="btn-close" @click='close'></div>
        </div>
        <div class="mBody">
            <slot></slot>
        </div> 
        <div class="mFooter"></div>
    </div>
</template>

<script>
import interact from 'interactjs'

export default {
    name:'Ventana1',
    props:['titulo','close'],
    methods:{
        drag(){
             const position = { x: 0, y: 0 }
            interact('.mDiv')
            .draggable({
                allowFrom:'.mHeader',
                //inertia: true,
                restrict: {
                    restriction: 'parent',
                },
                listeners: {
                    move (event) {
                        position.x += event.dx
                        position.y += event.dy
                        event.target.style.transform =`translate(${position.x}px, ${position.y}px)`
                    },
                }
            })
        }
    },
    mounted(){
        this.drag();
    }
}
</script>

<style lang="scss" scoped>
    @import '~Sass/modal';
</style>
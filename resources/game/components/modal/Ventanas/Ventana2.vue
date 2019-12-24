<template>
    <div class="mDiv2">
        <div class="mHeader2">
            <div class="gtitle">{{titulo}}</div>
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
    name:'Ventana2',
    props:['titulo'],
    methods:{
        drag(){
            const position = { x: 0, y: 0 }
            interact('.mDiv2')
            .draggable({
                allowFrom:'.mHeader2',
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
        },
    },
    mounted(){
        this.drag();
    }
}
</script>

<style lang="scss" scoped>
    @import '~Sass/modal';
</style>
<template>
    <div class="d-flex">
        <div class="flex-1">
            <Population class="mr-2" :disabled='disabled' :cant='unit.population'/>
            <Wood       class="mr-2" :disabled='disabled' :cant='unit.wood'      />
            <Wine       class="mr-2" :disabled='disabled' :cant='unit.wine'      />
            <Glass      class="mr-2" :disabled='disabled' :cant='unit.glass'     />
            <Sulfur     class="mr-2" :disabled='disabled' :cant='unit.sulfur'    />
        </div>
        <div>
            <Gold       class="mr-2" :disabled='disabled' :cant='unit.gold'      />
            <Timec      class="mr-2" :disabled='disabled' :cant='unit.time'      />
        </div>
    </div>
</template>

<script>
import Population from 'Components/other/resources/population.vue'
import Wood from 'Components/other/resources/wood.vue'
import Wine from 'Components/other/resources/wine.vue'
import Glass from 'Components/other/resources/glass.vue'
import Sulfur from 'Components/other/resources/sulfur.vue'
import Gold from 'Components/other/resources/gold.vue'
import Timec from 'Components/other/resources/timec.vue'

export default {
    name:'Recursos',
    props:['unit'],
    props:{
        unit:Object,
        disabled:{
            type:Boolean,
            default:false
        }
    },
    components:{
        Population,
        Wood,
        Wine,
        Glass,
        Sulfur,
        Gold,
        Timec
    }
}
</script>

<template>
  <span v-html="iconContent" :class="iconClass"></span>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '24'
  },
  class: {
    type: String,
    default: ''
  }
})

const iconContent = ref('')
const iconClass = props.class

onMounted(async () => {
  try {
    const iconModule = await import(`../media/icons/${props.name}.svg?raw`)
    let svg = iconModule.default
    
    // Replace width and height if size is provided
    if (props.size) {
      svg = svg.replace(/width="[^"]*"/, `width="${props.size}"`)
      svg = svg.replace(/height="[^"]*"/, `height="${props.size}"`)
    }
    
    iconContent.value = svg
  } catch (error) {
    console.error(`Failed to load icon: ${props.name}`, error)
  }
})
</script>

<style scoped>
span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

span :deep(svg) {
  display: block;
}
</style>

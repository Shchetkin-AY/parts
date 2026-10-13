import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useViewportStore = defineStore('viewport', () => {
  const size = reactive({
    height: window.innerHeight,
    width: window.innerWidth
  })

  const update = () => {
    const height = window.innerHeight
    const width = window.innerWidth

    size.height = height
    size.width = width
  }

  return {
    size,
    update
  }
})

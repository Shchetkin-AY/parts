import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Page',

  props: {
    class: {
      type: String,
      default: ''
    }
  },

  setup(props, { slots }) {
    return () => {
      const classes = [ 'isk-page', props.class ].filter(Boolean).join(' ')

      return (
        <div class={classes}>
          {slots.default?.()}
        </div>
      )
    }
  }
})

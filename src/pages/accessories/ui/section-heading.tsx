import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AccessoriesSectionHeading',

  props: {
    eyebrow: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const renderEyebrow = () => <span class="accessories-page__eyebrow">{props.eyebrow}</span>

    const renderTitle = () => <h2>{props.title}</h2>

    const renderCopy = () => {
      return (
        <div class="accessories-page__heading-copy">
          {renderTitle()}
          {renderEyebrow()}
        </div>
      )
    }

    const renderDescription = () => <p>{props.description}</p>

    return () =>
      <div class="accessories-page__heading">
        {renderCopy()}
        {renderDescription()}
      </div>
  }
})

import { LitElement, html, render } from 'lit'
import '../rdf-elements.js'
import style from '../src/style.js'

class FormatSelectorExample extends LitElement {
  static get properties () {
    return {
      label: {
        type: Object
      },
      mediaType: {
        type: Object
      }
    }
  }

  static get styles () {
    return [style]
  }

  onChange (event) {
    this.label = event.detail.label
    this.mediaType = event.detail.mediaType
  }

  render () {
    return html`
      <rdf-format-selector
        mediaType="application/ld+json"
        size="small"
        @change=${this.onChange}>
      </rdf-format-selector>

      <rdf-format-selector
        mediaType="application/ld+json"
        @change=${this.onChange}>
      </rdf-format-selector>

      <rdf-format-selector
        mediaType="application/ld+json"
        size="large"
        @change=${this.onChange}>
      </rdf-format-selector>

      <hr>

      <div class="mt-3">
        <h4>Event: <i>change</i></h4>
        <div>
          <label class="form-label">label</label>
          <textarea class="form-control" rows="1" disabled>${this.label}</textarea>
        </div>
        <div>
          <label class="form-label">mediaType</label>
          <textarea class="form-control" rows="1" disabled>${this.mediaType}</textarea>
        </div>
      </div>
    `
  }
}

window.customElements.define('format-selector-example', FormatSelectorExample)

render(html`<format-selector-example></format-selector-example>`, document.querySelector('#format-selector'))

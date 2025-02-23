/* global CustomEvent */

import { css, html, LitElement } from 'lit'
import style from './src/style.js'

const defaultFormats = {
  'text/turtle': 'Turtle',
  'application/ld+json': 'JSON-LD'
}

class RdfFormatSelector extends LitElement {
  static get properties () {
    return {
      formats: {
        type: Object
      },
      mediaType: {
        type: String
      },
      size: {
        type: String
      }
    }
  }

  static get styles () {
    return [
      css`
        :host {
          display: inline-block;
          width: auto;
        }
      `,
      style
    ]
  }

  constructor () {
    super()

    this.formats = defaultFormats
    this.mediaType = 'text/turtle'
  }

  onChange (event) {
    const options = {
      detail: {
        label: event.detail.text,
        mediaType: event.detail.value
      }
    }

    this.dispatchEvent(new CustomEvent('change', options))
  }

  render () {
    return html`<bs-select
      .options=${this.formats}
      selected=${this.mediaType}
      size=${this.size}
      @change=${event => this.onChange(event)}></bs-select>`
  }
}

export default RdfFormatSelector

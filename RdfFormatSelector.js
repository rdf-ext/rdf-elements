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
      style()
    ]
  }

  constructor () {
    super()

    this.formats = defaultFormats
    this.mediaType = 'text/turtle'
  }

  onChange () {
    const label = this.renderRoot.querySelector('option:checked').innerText
    const mediaType = this.renderRoot.querySelector('select').value

    const options = {
      detail: {
        label,
        mediaType
      }
    }

    this.dispatchEvent(new CustomEvent('change', options))
  }

  render () {
    let size = ''

    if (this.size === 'large') {
      size = 'form-select-lg'
    } else if (this.size === 'small') {
      size = 'form-select-sm'
    }

    return html`
      <select id="format" class="form-select ${size}" @change=${this.onChange}>
        ${this._renderOptions()}
      </select>
    `
  }

  _renderOptions () {
    return Object.entries(this.formats).map(([type, label]) => {
      const selected = type === this.mediaType

      return html`<option ?selected=${selected} value="${type}">${label}</option>`
    })
  }
}

export default RdfFormatSelector

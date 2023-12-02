/* global CustomEvent */

import { Parser } from 'sparqljs'
import BaseEditor from './src/BaseEditor.js'

class SparqlEditor extends BaseEditor {
  static get properties () {
    return {
      query: {
        type: Object
      }
    }
  }

  firstUpdated () {
    super.firstUpdated()

    this._validate()
  }

  _emitChange () {
    this._validate()

    const options = {
      detail: {
        error: this.status.error,
        query: this.query,
        value: this.value
      }
    }

    this.dispatchEvent(new CustomEvent('change', options))
  }

  _validate () {
    try {
      const parser = new Parser()

      this.query = parser.parse(this.value)
      this.status = {
        message: this.query.queryType ? `${this.query.queryType} query` : ''
      }
    } catch (error) {
      this.query = null
      this.status = {
        error,
        message: error.message.split('\n').join(' ')
      }
    }

    setTimeout(() => this.editor.dispatch(), 0)
  }
}

export default SparqlEditor

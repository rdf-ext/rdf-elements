/* global CustomEvent */

import prettyFormats from '@rdfjs/formats/pretty.js'
import rdf from 'rdf-ext'
import { Readable } from 'readable-stream'
import decode from 'stream-chunks/decode.js'
import { hasChangedDataset } from './hasChanged.js'
import BaseEditor from './src/BaseEditor.js'
import { turtle } from './src/lang-turtle.js'

class RdfEditor extends BaseEditor {
  static get properties () {
    return {
      base: {
        type: Object
      },
      dataset: {
        type: Object,
        hasChanged: hasChangedDataset
      },
      factory: {
        type: Object
      },
      mediaType: {
        type: String
      },
      prefixes: {
        type: Object
      }
    }
  }

  constructor () {
    super({ plugins: [turtle()] })

    this._dataset = null
    this._rdf = rdf.clone()
    this._rdf.formats.import(prettyFormats)
    this.prefixes = new Map()
  }

  get dataset () {
    return this._dataset
  }

  set dataset (dataset) {
    const oldValue = this._dataset

    this._dataset = dataset

    this.requestUpdate('dataset', oldValue)
  }

  firstUpdated () {
    super.firstUpdated()

    this._emitChange()
  }

  update (changedProperties) {
    if (changedProperties.has('base')) {
      this._serialize()
    } else if (changedProperties.has('dataset')) {
      this._serialize()
    } else if (changedProperties.has('mediaType')) {
      this._serialize()
    } else if (changedProperties.has('prefixes')) {
      this._serialize()
    }

    super.update(changedProperties)
  }

  async _emitChange () {
    await this._parse()

    const options = {
      detail: {
        dataset: this.dataset,
        error: this.status.error,
        value: this.value
      }
    }

    this.dispatchEvent(new CustomEvent('change', options))
  }

  async _parse () {
    try {
      this._dataset = await rdf.io.dataset.fromText(this.mediaType, this.value)

      this.status = { message: `${this._dataset.size} triples` }
    } catch (error) {
      this._dataset = null
      this.status = { error }
    }

    this.editor.dispatch()
  }

  async _serialize () {
    if (!this.editor) {
      return
    }

    const dataset = this.dataset ? [...this.dataset] : []
    const stream = Readable.from(dataset)
    const output = this._rdf.formats.serializers.import(this.mediaType, stream, { baseIRI: this.base })

    for (const [prefix, namespace] of this.prefixes) {
      stream.emit('prefix', prefix, namespace)
    }

    this._value = await decode(output)

    this._updateValue()
  }
}

export default RdfEditor

/* global CustomEvent */

import { EditorSelection, EditorState } from '@codemirror/state'
import { showPanel, ViewPlugin } from '@codemirror/view'
import { basicSetup, EditorView } from 'codemirror'
import { css, html, LitElement } from 'lit'

class BaseEditor extends LitElement {
  static get properties () {
    return {
      height: {
        type: Number
      },
      status: {
        type: Object
      },
      value: {
        type: String
      }
    }
  }

  static get styles () {
    return [
      css`
        :host {
          display: block;
        }

        .cm-editor {
          height: 100%;
          width: 100%;
        }
        
        .wrapper {
          height: 100%;
        }
      `
    ]
  }

  constructor ({ plugins = [] } = {}) {
    super()

    this.editor = null
    this.plugins = plugins
    this.status = {}
    this._value = ''
  }

  get value () {
    return this._value
  }

  set value (value) {
    const oldValue = this._value

    this._value = value

    this.requestUpdate('value', oldValue)
  }

  firstUpdated () {
    const component = this

    const parent = this.renderRoot.querySelector('div.wrapper')

    const onUpdatePlugin = ViewPlugin.fromClass(class {
      async update (update) {
        if (update.docChanged) {
          component._value = update.view.state.sliceDoc()
          component._emitChange()
        }
      }
    })

    this.editor = new EditorView({
      parent,
      state: EditorState.create({
        doc: this.value,
        extensions: [basicSetup,
          showPanel.of(this._statusPanel.bind(this)),
          ...this.plugins, onUpdatePlugin]
      })
    })
  }

  render () {
    return html`<div style="height: ${this.height}px;">
      <div class="wrapper"></div>
    </div>`
  }

  update (changedProperties) {
    if (changedProperties.has('value')) {
      this._updateValue()
    }

    super.update(changedProperties)
  }

  _emitChange () {
    const options = {
      detail: {
        value: this.value
      }
    }

    this.dispatchEvent(new CustomEvent('change', options))
  }

  _statusPanel () {
    const dom = document.createElement('div')

    const updatePanel = () => {
      if (this.status.error) {
        dom.textContent = this.status.message || this.status.error.message
        dom.style.backgroundColor = '#f8d7da'
      } else if (this.status.message) {
        dom.textContent = this.status.message
        dom.style.backgroundColor = null
      } else {
        dom.textContent = ''
        dom.style.backgroundColor = null
      }
    }

    updatePanel()

    return {
      dom,
      update: () => updatePanel()
    }
  }

  _updateValue () {
    if (!this.editor) {
      return
    }

    const cursorPosition = Math.min(
      this.editor.state.selection.main.from,
      this.value.length
    )

    this.editor.dispatch({
      changes: {
        from: 0,
        to: this.editor.state.doc.length,
        insert: this.value
      }
    })

    this.editor.dispatch({
      selection: EditorSelection.create([
        EditorSelection.cursor(cursorPosition)
      ], 0)
    })
  }
}

export default BaseEditor

import { LitElement, html, render } from 'lit'
import '../rdf-elements.js'
import style from '../src/style.js'

const value = `PREFIX schema: <http://schema.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT * WHERE {
  ?resource a schema:Person;
    schema:birthDate ?birthDate.

  FILTER(?birthDate > "1980-01-01"^^xsd:date)
}
`

class SparqlEditorExample extends LitElement {
  static get properties () {
    return {
      error: {
        type: Object
      },
      query: {
        type: Object
      },
      value: {
        type: String
      }
    }
  }

  static get styles () {
    return [style()]
  }

  constructor () {
    super()

    this.error = null
    this.query = null
    this.value = value
  }

  onChange (event) {
    this.error = event.detail.error
    this.query = event.detail.query
    this.value = event.detail.value
  }

  onReset () {
    this.value = value
  }

  render () {
    return html`
      <button class="btn btn-primary" @click=${this.onReset}>reset</button>
  
      <hr>
  
      <sparql-editor height=300 .value=${this.value} @change=${this.onChange}></sparql-editor>

      <hr>

      <div class="mt-3">
        <h4>Event: <i>change</i></h4>
        <div>
          <label class="form-label">error</label>
          <textarea class="form-control" rows="5" disabled>${this.error && this.error.toString()}</textarea>
        </div>
        <div>
          <label class="form-label">query</label>
          <textarea class="form-control" rows="5" disabled>${this.query && JSON.stringify(this.query, null, 2)}</textarea>
        </div>
        <div>
          <label class="form-label">value</label>
          <textarea class="form-control" rows="6" disabled>${this.value}</textarea>
        </div>
      </div>
    `
  }
}

window.customElements.define('sparql-editor-example', SparqlEditorExample)

render(html`<sparql-editor-example></sparql-editor-example>`, document.querySelector('#sparql-editor'))

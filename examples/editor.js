import housemd from 'housemd'
import { LitElement, html, render } from 'lit'
import rdf from 'rdf-ext'
import '../rdf-elements.js'
import style from '../src/style.js'
import * as ns from './namespaces.js'

const base = rdf.namedNode('https://housemd.rdf-ext.org/')

const prefixes = new Map([
  ['rdf', ns.rdf('')],
  ['schema', ns.schema('')]
])

const values = {}

values['application/ld+json'] = `{
  "@context": {
    "@base": "https://housemd.rdf-ext.org/",
    "birthDate": {
      "@id": "http://schema.org/birthDate",
      "@type": "http://www.w3.org/2001/XMLSchema#date"
    },
    "familyName": "http://schema.org/familyName",
    "givenName": "http://schema.org/givenName",
    "homeLocation": {
      "@id": "http://schema.org/homeLocation",
      "@type": "@id"
    },
    "jobTitle": "http://schema.org/jobTitle",
    "knows": {
      "@id": "http://schema.org/knows",
      "@type": "@id"
    },
    "Person": "http://schema.org/Person"
  },
  "@id": "person/gregory-house",
  "@type": "Person",
  "birthDate": "1959-05-15",
  "familyName": "House",
  "givenName": "Gregory",
  "homeLocation": "place/221b-baker-street",
  "jobTitle": "Head of Diagnostic Medicine",
  "knows": [
    "person/allison-cameron",
    "person/blythe-house",
    "person/dominika-house",
    "person/eric-foreman",
    "person/james-wilson",
    "person/jonathan-house",
    "person/lisa-cuddy",
    "person/robert-chase"
  ]
}`

values['text/turtle'] = `@base <https://housemd.rdf-ext.org/person/>. 
@prefix schema: <http://schema.org/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

<gregory-house> a schema:Person;
  schema:birthDate "1959-05-15"^^xsd:date;
  schema:familyName "House";
  schema:givenName "Gregory";
  schema:homeLocation <https://housemd.rdf-ext.org/place/221b-baker-street>;
  schema:jobTitle "Head of Diagnostic Medicine";
  schema:knows
    <allison-cameron>,
    <blythe-house>,
    <dominika-house>,
    <eric-foreman>,
    <james-wilson>,
    <jonathan-house>,
    <lisa-cuddy>,
    <robert-chase>.
`

class EditorExample extends LitElement {
  static get properties () {
    return {
      dataset: {
        type: Object
      },
      error: {
        type: Object
      },
      mediaType: {
        type: String
      },
      value: {
        type: String
      }
    }
  }

  static get styles () {
    return [style]
  }

  constructor () {
    super()

    this.mediaType = 'application/ld+json'
    this.onReset()
  }

  onChange (event) {
    this.dataset = event.detail.dataset
    this.error = event.detail.error
    this.value = event.detail.value
  }

  onDataset () {
    this.dataset = housemd({ factory: rdf })
  }

  onFormatChange (event) {
    this.mediaType = event.detail.mediaType
  }

  onReset () {
    this.value = values[this.mediaType]
  }

  render () {
    return html`
      <rdf-format-selector .mediaType=${this.mediaType} @change=${this.onFormatChange}></rdf-format-selector>
      <button class="btn btn-primary" @click=${this.onReset}>reset</button>
      <button class="btn btn-primary" @click=${this.onDataset}>dataset</button>
  
      <hr>

      <rdf-editor
        height=300
        .base=${base}
        .dataset=${this.dataset}
        .mediaType=${this.mediaType}
        .prefixes=${prefixes}
        .value=${this.value}
        @change="${this.onChange}">
      </rdf-editor>

      <hr>

      <div class="mt-3">
        <h4>Event: <i>change</i></h4>
        <div>
          <label class="form-label">value</label>
          <textarea class="form-control" rows="6" disabled>${this.value}</textarea>
        </div>
        <div>
          <label class="form-label">dataset</label>
          <textarea class="form-control" rows="6" disabled>${this.dataset && this.dataset.toString()}</textarea>
        </div>
        <div>
          <label class="form-label">error</label>
          <textarea class="form-control" rows="1" disabled>${this.error && this.error.toString()}</textarea>
        </div>
      </div>
    `
  }
}

window.customElements.define('editor-example', EditorExample)

render(html`<editor-example></editor-example>`, document.querySelector('#editor'))

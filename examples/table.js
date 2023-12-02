import toNT from '@rdfjs/to-ntriples'
import housemd from 'housemd'
import { LitElement, html, render } from 'lit'
import rdf from 'rdf-ext'
import '../rdf-elements.js'
import style from '../src/style.js'
import * as ns from './namespaces.js'

const cbd = rdf.traverser(({ level, quad }) => level === 0 || quad.subject.termType === 'BlankNode')
const dataset = rdf.dataset(housemd({ factory: rdf }))

const term0 = ns.house('person/gregory-house')
const term1 = ns.house('person/dominika-house')
const term2 = ns.ex.resource
const dataset0 = cbd.match({ dataset, term: term0 })
const dataset2 = rdf.grapoi({ term: term2 })
  .addList(ns.ex.listA, [
    rdf.literal('first'),
    rdf.literal('second'),
    rdf.literal('third')
  ])
  .addList(ns.ex.listB, [])
  .dataset

const resources = [{
  dataset: dataset0,
  term: term0
}, {
  dataset,
  term: term1
}, {
  dataset: dataset2,
  term2
}]

class TableExample extends LitElement {
  static get properties () {
    return {
      resource: {
        type: Object
      },
      objectObject: {
        type: Object
      },
      objectPredicate: {
        type: Object
      },
      objectSubject: {
        type: Object
      },
      objectTerm: {
        type: Object
      },
      predicatePredicate: {
        type: Object
      },
      predicateSubject: {
        type: Object
      },
      predicateTerm: {
        type: Object
      },
      subjectSubject: {
        type: Object
      },
      subjectTerm: {
        type: Object
      },
      typeObject: {
        type: Object
      },
      typePredicate: {
        type: Object
      },
      typeSubject: {
        type: Object
      },
      typeTerm: {
        type: Object
      }
    }
  }

  static get styles () {
    return [style()]
  }

  constructor () {
    super()

    this.resource = resources[0]
  }

  onClickObject (event) {
    this.objectObject = event.detail.object
    this.objectPredicate = event.detail.predicate
    this.objectSubject = event.detail.subject
    this.objectTerm = event.detail.term
  }

  onClickPredicate (event) {
    this.predicatePredicate = event.detail.predicate
    this.predicateSubject = event.detail.subject
    this.predicateTerm = event.detail.term
  }

  onClickSubject (event) {
    this.subjectSubject = event.detail.subject
    this.subjectTerm = event.detail.term
  }

  onClickType (event) {
    this.typeObject = event.detail.object
    this.typePredicate = event.detail.predicate
    this.typeSubject = event.detail.subject
    this.typeTerm = event.detail.term
  }

  onChangeResource (index) {
    this.resource = resources[index]
  }

  render () {
    return html`
      <button class="btn btn-primary" @click=${() => this.onChangeResource(0)}>short</button>
      <button class="btn btn-primary" @click=${() => this.onChangeResource(1)}>long</button>
      <button class="btn btn-primary" @click=${() => this.onChangeResource(2)}>list</button>
  
      <hr>

      <rdf-table
        .resource=${this.resource}
        .scrollToSubject=${true}
        @clickObject=${this.onClickObject}
        @clickPredicate=${this.onClickPredicate}
        @clickSubject=${this.onClickSubject}
        @clickType=${this.onClickType}>
      </rdf-table>

      <hr>

      <div class="mt-3">
        <h4>Event: <i>clickObject</i></h4>
        <div>
          <label class="form-label">object</label>
          <textarea class="form-control" rows="1" disabled>${toNT(this.objectObject)}</textarea>
        </div>
        <div>
          <label class="form-label">predicate</label>
          <textarea class="form-control" rows="1" disabled>${toNT(this.objectPredicate)}</textarea>
        </div>
        <div>
          <label class="form-label">subject</label>
          <textarea class="form-control" rows="1" disabled>${toNT(this.objectSubject)}</textarea>
        </div>
        <div>
          <label class="form-label">term</label>
          <textarea class="form-control" rows="1" disabled>${toNT(this.objectTerm)}</textarea>
        </div>
      </div>

      <div class="mt-3">
        <h4>Event: <i>clickPredicate</i></h4>
        <div>
          <label class="form-label">predicate</label>
          <textarea class="form-control" rows="1" disabled>${toNT(this.predicatePredicate)}</textarea>
        </div>
        <div>
          <label class="form-label">subject</label>
          <textarea class="form-control" rows="1" disabled>${toNT(this.predicateSubject)}</textarea>
        </div>
        <div>
          <label class="form-label">term</label>
          <textarea class="form-control" rows="1" disabled>${toNT(this.predicateTerm)}</textarea>
        </div>
      </div>

      <div class="mt-3">
        <h4>Event: <i>clickSubject</i></h4>
        <div>
          <label class="form-label">subject</label>
          <textarea class="form-control" rows="1" disabled>${toNT(this.subjectSubject)}</textarea>
        </div>
        <div>
          <label class="form-label">term</label>
          <textarea class="form-control" rows="1" disabled>${toNT(this.subjectTerm)}</textarea>
        </div>
      </div>

      <div class="mt-3">
        <h4>Event: <i>clickType</i></h4>
        <div>
          <label class="form-label">object</label>
          <textarea class="form-control" rows="1" disabled>${toNT(this.typeObject)}</textarea>
        </div>
        <div>
          <label class="form-label">predicate</label>
          <textarea class="form-control" rows="1" disabled>${toNT(this.typePredicate)}</textarea>
        </div>
        <div>
          <label class="form-label">subject</label>
          <textarea class="form-control" rows="1" disabled>${toNT(this.typeSubject)}</textarea>
        </div>
        <div>
          <label class="form-label">term</label>
          <textarea class="form-control" rows="1" disabled>${toNT(this.typeTerm)}</textarea>
        </div>
      </div>
    `
  }
}

window.customElements.define('table-example', TableExample)

render(html`<table-example></table-example>`, document.querySelector('#table'))

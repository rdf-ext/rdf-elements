import toNT from '@rdfjs/to-ntriples'
import housemd from 'housemd'
import { LitElement, html, render } from 'lit'
import rdf from 'rdf-ext'
import '../rdf-elements.js'
import style from '../src/style.js'
import * as ns from './namespaces.js'

const dataset = rdf.dataset(housemd({ factory: rdf }))

class NetworkExample extends LitElement {
  static get properties () {
    return {
      compound: {
        type: Object
      },
      compoundLabels: {
        type: Object
      },
      compounds: {
        type: Object
      },
      dataset: {
        type: Object
      },
      edge: {
        type: Object
      },
      node: {
        type: Object
      },
      showcompounds: {
        type: Boolean
      }
    }
  }

  static get styles () {
    return [style()]
  }

  constructor () {
    super()

    this.initD()
  }

  initD () {
    this.dataset = dataset.filter(quad => {
      return !quad.predicate.value.endsWith('#type')
    })

    this.compounds = rdf.termMap()
    this.compoundLabels = rdf.termMap()

    const addParent = term => {
      if (term.termType !== 'NamedNode') {
        return
      }

      const parentUrl = new URL(term.value.endsWith('/') ? '..' : '.', term.value)
      const parent = toContainer(rdf.namedNode(parentUrl.toString()))

      if (!parent.equals(term)) {
        this.compounds.set(term, parent)

        addParent(parent)
      }
    }

    const toContainer = term => {
      const ptr = rdf.grapoi({ dataset: this.dataset, term })

      const name =
        ptr.out(ns.schema.name).value ||
        ptr.out([ns.schema.givenName, ns.schema.familyName]).values.join(' ')

      if (term.termType === 'NamedNode') {
        term = rdf.namedNode(`${term.value}-container`)
      }

      if (name) {
        this.compoundLabels.set(term, name)
      }

      return term
    }

    for (const quad of this.dataset) {
      this.compounds.set(quad.subject, toContainer(quad.subject))

      if (quad.object.termType === 'Literal') {
        this.compounds.set(quad.object, toContainer(quad.subject))
      } else {
        this.compounds.set(quad.object, toContainer(quad.object))
      }

      addParent(toContainer(quad.subject))
    }
  }

  compoundClick (event) {
    this.compound = event.detail
  }

  edgeClick (event) {
    this.edge = event.detail
  }

  nodeClick (event) {
    this.node = event.detail
  }

  toggleShowcompounds () {
    this.showcompounds = !this.showcompounds
  }

  render () {
    return html`
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="compounds" @click=${this.toggleShowcompounds}>
        <label class="form-check-label" for="compounds">Show compounds</label>
      </div>

      <hr>

      <rdf-network
        height=1000
        .compounds=${this.showcompounds && this.compounds}
        .compoundLabels=${this.compoundLabels}
        .dataset=${this.dataset}
        @compoundClick=${this.compoundClick}
        @edgeClick=${this.edgeClick}
        @nodeClick=${this.nodeClick}>
      </rdf-network>

      <hr>

      <div class="mt-3">
        <h4>Event: <i>compoundClick</i></h4>
        <div>
          <label class="form-label">term</label>
          <textarea class="form-control" rows="1" disabled>${this.compound && toNT(this.compound.term)}</textarea>
        </div>
      </div>

      <div class="mt-3">
        <h4>Event: <i>edgeClick</i></h4>
        <div>
          <label class="form-label">quad</label>
          <textarea class="form-control" rows="3" disabled>${this.edge && toNT(this.edge.quad)}</textarea>
        </div>
        <div>
          <label class="form-label">term</label>
          <textarea class="form-control" rows="1" disabled>${this.edge && toNT(this.edge.term)}</textarea>
        </div>
      </div>

      <div class="mt-3">
        <h4>Event: <i>nodeClick</i></h4>
        <div>
          <label class="form-label">term</label>
          <textarea class="form-control" rows="1" disabled>${this.node && toNT(this.node.term)}</textarea>
        </div>
      </div>
    `
  }
}

window.customElements.define('network-example', NetworkExample)

render(html`<network-example></network-example>`, document.querySelector('#network'))

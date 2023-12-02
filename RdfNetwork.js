/* global CustomEvent */

import cytoscape from 'cytoscape'
import cytoscapeCola from 'cytoscape-cola'
import { css, html, LitElement } from 'lit'
import { hasChangedDataset, hasChangedTermMap2 } from './hasChanged.js'
import buildCytoscapeData from './src/buildCytoscapeData.js'

cytoscape.use(cytoscapeCola)

class RdfNetwork extends LitElement {
  static get properties () {
    return {
      compoundLabels: {
        type: Object
      },
      compounds: {
        type: Object,
        hasChanged: hasChangedTermMap2
      },
      dataset: {
        type: Object,
        hasChanged: hasChangedDataset
      },
      height: {
        type: Number
      }
    }
  }

  static get styles () {
    return [
      css`
        :host {
          height: 100%;
          width: 100%;
        }

        #cy {
          width: 100%;
          border: 1px solid #000;
          overflow: hidden;
        }
      `
    ]
  }

  constructor () {
    super()

    this.cy = null
    this._init = false
  }

  firstUpdated () {
    this._init = true

    this.initCytoscape()
  }

  update (changedProperties) {
    this.initCytoscape()

    super.update(changedProperties)
  }

  initCytoscape () {
    if (!this._init) {
      return
    }

    const parent = this.renderRoot.querySelector('#cy')
    parent.style.height = `${this.height}px`

    if (this.cy) {
      this.cy.destroy()
      this.cy = null
    }

    const { edges, nodes } = buildCytoscapeData({
      compoundLabels: this.compoundLabels,
      compounds: this.compounds,
      dataset: this.dataset
    })

    this.cy = cytoscape({
      container: parent,
      autounselectify: true,
      boxSelectionEnabled: false,
      layout: {
        name: 'cola',
        convergenceThreshold: 100,
        animate: false,
        padding: 0,
        nodeSpacing: node => {
          const term = node.data().term

          if (term) {
            return term.termType === 'Literal' ? 20 : 80
          }

          return 100
        }
      },
      style: [{
        selector: 'node',
        style: {
          width: 60,
          height: 60
        }
      }, {
        selector: 'node[color]',
        style: {
          'background-color': 'data(color)'
        }
      }, {
        selector: 'node[label]',
        style: {
          label: 'data(label)'
        }
      }, {
        selector: 'node[type]',
        style: {
          shape: 'data(type)'
        }
      }, {
        selector: 'edge',
        style: {
          'curve-style': 'bezier',
          'line-color': '#6c757d',
          'target-arrow-shape': 'triangle',
          'target-arrow-color': '#6c757d',
          width: 5
        }
      }, {
        selector: 'edge[label]',
        style: {
          label: 'data(label)'
        }
      }],
      elements: {
        nodes: [...nodes.values()],
        edges
      }
    })

    this.cy.on('click', event => {
      const target = event.target
      const data = target.data()
      const hasChildren = target.children && target.children().length !== 0

      if (hasChildren) {
        this.dispatchEvent(new CustomEvent('compoundClick', {
          detail: {
            term: data.term
          }
        }))
      } else {
        if (data.quad) {
          this.dispatchEvent(new CustomEvent('edgeClick', {
            detail: {
              quad: data.quad,
              term: data.term
            }
          }))
        } else {
          this.dispatchEvent(new CustomEvent('nodeClick', {
            detail: {
              term: data.term
            }
          }))
        }
      }
    })

    document.addEventListener('scroll', () => {
      this.cy.renderer().invalidateContainerClientCoordsCache()
    })
  }

  render () {
    return html`<div id="cy"></div>`
  }
}

export default RdfNetwork

import toNT from '@rdfjs/to-ntriples'
import rdf from 'rdf-ext'
import getLabel from './getLabel.js'

const colorList = [
  '#f8f9fa',
  '#e9ecef',
  '#dee2e6',
  '#ced4da',
  '#adb5bd',
  '#6c757d',
  '#495057',
  '#343a40',
  '#212529'
]

function toId (term, constrain) {
  if (!term) {
    return null
  }

  if (constrain) {
    return `${toNT(term)} - compound`
  }

  return toNT(term)
}

function buildCytoscapeData ({ compoundLabels = new Map(), compounds, dataset }) {
  const colors = new Map([
    ['BlankNode', '#0dcaf0'],
    ['Literal', '#198754'],
    ['NamedNode', '#ffc107']
  ])
  const nodes = new Map()
  const edges = []

  const addNode = term => {
    let parent
    const id = toId(term)
    const color = colors.get(term.termType)
    const type = term.termType === 'Literal' ? 'rectangle' : undefined

    if (compounds && compounds.has(term)) {
      parent = toId(compounds.get(term), true)
    }

    nodes.set(id, {
      data: {
        color,
        id,
        label: getLabel(term),
        parent,
        term,
        type
      }
    })

    return id
  }

  if (compounds) {
    const invcompounds = rdf.termMap()

    for (const [child, parent] of compounds.entries()) {
      if (!invcompounds.has(parent)) {
        invcompounds.set(parent, rdf.termSet())
      }

      invcompounds.get(parent).add(child)
    }

    const getLevel = parent => {
      const children = invcompounds.get(parent)

      if (!children) {
        return 0
      }

      return [...children].reduce((level, child) => {
        if (child.equals(parent)) {
          return level
        }

        return Math.max(level, getLevel(child) + 1)
      }, 1)
    }

    for (const compound of compounds.values()) {
      const level = getLevel(compound)
      const color = colorList[level]
      const id = toId(compound, true)
      const parentTerm = compounds.get(compound)
      const parent = toId(parentTerm, true)
      const label = compoundLabels.get(compound)

      nodes.set(id, {
        data: {
          color,
          id,
          label,
          parent,
          term: compound
        }
      })
    }
  }

  for (const quad of (dataset || [])) {
    const source = addNode(quad.subject, quad)
    const target = addNode(quad.object, quad)

    edges.push({
      data: {
        label: getLabel(quad.predicate),
        quad,
        source,
        target,
        term: quad.predicate
      }
    })
  }

  return { edges, nodes }
}

export default buildCytoscapeData

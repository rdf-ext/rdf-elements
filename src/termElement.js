/* global CustomEvent */

import { html } from 'lit'
import getLabel from './getLabel.js'

function termElement ({
  baseURL,
  click,
  label,
  term
}) {
  const dispatchClick = event => {
    if (click) {
      event.preventDefault()
      click(new CustomEvent('termClick', { detail: { term } }))
    }
  }

  const computedLabel = () => {
    if (label) {
      return label
    }

    if (!term) {
      return ''
    }

    return getLabel(term, { baseURL })
  }

  if (!term) {
    return html`<p></p>`
  }

  if (term.termType === 'BlankNode') {
    return html`<a href="#" @click="${dispatchClick}">${computedLabel()}</a>`
  }

  if (term.termType === 'Literal') {
    return html`<p style="margin-block-end: 0px;">${computedLabel()}</p>`
  }

  if (term.termType === 'NamedNode') {
    return html`<a href="${term.value}" @click="${dispatchClick}">${computedLabel()}</a>`
  }

  return html`<p></p>`
}

export default termElement

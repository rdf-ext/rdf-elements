/* global CustomEvent */

import { LitElement } from 'lit'
import * as ns from './namespaces.js'

class RdfData extends LitElement {
  clickObject ({ object, predicate, subject }) {
    const options = {
      detail: {
        term: object.term,
        subject: subject.term,
        predicate: predicate.term,
        object: object.term
      }
    }

    if (this.scrollToSubject) {
      const subjectElement = this
        .shadowRoot
        .querySelector(`[data-subject="${object.term.toCanonical()}"]`)

      if (subjectElement) {
        const rect = subjectElement.getBoundingClientRect()

        window.scrollBy({
          left: rect.left,
          top: rect.top,
          behavior: 'smooth'
        })
      }
    }

    this.dispatchEvent(new CustomEvent('clickObject', options))
  }

  clickPredicate ({ predicate, subject }) {
    const options = {
      detail: {
        term: predicate.term,
        subject: subject.term,
        predicate: predicate.term
      }
    }

    this.dispatchEvent(new CustomEvent('clickPredicate', options))
  }

  clickSubject ({ subject }) {
    const options = {
      detail: {
        term: subject.term,
        subject: subject.term
      }
    }

    this.dispatchEvent(new CustomEvent('clickSubject', options))
  }

  clickType ({ subject, type }) {
    const options = {
      detail: {
        term: type,
        subject: subject.term,
        predicate: ns.rdf.type,
        object: type
      }
    }

    this.dispatchEvent(new CustomEvent('clickType', options))
  }
}

export default RdfData

function getLabel (term, { baseURL = new URL(window.location.origin) } = {}) {
  if (term.termType === 'BlankNode') {
    return `_:${term.value}`
  }

  if (term.termType === 'Literal') {
    return term.value
  }

  if (term.termType === 'NamedNode') {
    if (baseURL) {
      const baseURLStr = baseURL && baseURL.toString()

      if (baseURLStr && term.value.startsWith(baseURLStr)) {
        return term.value.slice(baseURLStr.length - 1)
      }
    }

    // TODO: handle trailing slash
    const result = term.value.match(/([^#|/]*)$/)

    if (result && result[1]) {
      return result[1]
    }
  }

  return term.value
}

export default getLabel

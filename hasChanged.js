import normalize from '@rdfjs/normalize'
import toNT from '@rdfjs/to-ntriples'

function hasChangedDataset (newVal, oldVal) {
  if (!newVal || !oldVal) {
    return newVal !== oldVal
  }

  return normalize(newVal) !== normalize(oldVal)
}

function hasChangedTermMap2 (newVal, oldVal) {
  return normalizeTermMap2(newVal) !== normalizeTermMap2(oldVal)
}

function normalizeTermMap2 (termMap) {
  if (!termMap) {
    return ''
  }

  return [...termMap.entries()]
    .map(([k, v]) => `${toNT(k)} ${toNT(v)}`)
    .sort()
    .join('\n')
}

export {
  hasChangedDataset,
  hasChangedTermMap2
}

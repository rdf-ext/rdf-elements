import { readFile, writeFile } from 'node:fs/promises'

async function main () {
  const content = await readFile('./node_modules/bootstrap/dist/css/bootstrap.min.css')
  const js = `import { css } from 'lit'

const style = css\`${content.toString()}\`

export default style
`

  await writeFile('./generated/style.js', js)
}

main()

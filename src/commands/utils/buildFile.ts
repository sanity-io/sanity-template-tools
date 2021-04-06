import type {JsonValue} from 'type-fest'

const {isBinarySync} = require('istextorbinary')
const path = require('path')
const {copyFile, mkdirp, readFile, writeFile} = require('./fs')
const {replaceVars} = require('./replaceVars')

export async function buildFile(
  fromPath: string,
  toPath: string,
  templateValues: Record<string, JsonValue>
) {
  const dir = path.dirname(toPath)

  await mkdirp(dir)

  const buf = await readFile(fromPath)
  const isBinary = isBinarySync(fromPath, buf)

  try {
    const contents = isBinary
      ? buf
      : replaceVars(fromPath, buf.toString('utf8'), templateValues || {})
    return writeFile(toPath, contents)
  } catch (err) {
    console.warn(`WARNING: Writing went wrong in: ${fromPath} (original error below)`)
    console.warn(err)
    return copyFile(fromPath, toPath)
  }
}

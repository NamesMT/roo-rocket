import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'pathe'

export default async function simpleWriteFileWithDirs(filepath: string, data: string) {
  // Optimistically create the directory
  await mkdir(dirname(filepath), { recursive: true })

  // Write the file
  return await writeFile(filepath, data)
}

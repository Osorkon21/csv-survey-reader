import { dialog } from "electron"
import fs from "fs/promises"

async function handleOpenFile() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: [
      "openFile"
    ],
    filters: [
      { name: ".csv", extensions: ["csv"] }
    ]
  })
  if (!canceled) {
    return filePaths[0]
  }
}

async function handleReadFile(filePath: string) {
  const content = await fs.readFile(filePath, "utf-8")

  return content;
}

export {
  handleOpenFile,
  handleReadFile
}

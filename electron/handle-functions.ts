import { dialog } from "electron"
import Store from "electron-store"
import fs from "fs/promises"

export type IgnoreParams = {
  word: string
  permanent: boolean
}

let store = new Store();

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

function handleGetFromStore(key: string) {
  return store.get(key);
}

function handleSetToStore(key: string, ignoreList: IgnoreParams[]) {
  store.set(key, ignoreList);
}

export {
  handleOpenFile,
  handleReadFile,
  handleGetFromStore,
  handleSetToStore
}

import './App.css'
import type { ContextBridgeApi } from '../electron/preload';

declare global {
  interface Window {
    api: ContextBridgeApi
  }
}

export default function App() {

  async function handleButtonClick() {
    const filePath = await window.api.openFile();
    const content = await window.api.readFile(filePath);
    console.log(content);
  }

  return (
    <button onClick={handleButtonClick}>Select File</button>
  )
}

import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { useState, useEffect } from "react"
import type { ContextBridgeApi } from '../electron/preload';
import { LandingPage, SelectPage } from "./pages"
import { Header } from "./components"
import 'bootstrap/dist/css/bootstrap.min.css';
import { defaultIgnoreFile } from './utils/default-ignore-file';
import { IgnoreParams } from '../electron/handle-functions';

declare global {
  interface Window {
    api: ContextBridgeApi
  }
}

export default function App() {
  const [content, setContent] = useState("");
  const [wordCountCutoff, setWordCountCutoff] = useState(10);
  const [ignoreFile, setIgnoreFile] = useState<IgnoreParams[]>([]);
  const [searchWords, setSearchWords] = useState<string[]>([]);

  async function setDefaultIgnoreFile() {
    await window.api.setToStore("ignore-file", defaultIgnoreFile)
    setIgnoreFile(defaultIgnoreFile);
  }

  async function loadIgnoreFile() {
    let iFile = await window.api.getFromStore("ignore-file");

    if (iFile === undefined) {
      await setDefaultIgnoreFile();
    }
    else {


      setIgnoreFile(iFile);
    }
  }

  useEffect(() => {
    loadIgnoreFile();
    console.log("ignore file loaded")
  }, [])

  return (
    <HashRouter>
      <div>
        <Header
          setDefaultIgnoreFile={setDefaultIgnoreFile}
        ></Header>
      </div>

      <Routes>
        <Route path="/" element={<LandingPage
          setContent={setContent}
          wordCountCutoff={wordCountCutoff}
          setWordCountCutoff={setWordCountCutoff}
        />} />
        <Route path="/select" element={<SelectPage
          content={content}
          wordCountCutoff={wordCountCutoff}
          ignoreFile={ignoreFile}
          setIgnoreFile={setIgnoreFile}
          searchWords={searchWords}
          setSearchWords={setSearchWords}
        />} />
      </Routes>
    </HashRouter>
  )
}

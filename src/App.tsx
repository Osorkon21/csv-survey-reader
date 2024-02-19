import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { useState, useEffect } from "react"
import type { ContextBridgeApi } from '../electron/preload';
import { LandingPage, SelectPage, DisplayPage } from "./pages"
import { Header } from "./components"
import 'bootstrap/dist/css/bootstrap.min.css';
import { defaultIgnoreFile } from './utils/default-ignore-file';
import { IgnoreParams } from '../electron/handle-functions';

declare global {
  interface Window {
    api: ContextBridgeApi
  }
  type SearchWord = {
    word: string,
    data: {
      questionIndex: number,
      line: number
    }[]
  }
}

export default function App() {
  const [content, setContent] = useState("");
  const [wordCountCutoff, setWordCountCutoff] = useState(10);
  const [ignoreFile, setIgnoreFile] = useState<IgnoreParams[]>([]);
  const [searchWords, setSearchWords] = useState<SearchWord[]>([]);

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
      let filteredIFile = iFile.filter((iParams) => iParams.permanent === true)
      await window.api.setToStore("ignore-file", filteredIFile);
      setIgnoreFile(filteredIFile);
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
        <Route path="/display" element={<DisplayPage
          searchWords={searchWords}
        />} />
      </Routes>
    </HashRouter>
  )
}

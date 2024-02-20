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
    count: number,
    data: {
      question: string,
      line: number,
      response: string
    }[]
  }
}

export default function App() {
  const [content, setContent] = useState("");
  const [wordCountCutoff, setWordCountCutoff] = useState(10);
  const [ignoreFile, setIgnoreFile] = useState<IgnoreParams[]>([]);
  const [searchWords, setSearchWords] = useState<SearchWord[]>([]);
  const [displaySelectNew, setDisplaySelectNew] = useState(false);
  const [displaySelectWords, setDisplaySelectWords] = useState(false);

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
  }, [])

  return (
    <HashRouter>

      {content && (
        <div>
          <Header
            displaySelectNew={displaySelectNew}
            displaySelectWords={displaySelectWords}
          ></Header>
        </div>
      )}

      <Routes>
        <Route path="/" element={<LandingPage
          setContent={setContent}
          wordCountCutoff={wordCountCutoff}
          setWordCountCutoff={setWordCountCutoff}
          setDisplaySelectNew={setDisplaySelectNew}
          setDisplaySelectWords={setDisplaySelectWords}
        />} />
        <Route path="/select" element={<SelectPage
          content={content}
          wordCountCutoff={wordCountCutoff}
          ignoreFile={ignoreFile}
          setIgnoreFile={setIgnoreFile}
          searchWords={searchWords}
          setSearchWords={setSearchWords}
          setDisplaySelectNew={setDisplaySelectNew}
          setDisplaySelectWords={setDisplaySelectWords}
        />} />
        <Route path="/display" element={<DisplayPage
          searchWords={searchWords}
          setSearchWords={setSearchWords}
          setDisplaySelectNew={setDisplaySelectNew}
          setDisplaySelectWords={setDisplaySelectWords}
        />} />
      </Routes>
    </HashRouter>
  )
}

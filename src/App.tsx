import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { useState } from "react"
import type { ContextBridgeApi } from '../electron/preload';
import { LandingPage, SelectPage } from "./pages"
import { Header } from "./components"
import 'bootstrap/dist/css/bootstrap.min.css';

declare global {
  interface Window {
    api: ContextBridgeApi
  }
}

export default function App() {
  const [content, setContent] = useState("");
  const [wordCountCutoff, setWordCountCutoff] = useState(5);

  return (
    <HashRouter>
      <div>
        <Header />
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
        />} />
      </Routes>
    </HashRouter>
  )
}

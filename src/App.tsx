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

  return (
    <HashRouter>
      <div>
        <Header />
      </div>

      <Routes>
        <Route path="/" element={<LandingPage
          setContent={setContent}
        />} />
        <Route path="/select" element={<SelectPage
          content={content}
        />} />
      </Routes>
    </HashRouter>
  )
}

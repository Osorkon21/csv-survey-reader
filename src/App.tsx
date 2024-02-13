import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { useState } from "react"
import type { ContextBridgeApi } from '../electron/preload';
import { Header } from "./components"
import 'bootstrap/dist/css/bootstrap.min.css';

declare global {
  interface Window {
    api: ContextBridgeApi
  }
}

export default function App() {
  const [submitError, setSubmitError] = useState("");

  async function handleButtonClick() {
    const filePath = await window.api.openFile();

    console.log(filePath);

    if (filePath) {
      setSubmitError("");
      const content = await window.api.readFile(filePath);
      console.log(content);
    }
    else {
      setSubmitError("Could not read file - only .csv files are accepted. Please try again.")
    }
  }

  return (
    <>
      <Header />
      <button className="btn btn-primary" onClick={handleButtonClick}>Select .csv File</button>
      <div className='text-danger'>{submitError}</div>
    </>

      <BrowserRouter>
        <>
          <div className="">

            <div className='header-container'>
              <Header className="header" />
            </div>
            <HelloUser />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/addgoal" element={<AddGoal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <footer className="footer flex justify-center p-4 text-center">&copy; 2023-2024 SBS Development Group</footer>
          </div>

        </>
      </BrowserRouter>
  )
}

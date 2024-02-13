import { useState } from "react";

interface LandingProps {
  setContent: React.Dispatch<React.SetStateAction<string>>
}

export default function LandingPage({ setContent }: LandingProps) {
  const [submitError, setSubmitError] = useState("");

  async function handleButtonClick() {
    const filePath = await window.api.openFile();

    if (filePath) {
      setSubmitError("");
      const content = await window.api.readFile(filePath);
      setContent(content);
      window.location.href = "#/select";
    }
    else {
      setSubmitError("Could not read file. Please try again.")
    }
  }

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center h-75">
        <button className="btn btn-primary" onClick={handleButtonClick}>Select .csv File</button>
        <div className='text-danger mt-2'>{submitError}</div>
      </div>
    </>
  )
}

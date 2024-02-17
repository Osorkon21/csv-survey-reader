import { useState } from "react";

interface LandingProps {
  setContent: React.Dispatch<React.SetStateAction<string>>
  wordCountCutoff: number
  setWordCountCutoff: React.Dispatch<React.SetStateAction<number>>
}

export default function LandingPage({ setContent, wordCountCutoff, setWordCountCutoff }: LandingProps) {
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

  function handleInputChange(e: any) {
    if (e.target.value < 0)
      return;

    setWordCountCutoff(e.target.value);
  }

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center gap-2" style={{ height: "99%" }}>

        <label htmlFor="word-cutoff">Do not display words that occur fewer than</label>
        <input type="number" value={wordCountCutoff} id="word-cutoff" style={{ width: "60px" }} onChange={handleInputChange}></input>
        <p>times</p>

        <button className="btn btn-primary" onClick={handleButtonClick}>Select .csv File</button>
        <div className='text-danger mt-2'>{submitError}</div>
      </div>
    </>
  )
}

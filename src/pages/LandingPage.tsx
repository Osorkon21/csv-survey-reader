import { useState, useEffect } from "react";

interface LandingProps {
  setContent: React.Dispatch<React.SetStateAction<string>>
  wordCountCutoff: number
  setWordCountCutoff: React.Dispatch<React.SetStateAction<number>>
  setDisplaySelectNew: React.Dispatch<React.SetStateAction<boolean>>
  setDisplaySelectWords: React.Dispatch<React.SetStateAction<boolean>>
}

export default function LandingPage({ setContent, wordCountCutoff, setWordCountCutoff, setDisplaySelectNew, setDisplaySelectWords }: LandingProps) {
  const [submitError, setSubmitError] = useState("");

  async function handleButtonClick(e: any) {
    e.preventDefault();

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

  useEffect(() => {
    setDisplaySelectNew(false);
    setDisplaySelectWords(true);
  }, [])

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "99%" }}>

        <form className="d-flex flex-column align-items-center gap-2" onSubmit={handleButtonClick}>
          <label htmlFor="word-cutoff">Do not display words that occur fewer than</label>
          <input className="mt-2" type="number" value={wordCountCutoff} id="word-cutoff" style={{ width: "60px" }} onChange={handleInputChange}></input>
          <p>times</p>

          <button className="btn btn-primary" type="button" onClick={handleButtonClick}>Select .csv file</button>
        </form>

        <div className='text-danger mt-2'>{submitError}</div>
      </div>
    </>
  )
}

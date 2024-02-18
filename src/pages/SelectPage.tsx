import { useState, useEffect } from "react"
import { IgnoreParams } from "../../electron/handle-functions"

interface SelectProps {
  content: string
  wordCountCutoff: number
  ignoreFile: IgnoreParams[]
  setIgnoreFile: React.Dispatch<React.SetStateAction<IgnoreParams[]>>
  searchWords: string[]
  setSearchWords: React.Dispatch<React.SetStateAction<string[]>>
}

export default function SelectPage({ content, wordCountCutoff, ignoreFile, setIgnoreFile, searchWords, setSearchWords }: SelectProps) {
  /** question index */
  interface Question {
    questionIndex: number
  }

  /** question index, line where value present */
  interface QuestionAndLine extends Question {
    line: number
  }

  /** question index, line where value present, count */
  interface QuestionLineCount extends QuestionAndLine {
    count: number,
  };

  /** count, [{question index, line number}] */
  type WordData = {
    count: number,
    data: QuestionAndLine[]
  }

  // display words (with their counts) next to checkboxes "search by" or "add to ignore list"

  // if "search by" box is checked for a word and "search" button is hit, display all phrases where this word appears, along with the response number (line number, so user can find response if they want more context)

  // display all responses from that line if word in that line is selected for more context?

  // keywords user can search for
  const [wordMap, setWordMap] = useState(new Map<string, WordData>());
  const [display, setDisplay] = useState(false);
  const [defaultWordMap, setDefaultWordMap] = useState(new Map<string, WordData>());

  /** question index, question */
  const questionMap = new Map<number, string>();

  /** question index, line number, phrase */
  const phraseMap = new Map<QuestionAndLine, string>();

  /**
   * Determines whether the string should be filtered out
   * @param arr string to check
   * @returns whether string should be kept
   */
  function shouldAdd(str: string): boolean {
    if (str === "")
      return false;

    const letterCount = str.replace(/[^a-zA-Z]/g, '').length;
    const digitCount = str.replace(/[a-zA-Z]/g, '').length;
    return letterCount >= digitCount;
  }

  /**
   * Adds first line questions to questionMap, optimized for searching by question index
   * @param map first line string with question index and line number
   */
  function processFirstLine(map: Map<string, QuestionAndLine>): void {
    for (let [phrase, qal] of map) {
      questionMap.set(qal.questionIndex, phrase)
    }
  }

  /**
   * Processes a line from a .csv file split by commas, accounts for the presence of delimiters in entries, adds question index and line numbers
   * @param arr the split line to process
   * @param line line number in .csv file
   * @returns map with relevant entries and metadata
   */
  function formatSplitLine(arr: string[], line: number): Map<string, QuestionAndLine> {
    let map = new Map<string, QuestionAndLine>();

    let questionIndex = 0;
    let quoteDetected = false;
    let tempString = "";

    for (let str of arr) {

      if (quoteDetected) {
        if (str[str.length - 1] === "\"" && str[str.length - 2] !== "\"") {
          tempString += str.slice(0, -1);
          quoteDetected = false;
        }
        else
          tempString += str;
      }
      else if (str[0] === "\"" && str[1] !== "\"") {
        quoteDetected = true;
        tempString = str.slice(1);
      }

      if (!quoteDetected) {
        if (tempString !== "") {
          if (shouldAdd(tempString)) {
            map.set(tempString, { questionIndex: questionIndex, line: line })
          }
          tempString = "";
        }
        else if (shouldAdd(str)) {
          map.set(str, { questionIndex: questionIndex, line: line })
        }

        questionIndex++;
      }
    }

    return map;
  }

  /**
   * Takes in a .csv file split by line and determines if entry is unique and relevant
   * @param lines lines of .csv file
   * @returns map with phrase and metadata
   */
  function populatePhraseCounter(lines: string[]): Map<string, QuestionLineCount> {
    let phraseCounter = new Map<string, QuestionLineCount>();

    // ignore survey questions on first line and choices on second line
    for (let i = 2; i < lines.length; i++) {
      let splitLine = lines[i].split(",");

      // account for delimiters in entries, discard unwanted entries
      let formattedLines = formatSplitLine(splitLine, i + 1);

      for (let [phrase, qal] of formattedLines) {
        let phraseCount = phraseCounter.get(phrase);

        if (phraseCount !== undefined) {
          phraseCounter.set(phrase, { ...phraseCount, count: phraseCount.count + 1 });
        }
        else
          phraseCounter.set(phrase, { questionIndex: qal.questionIndex, count: 1, line: qal.line });
      }
    }

    return phraseCounter;
  }

  /**
   * Adds unique phrases and metadata to map
   * @param phraseCounter phrase count with metadata
   */
  function populatePhraseMap(phraseCounter: Map<string, QuestionLineCount>) {
    for (let [phrase, qlc] of phraseCounter) {
      if (qlc.count === 1) {
        phraseMap.set({ questionIndex: qlc.questionIndex, line: qlc.line }, phrase)
      }
    }
  }

  function populateWordCounter(): { [word: string]: WordData } {
    let wordCounter: { [word: string]: WordData } = {};

    for (let [{ questionIndex, line }, phrase] of phraseMap) {
      let words = phrase.split(" ");

      for (let word of words) {
        word = word.toLowerCase();

        if (wordCounter[word] === undefined)
          wordCounter[word] = { count: 0, data: [] }

        wordCounter[word].count++;

        if (!wordCounter[word].data.includes({ questionIndex: questionIndex, line: line }))
          wordCounter[word].data.push({ questionIndex: questionIndex, line: line })
      }
    }

    return wordCounter;
  }

  function populateWordMap(wordCounter: { [word: string]: WordData }) {
    let tempArr: { word: string, data: WordData }[] = [];

    for (let [word, wordData] of Object.entries(wordCounter)) {
      if (wordData.count > wordCountCutoff)
        tempArr.push({ word: word, data: wordData });
    }

    tempArr.sort((a, b) => {
      return b.data.count - a.data.count;
    });

    for (let { word, data } of tempArr) {
      updateWordMap(word, data)
    }

    setWordMap(wordMap);
  }

  function updateWordMap(word: string, data: WordData) {
    if (!ignoreFile.find((ignoreParams) => ignoreParams.word === word)) {
      wordMap.set(word, data);
    }
  }

  function processContent(content: string) {
    // normalize line endings for different OSes
    let lines = content.replace(/\r\n/g, "\n").split("\n");

    // add questions to questionMap
    if (!questionMap.size)
      processFirstLine(formatSplitLine(lines[0].split(","), 1))

    // add relevant phrases with metadata to map
    if (!phraseMap.size)
      populatePhraseMap(populatePhraseCounter(lines));

    // add relevant words with metadata to map
    if (!wordMap.size)
      populateWordMap(populateWordCounter());

    setDisplay(true);
  }

  function createWordList(map: Map<string, WordData>) {
    let clunkyArr: [string, WordData][] = [];

    for (let [key, value] of map) {
      clunkyArr.push([key, value]);
    }

    return clunkyArr;
  }

  function addToIgnoreFile(word: string, permanent: boolean) {
    let newIgnoreFile = [...ignoreFile, { word: word, permanent: permanent }]
    setIgnoreFile(newIgnoreFile);
    window.api.setToStore("ignore-file", newIgnoreFile);
  }

  function handleCheck(e: any) {
    if (searchWords.includes(e.target.name)) {
      searchWords.splice(searchWords.indexOf(e.target.name), 1);
      setSearchWords(searchWords)
    }
    else
      setSearchWords([...searchWords, e.target.name])
  }

  function pruneWordMap() {
    for (let [word, _] of wordMap) {
      if (ignoreFile.find((iParams) => iParams.word === word))
        wordMap.delete(word)
    }

    setWordMap(new Map(wordMap));
  }

  useEffect(() => {
    if (content !== "") {
      processContent(content);
      console.log("content processed")
    }
  }, [content])

  useEffect(() => {
    pruneWordMap();
  }, [ignoreFile])

  return (
    <div className="d-flex flex-column justify-content-center align-items-center gap-2">
      {display && (
        <div className="mt-2" style={{ width: "60vw" }}>
          <button className="btn btn-primary" type="button" onClick={() => console.log("button clicked")}>Display responses containing selected words</button>

          <div className="d-flex justify-content-between mt-2">
            <div className="text-start" style={{ width: "47%" }}>
              Word count
            </div>
            <div className="text-start" style={{ width: "28%" }}>
              Ignore permanently
            </div>
            <div className="text-end" style={{ width: "25%" }}>
              Ignore for session
            </div>
          </div>

          {createWordList(wordMap).map(([word, data]) => {
            return (
              <div key={word} className="d-flex justify-content-between mt-3">

                <div className="form-check d-flex align-items-center gap-2" style={{ width: "100px" }}>
                  <input className="form-check-input" id={word} type="checkbox" name={word} onChange={handleCheck} />
                  <label className="form-check-label d-flex gap-2" htmlFor={word}>
                    <span>{word}</span>
                    <span>{data.count}</span>
                  </label>
                </div>

                <div className="d-flex align-items-center">
                  <button className="btn btn-danger" type="button" onClick={() => addToIgnoreFile(word, true)}>Ignore</button>
                </div>

                <div>
                  <button type="button" onClick={() => addToIgnoreFile(word, false)}>Ignore</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

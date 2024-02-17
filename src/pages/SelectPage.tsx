import { useEffect } from "react"

interface SelectProps {
  content: string
  wordCountCutoff: number
}

export default function SelectPage({ content, wordCountCutoff }: SelectProps) {

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

  // process each line

  // ignore first line
  // split line by commas
  // if phrase is all/mostly numbers, ignore
  // save full phrase for checking against identicals

  // once all lines processed

  // compare phrases, eliminate identicals
  // go thru remaining phrases, lowercase all, do word count
  // check words against temporary and permanent "word ignore list", discard matches

  // display words (with their counts) next to checkboxes "search by" or "add to ignore list"

  // if "search by" box is checked for a word and "search" button is hit, display all phrases where this word appears, along with the response number (line number, so user can find response if they want more context)

  // display all responses from that line if word in that line is selected for more context?

  // const [words, setWords] = useState(new Map<string, WordData>());


  /** question index, question */
  const questionMap = new Map<number, string>();

  /** question index, line number, phrase */
  const phraseMap = new Map<QuestionAndLine, string>();

  /** word, count, [{question index, line number}] */
  const wordMap = new Map<string, WordData>();

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
      wordMap.set(word, data);
    }

    // add logic to filter words that are in ignore list
  }

  function processContent(content: string) {

    // normalize line endings for different OSes
    let lines = content.replace(/\r\n/g, "\n").split("\n");

    // add questions to questionMap
    processFirstLine(formatSplitLine(lines[0].split(","), 1))

    // add relevant phrases with metadata to map
    populatePhraseMap(populatePhraseCounter(lines));

    // add relevant words with metadata to map
    populateWordMap(populateWordCounter());

    console.log(wordMap);
  }

  useEffect(() => {
    console.log("processContent would run")
  }, [])

  return (
    <div className="d-flex flex-column align-items-center gap-2">
      <button onClick={() => processContent(content)}>process content</button>
    </div>
  )
}

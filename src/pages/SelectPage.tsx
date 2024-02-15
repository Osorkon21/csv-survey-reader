import { useState, useEffect } from "react"

interface SelectProps {
  content: string
}

export default function SelectPage({ content }: SelectProps) {

  /** question index, line where value present */
  interface QuestionAndLine {
    questionIndex: number,
    line: number
  }

  /** count, question index, line where value present */
  interface CountQuestionLine extends QuestionAndLine {
    count: number,
  };

  /** count, lines where value present */
  interface CountQuestionLines {
    count: number,
    lines: number[]
  };

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

  const [phrases, setPhrases] = useState([""])

  /** phrase, line number */
  const phraseMap = new Map<string, QuestionAndLine>();

  /** word, [count, line locations] */
  const wordMap = new Map<string, CountQuestionLines>();

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

  function processContent(content: string) {

    /** phrase, {count, question index, line number} */
    let phraseCounter = new Map<string, CountQuestionLine>();

    let lines = content.replace(/\r\n/g, "\n").split("\n");

    // add questions from first line of file to a new QuestionMap

    // ignore survey questions on first line
    for (let i = 1; i < lines.length; i++) {
      let splitLine = lines[i].split(",");

      let formattedLines = formatSplitLine(splitLine, i + 1);

      console.log(formattedLines)

      // for (let [phrase, qal] of formattedPhrases) {
      //   let phraseCount = phraseCounter.get(phrase);

      //   if (phraseCount !== undefined) {
      //     phraseCounter.set(phrase, { ...phraseCount, count: phraseCount.count + 1 });
      //   }
      //   else
      //     phraseCounter.set(phrase, { questionIndex: qal.questionIndex, count: 1, line: i + 1 });
      // }
    }

    // for (let [phrase, cql] of phraseCounter) {
    //   if (cql.count === 1) {
    //     phraseMap.set(phrase, { questionIndex: cql.questionIndex, line: cql.line })
    //   }
    // }

    // console.log(phraseMap);

    // add to wordMap here

    // console.log(filteredFirstResponse.join(" "))
  }

  useEffect(() => {
    console.log("processContent would run")
  }, [])

  return (
    <>
      <button onClick={() => processContent(content)}>process content</button>
    </>
  )
}

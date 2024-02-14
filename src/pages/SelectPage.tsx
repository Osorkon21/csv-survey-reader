import { useState, useEffect } from "react"

interface SelectProps {
  content: string
}

export default function SelectPage({ content }: SelectProps) {

  /** count, line where value present */
  type CountAndLine = {
    count: number,
    lineLoc: number
  };

  /** count, lines where value present */
  type CountAndLines = {
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
  const phraseMap = new Map<string, number>();

  /** word, [count, line locations] */
  const wordMap = new Map<string, CountAndLines>();

  /**
   * Filters empty strings and phrases that are mostly numbers
   * @param arr string array to filter
   * @returns filtered string array
   */
  function firstFilter(arr: string[]): string[] {
    arr = arr.filter((item) => item !== "")

    return arr.filter((item) => {
      const letterCount = item.replace(/[^a-zA-Z]/g, '').length;
      const digitCount = item.replace(/[a-zA-Z]/g, '').length;
      return letterCount >= digitCount;
    });
  }

  function processContent(content: string) {

    /** phrase, [count, line number] */
    let phraseCounter = new Map<string, CountAndLine>();

    let lines = content.replace(/\r\n/g, "\n").split("\n");

    // ignore survey questions on first line
    for (let i = 1; i < lines.length; i++) {
      let filteredPhrases = firstFilter(lines[i].split(","));

      for (let phrase of filteredPhrases) {
        let phraseCount = phraseCounter.get(phrase);

        if (phraseCount !== undefined) {
          phraseCounter.set(phrase, { ...phraseCount, count: phraseCount.count + 1 });
        }
        else
          phraseCounter.set(phrase, { count: 1, lineLoc: i + 1 });
      }
    }

    for (let [phrase, cal] of phraseCounter) {
      if (cal.count === 1) {
        phraseMap.set(phrase, cal.lineLoc)
      }
    }

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

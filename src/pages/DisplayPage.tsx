import { useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';

interface DisplayProps {
  searchWords: SearchWord[]
  setSearchWords: React.Dispatch<React.SetStateAction<SearchWord[]>>
  setDisplaySelectNew: React.Dispatch<React.SetStateAction<boolean>>
  setDisplaySelectWords: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DisplayPage({ searchWords, setSearchWords, setDisplaySelectNew, setDisplaySelectWords }: DisplayProps) {
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function sortSearchWords() {
    searchWords.sort((a, b) => {
      return b.count - a.count
    })

    setSearchWords([...searchWords])
  }

  function getHighlightedText(text: string, highlight: string) {
    const parts = text.split(new RegExp(`\\b(${highlight})\\b`, 'gi'));
    return <span>{parts.map(part => part.toLowerCase() === highlight.toLowerCase() ? <mark key={uuidv4()}>{part}</mark> : part)}</span>;
  }

  useEffect(() => {
    if (searchWords) {
      sortSearchWords();
    }

    setDisplaySelectNew(true);
    setDisplaySelectWords(true);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [])

  return (
    <>
      {!searchWords.length && (
        <div className="mt-5 text-danger">
          No words selected. Go to "Select Words" and check boxes next to words you want to search for.
        </div>
      )}

      {searchWords.map(searchWord => (
        <div key={searchWord.word}>
          <h1 className="mt-4">Responses for "{searchWord.word}"</h1>

          <div className="mt-2" style={{ border: `2px solid ${getRandomColor()}` }}>

            {searchWord.data.map((wordData, index) => (
              <div key={wordData.response}>
                <div className="text-start text-info p-2">Question: <span className="fst-italic">{wordData.question}</span></div>
                <div className=" text-start p-2">Response: {getHighlightedText(wordData.response, searchWord.word)}</div>

                {index !== searchWord.data.length - 1 && (
                  <div style={{ border: `1px solid white` }}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

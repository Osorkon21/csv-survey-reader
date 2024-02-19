import { useEffect } from "react"

interface DisplayProps {
  searchWords: SearchWord[]
  setSearchWords: React.Dispatch<React.SetStateAction<SearchWord[]>>
}

export default function DisplayPage({ searchWords, setSearchWords }: DisplayProps) {
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

  function capitalizeSearchWords(word: string, response: string) {
    let re = new RegExp(`\\b${word}\\b`, "gi");

    return response.replace(re, word.toUpperCase());
  }

  useEffect(() => {
    if (searchWords) {
      sortSearchWords();
    }
  }, [])

  return (
    <>
      {searchWords.map(searchWord => (
        <div key={searchWord.word}>
          <h1 className="mt-4">Responses for "{searchWord.word}"</h1>

          <div className="mt-2" style={{ border: `2px solid ${getRandomColor()}` }}>

            {searchWord.data.map((wordData, index) => (
              <div key={wordData.response}>
                <div className="text-start text-info p-2">Question: <span className="fst-italic">{wordData.question}</span></div>

                {/* highlight search words somehow... */}
                <div className=" text-start p-2">Response: {capitalizeSearchWords(searchWord.word, wordData.response)}</div>

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

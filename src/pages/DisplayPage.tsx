interface DisplayProps {
  searchWords: SearchWord[]
}

export default function DisplayPage({ searchWords }: DisplayProps) {
  function getRandomColor() {
    var letters = '789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 9)];
    }
    return color;
  }

  return (
    <>
      {searchWords.map(searchWord => (
        <>
          <div className="mt-4">{searchWord.word.toUpperCase()}</div>

          <div className="p-2 mt-2" key={searchWord.word} style={{ border: `2px solid ${getRandomColor()}` }}>

            {searchWord.data.map(wordData => (
              <div key={wordData.response}>
                <div className="text-info text-start">QUESTION: <span className="fst-italic">{wordData.question}</span></div>
                <br></br>
                <div className=" text-start">RESPONSE: {wordData.response}</div>
                <br></br>
              </div>))}
          </div>
        </>



      ))}
    </>
  )
}

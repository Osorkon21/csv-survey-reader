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
    <>DISPLAY</>
  )
}

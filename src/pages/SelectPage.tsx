interface SelectProps {
  content: string
}

export default function SelectPage({ content }: SelectProps) {

  return (
    <>
      <button onClick={() => console.log(content)}>show content</button>
    </>
  )
}

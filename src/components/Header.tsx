type HeaderProps = {
  setDefaultIgnoreFile: () => Promise<void>
}

export default function Header({ setDefaultIgnoreFile }: HeaderProps) {
  return (
    <div className="d-flex justify-content-between gap-4">
      <button className="btn btn-success" style={{ fontFamily: "Helvetica serif" }} onClick={() => window.location.href = "#/"}>SELECT FILE</button>

      <button className="btn btn-secondary" style={{ fontFamily: "Helvetica serif" }} onClick={() => window.location.href = "#/select"}>SELECT WORDS</button>

      <button className="btn btn-danger" style={{ fontFamily: "Helvetica serif" }} onClick={() => setDefaultIgnoreFile()}>Set word ignore list to default</button>
    </div>
  )
}

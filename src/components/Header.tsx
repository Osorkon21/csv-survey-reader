type HeaderProps = {
  displaySelectNew: boolean
  displaySelectWords: boolean
}

export default function Header({ displaySelectNew, displaySelectWords }: HeaderProps) {
  return (
    <div className="fixed-top" style={{ width: "100vm", height: !displaySelectWords ? "116px" : "71px", backgroundColor: "#212529" }}>
      <div className="mt-4" style={{ width: "400px", minWidth: "400px", maxWidth: "400px", margin: "auto" }}>
        <div className="d-flex justify-content-between gap-4 w-100">

          {displaySelectNew && (
            <button className="btn btn-success" style={{ fontFamily: "Helvetica" }} onClick={() => window.location.href = "#/"}>Select new .csv</button>
          )}

          {displaySelectWords && (
            <>
              <div></div>
              <button className="btn btn-secondary" style={{ fontFamily: "Helvetica" }} onClick={() => window.location.href = "#/select"}>Select Words</button>
            </>
          )}

          {/* <button className="btn btn-danger" style={{ fontFamily: "Helvetica" }} onClick={() => setDefaultIgnoreFile()}>Restore Default Ignore List</button> */}
        </div>
      </div>

      {!displaySelectWords && (
        <button className="btn btn-primary mt-2" type="button" style={{ fontFamily: "Helvetica" }} onClick={() => window.location.href = "#/display"}>Show Selected Responses</button>
      )}
    </div>

  )
}

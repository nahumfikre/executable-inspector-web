import React, { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    setBusy(true);
    setText("");
    try {
      const res = await fetch("/api/inspect", { method: "POST", body: data });
      const json = await res.json();
      if (json.error) {
        setText(`error: ${json.error}${json.stderr ? "\n" + json.stderr : ""}`);
      } else {
        setText(json.output || "(no output)");
      }
    } catch (err) {
      setText("request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>Executable Inspector</h1>
      <p style={{ color: "#444" }}>Upload a file. The server runs the C++ inspector and prints the header info.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16 }}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button type="submit" disabled={!file || busy} style={{ padding: "8px 14px", cursor: busy ? "not-allowed" : "pointer" }}>
          {busy ? "Inspecting..." : "Inspect"}
        </button>
      </form>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 14, color: "#555", marginBottom: 6 }}>Output:</div>
        <pre style={{ background: "#f6f6f6", padding: 12, border: "1px solid #e5e5e5", borderRadius: 6, whiteSpace: "pre-wrap" }}>
{text || "—"}
        </pre>
      </div>
    </div>
  );
}
export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
      }}
    >
      <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: "4px solid #ddd",
            borderTopColor: "#111",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <div style={{ fontSize: 14, opacity: 0.7 }}>Loading...</div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

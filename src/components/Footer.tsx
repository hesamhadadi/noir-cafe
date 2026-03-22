export default function Footer() {
  return (
    <footer
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        padding: "4rem 5vw 3rem",
        borderTop: "1px solid var(--border)",
      }}
    >
      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2rem", fontWeight: 700, fontStyle: "italic", color: "var(--gold)" }}>
        Noir.
      </span>
      <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", color: "rgba(237,229,216,0.2)" }}>
        © 2024 NOIR CAFÉ · All rights reserved
      </span>
    </footer>
  );
}

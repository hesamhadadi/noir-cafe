export default function Nav() {
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:500, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.8rem 5vw", background:"linear-gradient(to bottom,rgba(6,4,10,.9),transparent)", pointerEvents:"none" }}>
      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.6rem", fontWeight:700, fontStyle:"italic", color:"var(--gold)", letterSpacing:"0.06em" }}>
        Noir.
      </span>
      <span style={{ fontSize:"0.6rem", letterSpacing:"0.45em", textTransform:"uppercase", color:"var(--muted)" }}>
        Specialty Coffee — Est. 2019
      </span>
    </nav>
  );
}

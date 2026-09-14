const productLinks = [
  { label: "Airport map", href: "#map" },
  { label: "Aircraft profiles", href: "#aircraft" },
  { label: "FAR/AIM reference", href: "#far-aim" },
  { label: "Nav log", href: "#nav-log" },
];

const companyLinks = [
  { label: "About", href: "#top" },
  { label: "Contact", href: "mailto:hello@vysion.app" },
  { label: "Waitlist", href: "#waitlist" },
];

export default function Footer() {
  return (
    <footer className="footer surface-light">
      <div className="container footer__grid grid">
        <div className="footer__brand-col">
          <p className="footer__brand">VYSION</p>
          <p className="body footer__copy">
            © {new Date().getFullYear()} VYSION. Built for pilots.
          </p>
        </div>

        <div className="footer__links footer__links-col">
          <div>
            <p className="label footer__col-title">Product</p>
            <ul className="footer__col-list">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label footer__col-title">Company</p>
            <ul className="footer__col-list">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

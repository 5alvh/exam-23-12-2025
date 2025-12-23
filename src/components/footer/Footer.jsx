import './footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-contenedor">
                <span className="footer-text">
                    © {new Date().getFullYear()} TechSpecs Manager. Todos los derechos reservados.
                </span>

                <nav className="footer-nav">
                    <a>Sobre Nosotros</a>
                </nav>
            </div>
        </footer>
    )
}

import './sobreNosotros.css'

import Header from '../header/Header'
export default function SobreNosotros() {
    return (
        <>  
        <Header></Header>
            <section className="sobre">
                <div className="sobre-contenedor">
                    <h2>Sobre Nosotros</h2>
                    <p>
                        TechSpecs Manager es una plataforma diseñada para organizar,
                        gestionar y consultar especificaciones técnicas de forma clara,
                        rápida y eficiente.
                    </p>
                </div>
            </section>
        </>

    )
}

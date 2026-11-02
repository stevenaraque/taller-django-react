import { useState } from 'react'
import Velocista from './modulos/Velocista'
import Portero from './modulos/Portero'
import Pentatlon from './modulos/Pentatlon'

// El panel del taller. Cada modulo es una arena: pide algo tecnico concreto
// al estudiante, mide el resultado y decide quien se gana el bombombun.
// El docente elige la arena desde el panel de la izquierda.
const MODULOS = [
  {
    id: 'velocista',
    nombre: 'El Velocista',
    dia: 'Día 1 · consulta',
    lema: 'La consulta al backend más rápida del salón gana',
    Componente: Velocista,
  },
  {
    id: 'portero',
    nombre: 'El Portero',
    dia: 'Día 2 · CORS',
    lema: 'La consola de F12 limpia vale un bombombun',
    Componente: Portero,
  },
  {
    id: 'pentatlon',
    nombre: 'El Pentatlon',
    dia: 'Día 3 · CRUD',
    lema: 'Cinco verbos HTTP corridos contra un solo reloj',
    Componente: Pentatlon,
  },
]

function App() {
  const [activo, setActivo] = useState('velocista')

  const modulo = MODULOS.find((item) => item.id === activo)
  const ArenaActiva = modulo.Componente

  return (
    <div className="layout">
      <aside>
        <div className="marca">
          <span className="marca-titulo">Taller Django + React</span>
          <span className="marca-sub">Panel de modulos de prueba</span>
        </div>

        <nav className="panel-modulos">
          {MODULOS.map((item) => (
            <button
              key={item.id}
              className="hub-ficha"
              data-activa={item.id === activo}
              onClick={() => setActivo(item.id)}
            >
              <span className="hub-nombre">{item.nombre}</span>
              <span className="hub-dia">{item.dia}</span>
            </button>
          ))}
        </nav>

        <p className="lateral-pie">
          API de Django en el puerto 8000,
          <br />
          React en el 5173 y
          <br />
          PostgreSQL guardando de verdad.
        </p>
      </aside>

      <main className="arena">
        <header className="arena-cabecera">
          <span className="arena-dia">{modulo.dia}</span>
          <h1 className="arena-titulo">{modulo.nombre}</h1>
          <p className="arena-lema">{modulo.lema}</p>
        </header>

        <div className="arena-cuerpo">
          <ArenaActiva />
        </div>

        <footer className="panel-pie">
          La plantilla solo mide y verifica. El reto de estilos del día 3 es
          donde los estudiantes dejan el panel a su gusto.
        </footer>
      </main>
    </div>
  )
}

export default App

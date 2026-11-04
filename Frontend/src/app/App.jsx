import { useEffect, useState } from 'react'
import ArenaTabs from '../features/arenas/ArenaTabs'
import { ARENAS } from '../features/arenas/arenas'
import MissionNavigation from '../features/misiones/MissionNavigation'
import { MISIONES } from '../features/misiones/catalogo'
import Mini1Boveda from '../features/misiones/dia1/Mini1_Boveda'
import Mini2Arquitecto from '../features/misiones/dia1/Mini2_Arquitecto'
import Mini3JefeMaestro from '../features/misiones/dia1/Mini3_JefeMaestro'
import Mini4Escudo from '../features/misiones/dia1/Mini4_Escudo'
import Mini5Velocista from '../features/misiones/dia1/Mini5_Velocista'
import Mini6Camaleon from '../features/misiones/dia2/Mini6_Camaleon'
import Mini7Albannil from '../features/misiones/dia2/Mini7_Albannil'
import Mini8Impulso from '../features/misiones/dia2/Mini8_Impulso'
import Mini9Portero from '../features/misiones/dia2/Mini9_Portero'
import Mini10Render from '../features/misiones/dia2/Mini10_Render'
import Mini11Avalancha from '../features/misiones/dia3/Mini11_Avalancha'
import Mini12Analista from '../features/misiones/dia3/Mini12_Analista'
import Mini13AgujaPajar from '../features/misiones/dia3/Mini13_AgujaPajar'
import Mini14Regulador from '../features/misiones/dia3/Mini14_Regulador'
import Mini15Limpiador from '../features/misiones/dia3/Mini15_Limpiador'
import {
  aprobarMision,
  borrarTablero,
  leerAprobadas,
} from '../features/progreso/estadoMisiones'

const COMPONENTES_MISION = {
  1: Mini1Boveda,
  2: Mini2Arquitecto,
  3: Mini3JefeMaestro,
  4: Mini4Escudo,
  5: Mini5Velocista,
  6: Mini6Camaleon,
  7: Mini7Albannil,
  8: Mini8Impulso,
  9: Mini9Portero,
  10: Mini10Render,
  11: Mini11Avalancha,
  12: Mini12Analista,
  13: Mini13AgujaPajar,
  14: Mini14Regulador,
  15: Mini15Limpiador,
}

export default function App() {
  const [aprobadas, setAprobadas] = useState(leerAprobadas())
  const [arenaActiva, setArenaActiva] = useState(1)
  const [misionActiva, setMisionActiva] = useState(1)

  const arenaActual = ARENAS.find((arena) => arena.numero === arenaActiva)
  const misionesActuales = MISIONES.filter((mision) => mision.dia === arenaActiva)
  const ComponenteMision = COMPONENTES_MISION[misionActiva]
  const porcentaje = (aprobadas.length / MISIONES.length) * 100

  useEffect(() => {
    document.title = `Taller SECOP II · ${aprobadas.length}/${MISIONES.length}`
  }, [aprobadas])

  function estanAprobadas(numeros) {
    return numeros.every((numero) => aprobadas.includes(numero))
  }

  function puedeAbrirMision(numero) {
    if (numero === 1) return true
    if (numero === 6) {
      return aprobadas.includes(5) || estanAprobadas([1, 2, 3])
    }
    return aprobadas.includes(numero - 1)
  }

  function puedeAbrirArena(numero) {
    if (numero === 1) return true
    if (numero === 2) return estanAprobadas([1, 2, 3])
    if (numero === 3) {
      return estanAprobadas([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    }
    return false
  }

  function cambiarArena(numero) {
    if (!puedeAbrirArena(numero)) return

    setArenaActiva(numero)
    const misionesDelDia = MISIONES.filter((mision) => mision.dia === numero)
    const siguienteMision = misionesDelDia.find(
      (mision) => !aprobadas.includes(mision.numero),
    )

    setMisionActiva((siguienteMision || misionesDelDia[0]).numero)
  }

  function aprobarSeleccionada() {
    aprobarMision(misionActiva)
    setAprobadas(leerAprobadas())
  }

  function reiniciarProgreso() {
    borrarTablero()
    setAprobadas([])
    setArenaActiva(1)
    setMisionActiva(1)
  }

  return (
    <div className="app-shell">
      <header className="masthead">
        <div className="marca">
          <p className="brand-kicker">Plataforma de análisis · SECOP II</p>
          <h1>Taller Django + React</h1>
          <p className="masthead-note">Contratos públicos colombianos</p>
        </div>

        <div className="masthead-controls">
          <div className="progress-summary">
            <div className="progress-copy">
              <span>Progreso del taller</span>
              <strong>{aprobadas.length}/{MISIONES.length}</strong>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Misiones aprobadas"
              aria-valuemin={0}
              aria-valuemax={MISIONES.length}
              aria-valuenow={aprobadas.length}
            >
              <span style={{ width: `${porcentaje}%` }} />
            </div>
          </div>
          <div className="header-actions">
            <button
              className="boton boton-secundario"
              type="button"
              onClick={reiniciarProgreso}
            >
              Reiniciar progreso
            </button>
          </div>
        </div>
      </header>

      <ArenaTabs
        arenas={ARENAS}
        arenaActiva={arenaActiva}
        misiones={MISIONES}
        aprobadas={aprobadas}
        puedeAbrirArena={puedeAbrirArena}
        onCambiarArena={cambiarArena}
      />

      <main className="workbench">
        <MissionNavigation
          misiones={misionesActuales}
          misionActiva={misionActiva}
          aprobadas={aprobadas}
          puedeAbrirMision={puedeAbrirMision}
          onSeleccionarMision={setMisionActiva}
        />

        <section className="mission-workspace" aria-label="Misión seleccionada">
          <div className="workspace-meta">
            <span>{arenaActual.enfoque}</span>
            <span>Reto {misionActiva} de {MISIONES.length}</span>
          </div>
          <ComponenteMision
            key={misionActiva}
            desbloqueada={puedeAbrirMision(misionActiva)}
            aprobada={aprobadas.includes(misionActiva)}
            alAprobar={aprobarSeleccionada}
          />
        </section>
      </main>

      <footer className="app-footer">
        API Django :8000 <span aria-hidden="true">/</span> React :5173
        <span aria-hidden="true">/</span> PostgreSQL 18
      </footer>
    </div>
  )
}

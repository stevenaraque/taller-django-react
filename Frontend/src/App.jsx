// ============================================================
// App.jsx — el centro de control del taller SECOP II.
//
// Tres arenas, una por día, y cada arena un ACORDEÓN de pasos
// numerados (las 15 mini-tareas del taller):
//   * DÍA 1 · El Velocista   -> Django + PostgreSQL   (minis 1..5)
//   * DÍA 2 · El Portero     -> React + CORS         (minis 6..10)
//   * DÍA 3 · Pentatlón BD   -> bulk, aggregate, search,
//                               paginación y limpieza (minis 11..15)
//
// El candado es SECUENCIAL: cada día se abre cuando TODO el día
// anterior quedó aprobado. El modo instructor desbloquea todo
// para ensayar la clase con la plantilla fresca.
//
// El aparato de medición del panel mide y verifica: la teoría que
// suelta el instructor rota por los "⏸ INSTRUCTORES" de cada
// misión (Steven/Yesid).
// ============================================================
import { useEffect, useState } from 'react'
import {
  MISIONES,
  leerAprobadas,
  aprobarMision,
  borrarTablero,
  leerModoInstructor,
  alternarModoInstructor,
} from './estadoMisiones'
import Mini1Boveda from './dia1/Mini1_Boveda'
import Mini2Arquitecto from './dia1/Mini2_Arquitecto'
import Mini3JefeMaestro from './dia1/Mini3_JefeMaestro'
import Mini4Escudo from './dia1/Mini4_Escudo'
import Mini5Velocista from './dia1/Mini5_Velocista'
import Mini6Camaleon from './dia2/Mini6_Camaleon'
import Mini7Albannil from './dia2/Mini7_Albannil'
import Mini8Impulso from './dia2/Mini8_Impulso'
import Mini9Portero from './dia2/Mini9_Portero'
import Mini10Render from './dia2/Mini10_Render'
import Mini11Avalancha from './dia3/Mini11_Avalancha'
import Mini12Analista from './dia3/Mini12_Analista'
import Mini13AgujaPajar from './dia3/Mini13_AgujaPajar'
import Mini14Regulador from './dia3/Mini14_Regulador'
import Mini15Limpiador from './dia3/Mini15_Limpiador'

// La agenda: cada entrada sabe su arena, su misión y su componente.
const MISIONES_DEL_DIA = {
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

// La metadata de los tres días (arena + lema), tal como la vive la clase.
const DIAS = [
  {
    numero: 1,
    alias: 'Día 1',
    arena: 'El Velocista',
    lema: 'Backend Django + PostgreSQL · una API donde cada respuesta se cronometra',
  },
  {
    numero: 2,
    alias: 'Día 2',
    arena: 'El Portero',
    lema: 'React + CORS · la consola limpia vale un bombombún',
  },
  {
    numero: 3,
    alias: 'Día 3',
    arena: 'Pentatlón Big Data',
    lema: 'Alto rendimiento · bulk_create, aggregate, SearchFilter, paginación y limpieza',
  },
]

export default function App() {
  const [aprobadas, setAprobadas] = useState(leerAprobadas())
  const [diaActivo, setDiaActivo] = useState(1)
  const [modoInstructor, setModoInstructor] = useState(leerModoInstructor())

  useEffect(() => {
    // Saluda con el avance que ya trae guardado el navegador.
    document.title = `Taller SECOP II · ${aprobadas.length}/15 misiones`
  }, [aprobadas])

  function alAprobar(numero) {
    aprobarMision(numero)
    setAprobadas(leerAprobadas())
  }

  function alternarInstructor() {
    const nuevo = alternarModoInstructor()
    setModoInstructor(nuevo)
    // Al reabrir, leo de nuevo el tablero del localStorage.
    setAprobadas(leerAprobadas())
  }

  function reiniciar() {
    borrarTablero()
    setAprobadas([])
  }

  // Candado: una misión está abierta si es la 1, si la ANTERIOR
  // quedó aprobada, o si el modo instructor abrió el taller.
  // PUENTE DEL PORTERO: la misión 6 abre también cuando los minis
  // 1..4 están aprobados, porque el Velocista (Mini 5) no cruza la
  // frontera hasta que el RETO 9 abra CORS. Este puente evita el
  // encierro: Día 1 quedaba trabado esperando una puerta que solo
  // se abre en Día 2.
  function abrenMision(numero) {
    if (modoInstructor) return true
    if (numero === 1) return true
    if (numero === 6) {
      if (aprobadas.includes(5)) return true
      return [1, 2, 3, 4].every((n) => aprobadas.includes(n))
    }
    return aprobadas.includes(numero - 1)
  }

  // Candado de ARENA (día): se abre si toda la arena anterior
  // quedó aprobada (o con el modo instructor). Día 3 exige las
  // 10 misiones de los días 1 y 2 completas.
  // PUENTE DEL PORTERO: Día 2 abre con los minis 1..4 de Día 1
  // (la misión 5 queda debiendo y se aprueba después del RETO 9).
  function abreDia(numero) {
    if (modoInstructor) return true
    if (numero === 1) return true
    if (numero === 2) {
      return [1, 2, 3, 4].every((n) => aprobadas.includes(n))
    }
    const hasta = 5 * (numero - 1)
    return aprobadas.filter((n) => n <= hasta).length >= hasta
  }

  return (
    <div className="layout">
      <aside>
        <div className="marca">
          <span className="marca-titulo">Taller SECOP II</span>
          <span className="marca-sub">Django + React + PostgreSQL</span>
        </div>

        <nav className="panel-modulos">
          {DIAS.map((dia) => (
            <button
              key={dia.numero}
              className="hub-ficha"
              data-activa={dia.numero === diaActivo}
              data-cerrada={!abreDia(dia.numero)}
              onClick={() => abreDia(dia.numero) && setDiaActivo(dia.numero)}
            >
              <span className="hub-nombre">
                {dia.alias} · {dia.arena}
              </span>
              <span className="hub-dia">{dia.lema}</span>
            </button>
          ))}
        </nav>

        <p className="lateral-pie">
          <b>{aprobadas.length}/15</b> misiones aprobadas
          <br />
          API Django en <b>:8000</b> · React en <b>:5173</b>
          <br />
          PostgreSQL <b>18</b> guardando de verdad
        </p>

        <div className="puerta-instructor">
          <button className="boton boton-mini" onClick={alternarInstructor}>
            {modoInstructor ? 'Modo instructor: ON' : 'Modo instructor: OFF'}
          </button>
          <button className="boton boton-mini" onClick={reiniciar}>
            Reiniciar tablero
          </button>
        </div>
      </aside>

      <main className="arena">
        <header className="arena-cabecera">
          <span className="arena-dia">{DIAS[diaActivo - 1].alias}</span>
          <h1 className="arena-titulo">{DIAS[diaActivo - 1].arena}</h1>
          <p className="arena-lema">{DIAS[diaActivo - 1].lema}</p>
        </header>

        <div className="arena-cuerpo">
          {/* ACORDEÓN: las misiones del día activo, cada una un paso. */}
          <section className="agenda">
            {MISIONES.map(({ numero, dia, alias }) => {
              if (dia !== diaActivo) return null
              const Componente = MISIONES_DEL_DIA[numero]
              return (
                <Componente
                  key={numero}
                  alias={alias}
                  desbloqueada={abrenMision(numero)}
                  aprobada={aprobadas.includes(numero)}
                  alAprobar={() => alAprobar(numero)}
                />
              )
            })}
          </section>
        </div>

        <footer className="panel-pie">
          Plantilla del taller ADSO · cada misión aprueba sola cuando el
          backend/React responde lo esperado. La teoría del concepto está en
          el bloque "⏸ INSTRUCTORES" de cada paso.
        </footer>
      </main>
    </div>
  )
}

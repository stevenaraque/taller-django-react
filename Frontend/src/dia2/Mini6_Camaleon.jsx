// ============================================================
// Mini6_Camaleon.jsx — DÍA 2 · Mini 6 "El Camaleón"
//
// Primer componente del estudiante: camuflar el camaleón con
// JSX y proyectar un TÍTULO GIGANTE en la pantalla. Reto de
// ESCRITURA: no hay verificación automática; el instructor da
// el visto bueno en clase y la misión queda aprobada por mano.
// ============================================================
import MisionMarco from '../MisionMarco'

const INSTRUCCION =
  'TODO (RETO 6): crea tu primer componente en src/ del frontend: un ' +
  'componente Camaleon con un <h1 className="titulo-gigante"> que diga ' +
  'tu nombre. Anota la anatomía: función flecha + return de JSX + ' +
  'export default.'

export default function Mini6Camaleon({ desbloqueada, aprobada, alAprobar }) {
  return (
    <MisionMarco
      alias="Mini 6"
      titulo="El Camaleón"
      teoria="JSX NO es HTML: es una función que devuelve el árbol de JavaScript. Dibuja el árbol en el tablero (App -> Arenas -> Mini6) y muestra el inicio del camaleón en pantalla antes de soltar el teclado."
      desbloqueada={desbloqueada}
      aprobada={aprobada}
      manual
      alAprobar={alAprobar}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>
      <pre className="mision-pizarra">
        {`// Camaleon.jsx — TODO (RETO 6)
export default function Camaleon() {
  return (
    <h1 className="titulo-gigante">
      ¡Yo soy [TU NOMBRE] y este es mi primer camaleón!
    </h1>
  )
}`}
      </pre>
    </MisionMarco>
  )
}

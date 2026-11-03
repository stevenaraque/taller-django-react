// ============================================================
// Mini7_Albannil.jsx — DÍA 2 · Mini 7 "El Albañil"
//
// El estado del componente: el estudiante construye un contador
// con useState.
//
// TODO (RETO 7): reto de ESCRITURA en src/. No hay chequeo
// automático: el instructor da el visto bueno en clase y
// aprueba la misión desde este panel.
// ============================================================
import { useState } from 'react'
import MisionMarco from '../MisionMarco'

const INSTRUCCION =
  'TODO (RETO 7): escribe un componente contador con useState. La clave: ' +
  'const [cuenta, setCuenta] = useState(0). El botón llama setCuenta y ' +
  'React re-renderiza el componente por ti.'

// Demo del panel (no es lo que el estudiante escribe): muestra
// useState funcionando en vivo para que la clase entienda el
// ciclo clic -> setState -> re-render antes de escribir su propio.
function DemoViva() {
  const [cuenta, setCuenta] = useState(0)

  return (
    <div className="demo-estado">
      <span className="demo-numero">{cuenta}</span>
      <button className="boton" onClick={() => setCuenta(cuenta + 1)}>
        Contar +1
      </button>
      <span className="celda-suave">
        así trabaja useState: cambiar el estado re-renderiza el componente
      </span>
    </div>
  )
}

export default function Mini7Albannil({ desbloqueada, aprobada, alAprobar }) {
  return (
    <MisionMarco
      alias="Mini 7"
      titulo="El Albañil"
      teoria="Corre la demo viva ANTES de soltar el teclado: el clic calcula el nuevo estado y React vuelve a renderizar. Explica el par [valor, setter] que devuelve useState y por qué el estado sobrevive el re-render."
      desbloqueada={desbloqueada}
      aprobada={aprobada}
      manual
      alAprobar={alAprobar}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>
      <DemoViva />
      <pre className="mision-pizarra" style={{ marginTop: 12 }}>
        {`// Contador.jsx — TODO (RETO 7)
import { useState } from 'react'

export default function Contador() {
  const [cuenta, setCuenta] = useState(0)
  return (
    <div>
      <p>Piezas colocadas: {cuenta}</p>
      <button onClick={() => setCuenta(cuenta + 1)}>Colocar pieza</button>
    </div>
  )
}`}
      </pre>
    </MisionMarco>
  )
}

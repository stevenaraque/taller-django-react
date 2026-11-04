import { useState } from 'react'

export default function Contador() {
  const [cuenta, setCuenta] = useState(0)

  return (
    <div className="demo-estado">
      <output className="demo-numero" data-cuenta>{cuenta}</output>
      <button
        className="boton"
        type="button"
        data-aumentar
        onClick={() => setCuenta(cuenta + 1)}
      >
        Colocar pieza
      </button>
    </div>
  )
}

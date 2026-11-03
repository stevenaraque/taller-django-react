// ============================================================
// Mini4_Escudo.jsx — DÍA 1 · Mini 4 "El Escudo"
//
// El serializer es el guardia de la puerta: recibe JSON, lo
// revisa campo por campo, y si algo no cumple responde HTTP 400
// sin que la basura toque la base de datos.
//
// TODO (RETO 4): escribir el ContratoSerializer en
// Backend/contratos/serializers.py (instrucciones comentadas ahí).
//
// La misión lanza UN JSON malformado a propósito; se aprueba SOLO
// cuando Django responde HTTP 400 bien formado (con su dictado
// de errores). Hasta que la ruta del RETO 5 exista, la prueba
// queda "sin ruta" — el propio panel lo explica.
// ============================================================
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, peticion } from '../api'

const INSTRUCCION =
  'TODO (RETO 4): escribe el ContratoSerializer en ' +
  'Backend/contratos/serializers.py. Este panel lanza un JSON malformado ' +
  '(sin id_contrato y con valor_total = "hola") y espera que Django lo ' +
  'RECHACE respondiendo un HTTP 400 bien formado.'

export default function Mini4Escudo({ desbloqueada, aprobada, alAprobar }) {
  const [prueba, setPrueba] = useState(null)
  const [falla, setFalla] = useState(null)
  const [lanzando, setLanzando] = useState(false)

  // El ataque del escudo: JSON malformado + Content-Type json.
  async function atacarEscudo() {
    setLanzando(true)
    setFalla(null)
    setPrueba(null)

    try {
      const { respuesta, ms } = await peticion(`${API_URL}/contratos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor_total: 'hola, sin id ni entidad' }),
      })
      const cuerpo = await respuesta.json().catch(() => null)

      setPrueba({
        codigo: respuesta.status,
        ms,
        rechazado: respuesta.status === 400,
        cuerpo,
      })

      // VICTORIA: el serializer devolvió el HTTP 400 con su dictado.
      if (respuesta.status === 400) alAprobar()
    } catch (laRedRota) {
      setFalla(laRedRota.message)
    } finally {
      setLanzando(false)
    }
  }

  return (
    <MisionMarco
      alias="Mini 4"
      titulo="El Escudo"
      teoria='Este es el punto perfecto para explicar "Django no confía en el exterior". Proyecta el JSON malformado y muestra cómo el serializer lo filtra ANTES de la base de datos. Nota didáctica: la prueba necesita la ruta del Mini 5; si responde "sin ruta", corre el RETO 5 y vuelve.'
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        <button className="boton" onClick={atacarEscudo} disabled={lanzando}>
          {lanzando ? 'Atacando el escudo...' : 'Atacar el escudo (JSON malformado)'}
        </button>
        <span className="celda-suave">
          POST /api/contratos/ · el escudo DEBE responder 400
        </span>
      </div>

      {falla && <div className="aviso" data-tipo="error">{falla}</div>}

      {prueba && (
        <table className="tabla" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th className="numero">ms</th>
              <th className="numero">Código</th>
              <th>Veredicto</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="numero">{prueba.ms}</td>
              <td className="numero">{prueba.codigo}</td>
              <td className="celda-suave">
                {prueba.rechazado
                  ? 'el escudo bloqueó el dato — VICTORIA del serializer'
                  : prueba.codigo === 404
                    ? 'todavía no existe la ruta: completa el RETO 5 (Mini 5) y vuelve'
                    : 'el escudo NO bloqueó el dato: revisa el serializer'}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {prueba?.cuerpo && (
        <p className="mision-instruccion" style={{ marginTop: 10 }}>
          Lo que respondió Django: <code>{JSON.stringify(prueba.cuerpo)}</code>
        </p>
      )}
    </MisionMarco>
  )
}

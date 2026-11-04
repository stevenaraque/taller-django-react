import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, peticion } from '../../../shared/api'

const ENCABEZADOS = { 'Content-Type': 'application/json' }

const DATO_NEGATIVO = {
  id_contrato: 'PRUEBA-NEGATIVA',
  entidad_compradora: 'Entidad de prueba',
  descripcion: 'Escudo contra contratos con valor negativo',
  valor_total: -1,
  estado: 'Activo',
  fecha_firma: '2026-01-01',
}

const INSTRUCCION =
  'En Backend/contratos/serializers.py configura extra_kwargs para que ' +
  'valor_total no acepte negativos (min_value: 0). El panel lanza dos ataques: ' +
  'un JSON malformado y un contrato completo pero con valor_total = -1; los dos ' +
  'deben responder 400.'

export default function Mini4Escudo({ desbloqueada, aprobada, alAprobar }) {
  const [prueba, setPrueba] = useState(null)
  const [falla, setFalla] = useState(null)
  const [lanzando, setLanzando] = useState(false)

  async function atacarEscudo() {
    setLanzando(true)
    setFalla(null)
    setPrueba(null)

    try {
      const { respuesta: primera } = await peticion(
        `${API_URL}/contratos/`,
        {
          method: 'POST',
          headers: ENCABEZADOS,
          body: JSON.stringify({ valor_total: 'hola, sin id ni entidad' }),
        },
      )
      await primera.json().catch(() => null)

      const { respuesta: segunda, ms } = await peticion(`${API_URL}/contratos/`, {
        method: 'POST',
        headers: ENCABEZADOS,
        body: JSON.stringify(DATO_NEGATIVO),
      })
      await segunda.json().catch(() => null)

      setPrueba({
        codigoMalformado: primera.status,
        codigoNegativo: segunda.status,
        ms,
      })

      if (primera.status === 400 && segunda.status === 400) alAprobar()
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
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        <button className="boton" onClick={atacarEscudo} disabled={lanzando}>
          {lanzando ? 'Atacando el escudo...' : 'Los dos ataques'}
        </button>
        <span className="celda-suave">
          POST /api/contratos/ · el escudo DEBE responder 400 en los dos
        </span>
      </div>

      {falla && <div className="aviso" data-tipo="error">{falla}</div>}

      {prueba && (
        <table className="tabla" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Ataque</th>
              <th className="numero">Código</th>
              <th>Veredicto</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>JSON malformado</td>
              <td className="numero">{prueba.codigoMalformado}</td>
              <td className="celda-suave">
                {prueba.codigoMalformado === 400
                  ? 'bloqueado'
                  : prueba.codigoMalformado === 404
                    ? '404: completa el Mini 5 y vuelve'
                    : 'el escudo NO bloqueó este ataque'}
              </td>
            </tr>
            <tr>
              <td>valor_total = -1</td>
              <td className="numero">{prueba.codigoNegativo}</td>
              <td className="celda-suave">
                {prueba.codigoNegativo === 400
                  ? 'bloqueado: el serializer valida valores negativos'
                  : 'falta la validación con min_value: 0'}
              </td>
            </tr>
            <tr>
              <td>ms del segundo asalto</td>
              <td className="numero">{prueba.ms}</td>
              <td className="celda-suave">tiempo de respuesta de Django</td>
            </tr>
          </tbody>
        </table>
      )}

      {prueba?.codigoNegativo !== 400 && (
        <p className="mision-instruccion" style={{ marginTop: 10 }}>
          Pista: en el <code>Meta</code> del serializer,{' '}
          <code>extra_kwargs = {'{'}&apos;valor_total&apos;: {'{'}&apos;min_value&apos;: 0{'}'}{'}'}</code>{' '}
          convierte cada campo en una regla del escudo.
        </p>
      )}
    </MisionMarco>
  )
}

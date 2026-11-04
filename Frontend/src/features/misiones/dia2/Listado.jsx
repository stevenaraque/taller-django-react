import { useEffect, useState } from 'react'
import { API_URL } from '../../../shared/api'

export default function Listado() {
  const [contratos, setContratos] = useState([])
  const [falla, setFalla] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/contratos/`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)
        return respuesta.json()
      })
      .then((datos) => {
        const listado = Array.isArray(datos) ? datos : datos.results || []
        setContratos(listado)
      })
      .catch((error) => setFalla(error.message))
  }, [])

  if (falla) return <p className="aviso" data-tipo="error">{falla}</p>

  return (
    <ul>
      {contratos.map((contrato) => (
        <li
          key={contrato.id_contrato}
          data-id-contrato={contrato.id_contrato}
        >
          {contrato.id_contrato} · {contrato.entidad_compradora}
        </li>
      ))}
    </ul>
  )
}

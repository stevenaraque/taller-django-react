import { useState } from 'react'

const API_URL = 'http://127.0.0.1:8000/api/tareas/'

/**
 * Formulario: crea tareas con POST. Al guardar avisa con `alCrear`
 * (la app recarga la lista). Solo estado local, sin artificios.
 */
function Formulario({ alCrear }) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function manejarSubmit(evento) {
    evento.preventDefault()
    if (!titulo.trim() || enviando) return
    setEnviando(true)
    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
        }),
      })
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)
      setTitulo('')
      setDescripcion('')
      alCrear()
    } catch (error) {
      console.error('Error al crear la tarea:', error)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" onSubmit={manejarSubmit}>
      <input
        className="formulario-input"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="¿Qué tarea vas a crear?"
        aria-label="Título de la tarea"
      />
      <input
        className="formulario-input"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción (opcional)"
        aria-label="Descripción de la tarea"
      />
      <button className="formulario-boton" type="submit" disabled={enviando}>
        {enviando ? 'Guardando...' : 'Crear tarea'}
      </button>
    </form>
  )
}

export default Formulario

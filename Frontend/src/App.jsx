import { useState, useEffect, useCallback } from 'react'
import Cronometro from './Cronometro'
import ListaTareas from './ListaTareas'
import Formulario from './Formulario'

const API_URL = 'http://127.0.0.1:8000/api/tareas/'

function App() {
  const [tareas, setTareas] = useState([])
  const [ms, setMs] = useState(null)
  const [error, setError] = useState(null)

  // Carga la lista midiendo el tiempo que tarda (ms se la pasa al Cronometro)
  const cargarTareas = useCallback(async () => {
    const inicio = performance.now()
    try {
      const respuesta = await fetch(API_URL)
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)
      const datos = await respuesta.json()
      setTareas(datos)
      setMs(Math.round(performance.now() - inicio))
    } catch (error) {
      console.error('Error al cargar tareas:', error)
      setError('No se pudo conectar con la API. ¿Está corriendo Django?')
      setMs(Math.round(performance.now() - inicio))
    }
  }, [])

  // Recarga desde un evento del usuario (ej: tras crear una tarea),
  // reiniciando el cronometro para volver a medir.
  function recargar() {
    setMs(null)
    setError(null)
    cargarTareas()
  }

  // Al montar: primera carga. Los estados ya inician vacios, asi que no
  // hace falta reset. (Los setState de cargarTareas ocurren tras el await,
  // no de forma sincrona — el warning del linter aca es un falso positivo.)
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    cargarTareas()
  }, [cargarTareas])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Taller Django + React</h1>
        <p className="app-subtitulo">Lista de tareas con API REST</p>
      </header>

      <Cronometro ms={ms} />

      {error && <p className="app-error">{error}</p>}

      <Formulario alCrear={recargar} />

      {tareas.length === 0 && !error && (
        <p className="app-vacio">Sin tareas todavía. ¡Crea la primera!</p>
      )}
      <ListaTareas tareas={tareas} />

      <footer className="app-footer">
        <p>Plantilla del taller — los retos de sesión 3 la extenderán.</p>
      </footer>
    </div>
  )
}

export default App

function ListaTareas({ tareas }) {
  return (
    <ul className="lista-tareas">
      {tareas.map((tarea) => (
        <li key={tarea.id} className="tarea">
          <span className="tarea-titulo">{tarea.titulo}</span>
          {tarea.descripcion && (
            <p className="tarea-descripcion">{tarea.descripcion}</p>
          )}
          <span className="tarea-estado">
            {tarea.completada ? '✔ completada' : '⏳ pendiente'}
          </span>
          <small className="tarea-fecha">
            creada: {new Date(tarea.creada).toLocaleString()}
          </small>
        </li>
      ))}
    </ul>
  )
}

export default ListaTareas

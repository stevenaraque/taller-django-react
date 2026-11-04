export default function MissionNavigation({
  misiones,
  misionActiva,
  aprobadas,
  puedeAbrirMision,
  onSeleccionarMision,
}) {
  return (
    <nav className="mission-list" aria-label="Misiones de la arena">
      <div className="mission-list-heading">
        <span>Recorrido</span>
        <h2>Misiones</h2>
      </div>

      <ol>
        {misiones.map((mision) => {
          const activa = mision.numero === misionActiva
          const aprobada = aprobadas.includes(mision.numero)
          const desbloqueada = puedeAbrirMision(mision.numero)
          const estado = aprobada ? 'aprobada' : desbloqueada ? 'pendiente' : 'cerrada'

          return (
            <li key={mision.numero}>
              <button
                type="button"
                className="mission-link"
                data-activa={activa}
                data-estado={estado}
                aria-current={activa ? 'step' : undefined}
                onClick={() => onSeleccionarMision(mision.numero)}
              >
                <span className="mission-link-numero">
                  {String(mision.numero).padStart(2, '0')}
                </span>
                <span className="mission-link-titulo">
                  <strong>{mision.titulo}</strong>
                  <small>{mision.alias}</small>
                </span>
                <span className="mission-link-estado">
                  {aprobada ? 'Lista' : desbloqueada ? 'Pendiente' : 'Cerrada'}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

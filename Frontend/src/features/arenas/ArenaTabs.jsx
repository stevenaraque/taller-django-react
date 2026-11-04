export default function ArenaTabs({
  arenas,
  arenaActiva,
  misiones,
  aprobadas,
  puedeAbrirArena,
  onCambiarArena,
}) {
  return (
    <nav className="arena-tabs" aria-label="Días del taller">
      {arenas.map((arena) => {
        const misionesDelDia = misiones.filter(
          (mision) => mision.dia === arena.numero,
        )
        const aprobadasDelDia = misionesDelDia.filter(
          (mision) => aprobadas.includes(mision.numero),
        ).length
        const cerrada = !puedeAbrirArena(arena.numero)

        return (
          <button
            key={arena.numero}
            type="button"
            className="arena-tab"
            data-activa={arena.numero === arenaActiva}
            data-cerrada={cerrada}
            disabled={cerrada}
            aria-current={arena.numero === arenaActiva ? 'page' : undefined}
            onClick={() => onCambiarArena(arena.numero)}
          >
            <span className="arena-tab-dia">{arena.titulo}</span>
            <span className="arena-tab-nombre">{arena.nombre}</span>
            <span className="arena-tab-progreso">
              {cerrada ? 'Bloqueada' : `${aprobadasDelDia}/${misionesDelDia.length} misiones`}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

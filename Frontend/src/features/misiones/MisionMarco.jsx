export default function MisionMarco({
  alias,
  titulo,
  desbloqueada,
  aprobada,
  children,
}) {
  const cerrada = !desbloqueada

  return (
    <article className="mision" data-aprobada={aprobada} data-cerrada={cerrada}>
      <header className="mision-cabecera" data-aprobada={aprobada}>
        <span className="mision-numero">{alias.replace('Mini ', '')}</span>
        <div className="mision-identidad">
          <h3 className="mision-titulo">{titulo}</h3>
          <p className="mision-alias">{alias}</p>
        </div>
        <span className="mision-badge" data-estado={aprobada ? 'aprobada' : 'pendiente'}>
          {aprobada ? 'Aprobada' : 'Pendiente'}
        </span>
      </header>

      {cerrada ? (
        <div className="mision-puerta">
          <p>
            Completa las misiones anteriores para abrir esta. En el Día 2,
            empieza después de aprobar los Minis 1-3. Vuelve a los Minis 4 y 5
            cuando configures CORS en el Mini 9.
          </p>
        </div>
      ) : (
        <div className="mision-cuerpo">
          {children}
        </div>
      )}
    </article>
  )
}

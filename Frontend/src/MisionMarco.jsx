// ============================================================
// MisionMarco.jsx — el marco visual de cada misión (paso).
//
// Cada una de las 15 mini-tareas se renderiza como un bloque
// numerado: alias, título, la teoría que el instructor debe
// explicar ANTES de correr la prueba, y el cuerpo con la
// interfaz de verificación. Si la misión está cerrada, el
// cuerpo se bloquea y aparece la puerta.
//
// El marco NO contiene lógica de negocio: solo mide, verifica
// y pinta el estado (Pendiente / Aprobada).
// ============================================================

export default function MisionMarco({
  alias,
  titulo,
  teoria,
  desbloqueada,
  aprobada,
  manual,
  alAprobar,
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
            Este paso se abre cuando la misión anterior quede aprobada.
            El modo instructor puede desbloquear todo el taller para
            ensayar la clase con la plantilla fresca.
          </p>
        </div>
      ) : (
        <div className="mision-cuerpo">
          {teoria && (
            <p className="mision-teoria">
              <b>⏸ INSTRUCTORES (Steven/Yesid):</b> {teoria}
            </p>
          )}
          {children}
          {manual && !aprobada && (
            <button className="boton boton-mini" onClick={alAprobar}>
              Lo apliqué en clase — declarar la misión aprobada
            </button>
          )}
        </div>
      )}
    </article>
  )
}

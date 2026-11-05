# Solución de referencia: Mini 6 (El Camaleón)

Versión para evaluación del instructor. La plantilla de aprendices exige crear
`EtiquetaSecop` y usarlo dentro de `Camaleon`. El panel verifica la estructura
generada en el DOM.

`Frontend/src/features/misiones/dia2/Camaleon.jsx`:

```jsx
function EtiquetaSecop() {
  return <span>SECOP II</span>
}

export default function Camaleon() {
  return (
    <section>
      <EtiquetaSecop />
      <h1 className="titulo-gigante">Contratos públicos de Colombia</h1>
      <p>Explora quién compra, cuánto paga y en qué estado va cada proceso de compra pública.</p>
    </section>
  )
}
```

Para evaluar: pegar el código en el archivo, abrir el panel, entrar a Día 2,
Mini 6, y pulsar «Verificar el componente». Para devolver la plantilla después:

```bash
git checkout -- Frontend/src/features/misiones/dia2/Camaleon.jsx
```

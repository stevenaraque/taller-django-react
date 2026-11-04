import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const ESTADOS_VACIOS = [
  { estado: 'Activo', contratos: 0 },
  { estado: 'Terminado', contratos: 0 },
  { estado: 'Suspendido', contratos: 0 },
]

export default function GraficaEstados({ datos = ESTADOS_VACIOS }) {
  const sinDatos = datos.every((fila) => fila.contratos === 0)

  return (
    <figure className="grafica-estados" data-estados={JSON.stringify(datos)}>
      <figcaption>
        <h3>Contratos por estado</h3>
        <p>Conteo de contratos en la base de datos</p>
      </figcaption>

      <div className="grafica-estados-area">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={datos}
            layout="vertical"
            margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
          >
            <CartesianGrid
              stroke="var(--borde)"
              strokeDasharray="3 3"
              horizontal={false}
            />
            <XAxis
              type="number"
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--texto-suave)', fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="estado"
              width={92}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--texto)', fontSize: 13 }}
            />
            <Tooltip
              formatter={(valor) => [
                `${Number(valor).toLocaleString('es-CO')} contratos`,
                'Total',
              ]}
              cursor={{ fill: 'var(--azul-claro)' }}
              contentStyle={{
                border: '1px solid var(--borde)',
                borderRadius: 2,
                backgroundColor: 'var(--superficie)',
                color: 'var(--texto)',
              }}
            />
            <Bar
              dataKey="contratos"
              name="Contratos"
              fill="var(--azul)"
              barSize={20}
              radius={[0, 2, 2, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {sinDatos && (
        <p className="grafica-estados-vacia">
          Gráfica vacía: conecta los datos de `por_estado` en el RETO 12.
        </p>
      )}
    </figure>
  )
}

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function MiniLineChart({ data, dataKey = 'value', color = '#3b82f6' }) {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={data}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function MiniBarChart({ data, dataKey = 'value', color = '#8b5cf6' }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
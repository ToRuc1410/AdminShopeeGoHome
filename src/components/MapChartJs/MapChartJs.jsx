import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
export default function MapChartJs({ dataMapMonth }) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const monthsLable = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
  // Tạo mảng số tiền tương ứng cho mỗi tháng

  const resMoneyData = months.map((month) => {
    const monthData = dataMapMonth.find((item) => item.month === month)
    return monthData ? monthData.money : 0
  })
  const data = {
    labels: monthsLable,
    datasets: [
      {
        label: 'VND',
        data: resMoneyData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.1,
        borderWidth: 1
      }
    ]
  }
  const options = {
    indexAxis: 'x',
    scales: {
      y: {
        beginAtZero: true
      }
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Thông tin doanh thu bán hàng và đơn bán mỗi tháng'
      }
    }
  }
  return <Line data={data} options={options} height={85} />
}

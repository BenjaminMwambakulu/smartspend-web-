// BarGraph.js

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function BarGraph({
  monthlyExpenses = {},
  monthlyRevenue = {},
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const formatMonthLabel = (key) => {
    const [year, month] = key.split("-");
    const date = new Date(year, month - 1, 1);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  };

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();

    const allMonths = new Set([
      ...Object.keys(monthlyExpenses),
      ...Object.keys(monthlyRevenue),
    ]);
    const sortedMonthKeys = Array.from(allMonths).sort();
    const labels = sortedMonthKeys.map(formatMonthLabel);
    const expensesData = sortedMonthKeys.map(
      (key) => monthlyExpenses[key] || 0
    );
    const revenueData = sortedMonthKeys.map((key) => monthlyRevenue[key] || 0);

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Expenses",
            data: expensesData,
            backgroundColor: "#fb2c36",
            borderWidth: 1,
            borderRadius: 5,
          },
          {
            label: "Revenue",
            data: revenueData,
            backgroundColor: "#007fff",
            borderWidth: 1,
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Amount (MK)",
            },
            grid: {
              display: false,
            },
          },
          x: {
            title: {
              display: true,
              text: "Month",
            },
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
          title: {
            display: true,
            text: "Monthly Expenses vs Revenue",
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [monthlyExpenses, monthlyRevenue]);

  return <canvas className="mt-12" ref={canvasRef} />;
}

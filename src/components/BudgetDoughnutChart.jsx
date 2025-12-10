import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

/**
 * Doughnut chart component for visualizing a single budget
 * @param {Object} budget - The budget data to visualize
 */
const BudgetDoughnutChart = ({ budget }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext("2d");

    // Calculate spent and remaining values
    // Using the spentAmount column from the budget
    const spent = budget.spentAmount || 0;
    const remaining = budget.amount - spent;
    const spentPercentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    const remainingPercentage = 100 - spentPercentage;

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Spent", "Remaining"],
        datasets: [
          {
            data: [spentPercentage, remainingPercentage],
            backgroundColor: ["#fb2c36", "#22c55e"],
            borderWidth: 0,
            borderRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "70%",
        plugins: {
          legend: { 
            display: true,
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                // Calculate actual values for tooltip
                const total = budget.amount;
                const value = context.dataIndex === 0 ? spent : remaining;
                return `${context.label}: MK ${parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
              }
            }
          }
        },
      }
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [budget]);

  return (
    <div className="w-full max-w-[250px] mx-auto">
      <canvas ref={canvasRef}></canvas>
      <div className="text-center mt-2">
        <p className="text-lg font-bold text-gray-800">MK {parseFloat(budget.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        <p className="text-sm text-gray-600">
          {budget.category && budget.category.length > 0 
            ? budget.category.map(cat => cat.categoryName).join(", ") 
            : "No category"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(budget.startDate).toLocaleDateString()} - 
          {budget.endDate ? ` ${new Date(budget.endDate).toLocaleDateString()}` : ' Ongoing'}
        </p>
      </div>
    </div>
  );
};

export default BudgetDoughnutChart;
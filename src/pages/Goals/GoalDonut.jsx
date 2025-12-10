import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

/**
 * GoalDonut Component
 * Displays a single goal as a doughnut chart
 * @param {Object} goal - The goal data to visualize
 */
const GoalDonut = ({ goal }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext("2d");

    // Calculate contributed and remaining values
    const contributed = goal.amountContributed || 0;
    const target = goal.targetAmount || 1;
    const remaining = Math.max(target - contributed, 0);
    
    // Calculate percentages
    const contributedPercentage = (contributed / target) * 100;
    const remainingPercentage = 100 - contributedPercentage;

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Contributed", "Remaining"],
        datasets: [
          {
            data: [contributedPercentage, remainingPercentage],
            backgroundColor: ["#3b82f6", "#e5e7eb"],
            borderWidth: 0,
            borderRadius: 8,
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
                const value = context.dataIndex === 0 ? contributed : remaining;
                return `${context.label}: $${parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
              }
            }
          }
        },
      }
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [goal]);

  return (
    <div className="w-full max-w-[250px] mx-auto">
      <canvas ref={canvasRef}></canvas>
      <div className="text-center mt-2">
        <p className="text-lg font-bold text-gray-800">${parseFloat(goal.targetAmount || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        <p className="text-sm text-gray-600">{goal.goalName}</p>
        <p className="text-xs text-gray-500 mt-1">
          Contributed: ${parseFloat(goal.amountContributed || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};

export default GoalDonut;
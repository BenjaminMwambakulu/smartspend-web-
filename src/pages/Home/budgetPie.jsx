import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function BudgetPie({ expenses = 0, budget = 0 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const remaining = Math.max(budget - expenses, 0);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext("2d");

    // Custom center text plugin (clean + stable)
    const centerTextPlugin = {
      id: "centerText",
      afterDraw(chart) {
        const {
          ctx,
          chartArea: { width, height },
        } = chart;

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Main amount
        ctx.font = "bold 26px sans-serif";
        ctx.fillStyle = "#000";
        ctx.fillText(
          `MK ${expenses.toLocaleString()}`,
          width / 2,
          height / 2 - 10
        );

        // Sub-label
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "#ff9066";
        ctx.fillText("Spent", width / 2, height / 2 + 18);

        ctx.restore();
      },
    };

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Used", "Remaining"],
        datasets: [
          {
            data: [expenses, remaining],
            backgroundColor: ["#ff9066", "#ececec"],
            borderWidth: 0,
            borderRadius: 40, // smooth like the screenshot
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "75%",
        plugins: {
          legend: { display: false },
        },
      },
      plugins: [centerTextPlugin],
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [expenses, budget]);

  return (
    <div className="w-full flex flex-col items-center">
      <canvas ref={canvasRef} className="w-52 h-52 mb-4"></canvas>

      <div className="flex w-full justify-between px-6 mt-2">
        <div className="text-center">
          <p className="font-bold">MK {budget.toLocaleString()}</p>
          <p className="text-gray-500 text-sm">Monthly Limit</p>
        </div>
        <div className="text-center">
          <p className="font-bold">MK {remaining.toLocaleString()}</p>
          <p className="text-gray-500 text-sm">Remaining</p>
        </div>
      </div>
    </div>
  );
}

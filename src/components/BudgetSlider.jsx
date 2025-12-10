import React from "react";
import BudgetDoughnutChart from "./BudgetDoughnutChart";

/**
 * Horizontal slider for displaying multiple budget charts
 * @param {Array} budgets - Array of budget objects to display
 */
const BudgetSlider = ({ budgets = [] }) => {
  if (!budgets || budgets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No budgets available. Add a budget to get started.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex space-x-6 min-w-max py-2">
        {budgets.map((budget) => (
          <div 
            key={budget.$id} 
            className="flex-shrink-0 w-64 bg-white rounded-lg shadow p-4"
          >
            <BudgetDoughnutChart budget={budget} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetSlider;
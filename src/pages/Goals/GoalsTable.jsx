import React from "react";
import Table from "../../components/Table";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

/**
 * GoalsTable Component
 * Displays goals in a table format with actions
 * @param {Array} goalsData - Array of goal objects to display
 * @param {Function} onEdit - Function to handle edit action
 * @param {Function} onDelete - Function to handle delete action
 */
const GoalsTable = ({ goalsData, onEdit, onDelete, onQuickUpdate }) => {
  // Transform data for the table component
  const transformedData = goalsData.map((goal) => ({
    "Goal Name": goal.goalName,
    "Target Amount": `$${parseFloat(goal.targetAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    "Deadline": goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "No deadline",
    "Priority": goal.priority ? goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1) : "None",
    "Amount Contributed": `$${parseFloat(goal.amountContributed || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    "Created At": new Date(goal.$createdAt).toLocaleDateString(),
    "Actions": (
      <div className="flex space-x-2">
        <button
          onClick={() => onQuickUpdate(goal)}
          className="p-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
          title="Quick Update Contribution"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={() => onEdit(goal)}
          className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          title="Edit Goal"
        >
          <AiFillEdit />
        </button>
        <button
          onClick={() => onDelete(goal.$id)}
          className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
          title="Delete Goal"
        >
          <AiFillDelete />
        </button>
      </div>
    ),
  }));

  const columns = [
    "Goal Name",
    "Target Amount",
    "Deadline",
    "Priority",
    "Amount Contributed",
    "Created At",
    "Actions",
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <Table headers={columns} data={transformedData} />
    </div>
  );
};

export default GoalsTable;
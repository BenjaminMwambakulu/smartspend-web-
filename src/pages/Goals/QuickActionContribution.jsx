import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * QuickActionContribution Component
 * Inline popup for quickly updating goal contribution amount
 * @param {Object} goal - The goal being updated
 * @param {Function} onClose - Function to close the popup
 * @param {Function} onSubmit - Function to handle form submission
 */
const QuickActionContribution = ({ goal, onClose, onSubmit }) => {
  const [additionalAmount, setAdditionalAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (additionalAmount && !isNaN(additionalAmount)) {
      onSubmit({ additionalAmount: parseFloat(additionalAmount) });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Update Contribution for "{goal.goalName}"
          </h3>
          
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current Contribution:</span>
              <span className="font-medium">
                ${parseFloat(goal.amountContributed || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Target Amount:</span>
              <span className="font-medium">
                ${parseFloat(goal.targetAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="additionalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Amount
              </label>
              <input
                type="number"
                id="additionalAmount"
                value={additionalAmount}
                onChange={(e) => setAdditionalAmount(e.target.value)}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!additionalAmount || isNaN(additionalAmount) || parseFloat(additionalAmount) <= 0}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickActionContribution;
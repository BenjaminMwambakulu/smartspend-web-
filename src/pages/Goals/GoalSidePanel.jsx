import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addGoal, updateGoal } from "../../services/goalsService";
import { formatMoney } from "../../utils/formatMoney";
import { IoClose } from "react-icons/io5";

/**
 * GoalSidePanel Component
 * Slide-in panel for adding/editing goals
 * @param {Boolean} isOpen - Controls panel visibility
 * @param {Function} onClose - Function to close the panel
 * @param {Function} onSubmit - Function to handle form submission
 * @param {Object} goalData - Existing goal data for editing (null for new goal)
 */
const GoalSidePanel = ({ isOpen, onClose, onSubmit, goalData }) => {
  const [formData, setFormData] = useState({
    goalName: "",
    targetAmount: "",
    deadline: "",
    priority: "",
    description: "",
    amountContributed: ""
  });

  // Populate form when editing existing goal
  useEffect(() => {
    if (goalData) {
      setFormData({
        goalName: goalData.goalName || "",
        targetAmount: goalData.targetAmount || "",
        deadline: goalData.deadline ? goalData.deadline.split('T')[0] : "",
        priority: goalData.priority || "",
        description: goalData.description || "",
        amountContributed: goalData.amountContributed || ""
      });
    } else {
      // Reset form for new goal
      setFormData({
        goalName: "",
        targetAmount: "",
        deadline: "",
        priority: "",
        description: "",
        amountContributed: ""
      });
    }
  }, [goalData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data for submission
    const submitData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      amountContributed: formData.amountContributed ? parseFloat(formData.amountContributed) : 0
    };

    // Remove empty fields
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === "" && key !== "deadline") {
        delete submitData[key];
      }
    });

    onSubmit(submitData, goalData?.$id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {goalData ? "Edit Goal" : "Add New Goal"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <IoClose className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Name *
                  </label>
                  <input
                    type="text"
                    id="goalName"
                    name="goalName"
                    value={formData.goalName}
                    onChange={handleChange}
                    required
                    maxLength={255}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Amount *
                  </label>
                  <input
                    type="number"
                    id="targetAmount"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {goalData && (
                  <div>
                    <label htmlFor="amountContributed" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount Contributed
                    </label>
                    <input
                      type="number"
                      id="amountContributed"
                      name="amountContributed"
                      value={formData.amountContributed}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {goalData ? "Update Goal" : "Add Goal"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GoalSidePanel;
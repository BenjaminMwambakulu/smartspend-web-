import { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import UserContext from "../../context/userContext";
import { addBudget, updateBudget } from "../../services/budgetService";
import { getExpenseCategories, addExpenseCategory } from "../../services/categoryService";

/**
 * Side panel component for adding/editing budgets
 * @param {Array} categories - Available categories
 * @param {Function} onClose - Function to close the panel
 * @param {Object} budgetItem - Budget item to edit (null for new budget)
 */
function BudgetSidePanel({ categories, onClose, budgetItem, refreshCategories }) {
  const [showNewInput, setShowNewInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const { user } = useContext(UserContext);
  
  // Initialize form data, either empty or with existing budget data for editing
  const [formData, setFormData] = useState(() => {
    if (budgetItem) {
      // Editing mode - populate with existing data
      return {
        name: budgetItem.name || "",
        amount: budgetItem.amount || "",
        notes: budgetItem.notes || "",
        category: budgetItem.category && budgetItem.category[0] 
          ? budgetItem.category[0].$id || budgetItem.category[0].id || ""
          : "",
        startDate: budgetItem.startDate 
          ? new Date(budgetItem.startDate).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        endDate: budgetItem.endDate 
          ? new Date(budgetItem.endDate).toISOString().slice(0, 16)
          : "",
        userId: user.$id,
      };
    } else {
      // Creation mode - initialize with default values
      return {
        name: "",
        amount: "",
        notes: "",
        category: "",
        startDate: new Date().toISOString().slice(0, 16),
        endDate: "",
        userId: user.$id,
      };
    }
  });

  const panelRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Close panel on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Handles select change
  const handleSelect = (e) => {
    if (e.target.value === "new") {
      setShowNewInput(true);
      setFormData((prev) => ({ ...prev, category: "" }));
    } else {
      setShowNewInput(false);
      // Find the selected category to get its ID
      const selectedCategory = categories.find(
        cat => cat.categoryName === e.target.value || cat.id === e.target.value || cat.$id === e.target.value
      );
      // Store the category ID instead of the value
      setFormData((prev) => ({ 
        ...prev, 
        category: selectedCategory ? (selectedCategory.$id || selectedCategory.id) : e.target.value 
      }));
    }
  };

  // Handles saving new category
  const handleSaveCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await addExpenseCategory(user.$id, newCategory);
      if (res && typeof refreshCategories === 'function') {
        // Refresh categories after successfully adding a new one
        refreshCategories();
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
    setNewCategory("");
    setShowNewInput(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      alert("Budget name is required");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Amount is required and must be greater than 0");
      return;
    }

    if (!formData.startDate) {
      alert("Start date is required");
      return;
    }

    // Ensure amount is a number
    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0 || amountValue > 100000000) {
      alert("Amount must be a valid number between 0 and 100,000,000");
      return;
    }

    // Create the data object to submit
    const submissionData = {
      ...formData,
      name: formData.name.trim(),
      amount: amountValue,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      notes: formData.notes || null,
      category: formData.category ? [formData.category] : [], // Pass category as array
      userId: user.$id,
    };

    let result;
    if (budgetItem) {
      // Update existing budget
      result = await updateBudget(budgetItem.$id, submissionData);
    } else {
      // Create new budget
      result = await addBudget(submissionData);
    }

    if (result) {
      // Reset form and close panel
      setFormData({
        name: "",
        amount: "",
        notes: "",
        category: "",
        startDate: new Date().toISOString().slice(0, 16),
        endDate: "",
        userId: user.$id,
      });
      onClose();
    } else {
      alert("Error saving budget. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex justify-end">
      <motion.div
        ref={panelRef}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="min-h-screen w-full md:w-[30%] lg:w-[25%] bg-white shadow-lg p-6 overflow-y-auto"
      >
        {/* Header - Changed to show Edit/New based on mode */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">
            {budgetItem ? "Edit Budget" : "Add New Budget"}
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close panel"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              Budget Name *
            </label>
            <input
              type="text"
              name="name"
              required
              maxLength={255}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter budget name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.name.length}/255 characters</p>
          </div>

          {/* Amount Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-2 text-sm top-2 text-gray-500">
                MK
              </span>
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0"
                max="100000000"
                required
                className="w-full border border-gray-300 rounded-lg p-2 pl-8 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleInputChange}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Min: 0, Max: 100,000,000</p>
          </div>

          {/* Start Date Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              Start Date *
            </label>
            <input
              type="datetime-local"
              name="startDate"
              required
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </div>

          {/* End Date Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              End Date
            </label>
            <input
              type="datetime-local"
              name="endDate"
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.endDate}
              onChange={handleInputChange}
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank for ongoing budget</p>
          </div>

          {/* Category Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              Category
            </label>
            <select
              name="category"
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleSelect}
              value={formData.category}
            >
              <option value="">Select a category (optional)</option>
              {Array.isArray(categories) && categories.length > 0 ? (
                <>
                  {categories.map((category) => (
                    <option
                      key={category.$id || category.id}
                      value={category.$id || category.id}
                    >
                      {category.categoryName || category.name}
                    </option>
                  ))}
                  <option value="new" className="text-blue-600 font-medium">
                    + Add New Category
                  </option>
                </>
              ) : (
                <>
                  <option disabled>No categories available</option>
                  <option value="new" className="text-blue-600 font-medium">
                    + Add New Category
                  </option>
                </>
              )}
            </select>

            {/* New Category Input */}
            {showNewInput && (
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  maxLength={255}
                />
                <button
                  type="button"
                  onClick={handleSaveCategory}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded whitespace-nowrap"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Notes Field */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">
              Notes
            </label>
            <textarea
              name="notes"
              rows={4}
              maxLength={102}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Add notes (max 102 characters)"
              value={formData.notes}
              onChange={handleInputChange}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {formData.notes.length}/102 characters
            </p>
          </div>

          {/* User ID (Hidden but included in form) */}
          <input type="hidden" name="userId" value={formData.userId} />

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
            >
              {budgetItem ? "Update Budget" : "Save Budget"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default BudgetSidePanel;
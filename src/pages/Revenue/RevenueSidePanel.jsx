import { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  addIncomeCategory,
  getIncomeCategories,
} from "../../services/categoryService";
import UserContext from "../../context/userContext";
import { addRevenue } from "../../services/revenueService";
function SidePanel({ categories, onClose }) {
  const [showNewInput, setShowNewInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    amount: "",
    receiptDate:
      new Date().toISOString().split("T")[0] +
      "T" +
      new Date().toTimeString().split(" ")[0].slice(0, 5),
    notes: "",
    category: "",
    userId: "",
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
  }, [onClose, newCategory]);

  // Handles select change
  const handleSelect = (e) => {
    if (e.target.value === "new") {
      setShowNewInput(true);
      setFormData((prev) => ({ ...prev, category: "" }));
    } else {
      setShowNewInput(false);
      // Find the selected category to get its ID
      const selectedCategory = categories.find(
        cat => cat.category === e.target.value || cat.id === e.target.value || cat.$id === e.target.value
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
      const res = await addIncomeCategory(user.$id, newCategory);
    } catch (error) {}
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
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Amount is required and must be greater than 0");
      return;
    }

    if (!formData.receiptDate) {
      alert("Receipt date is required");
      return;
    }

    // Create the data object to submit
    const submissionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      receiptDate: new Date(formData.receiptDate).toISOString(),
      notes: formData.notes || null,
      category: formData.category || null,
      userId: user.$id,
    };

    const data = await addRevenue(submissionData);

    console.log("Submitting data:", submissionData);

    // Reset form and close panel
    setFormData({
      amount: "",
      receiptDate:
        new Date().toISOString().split("T")[0] +
        "T" +
        new Date().toTimeString().split(" ")[0].slice(0, 5),
      notes: "",
      category: "",
      userId: user.$id,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex justify-end">
      <motion.div
        ref={panelRef}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="min-h-screen w-full md:w-[30%] lg:w-[20%] bg-white shadow-lg p-6 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">Add New Revenue</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close panel"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-2 text-sm  top-2 text-gray-500">
                MK
              </span>
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0"
                required
                className="w-full border border-gray-300 rounded-lg p-2 pl-8 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleInputChange}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum: $0</p>
          </div>

          {/* Receipt Date Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              Receipt Date *
            </label>
            <input
              type="datetime-local"
              name="receiptDate"
              required
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.receiptDate}
              onChange={handleInputChange}
            />
          </div>

          {/* Category Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              Source / Category
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
              maxLength={255}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Add notes (max 255 characters)"
              value={formData.notes}
              onChange={handleInputChange}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {formData.notes.length}/255 characters
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
              className="flex-1 bg-blue-500 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition"
            >
              Save Revenue
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default SidePanel;

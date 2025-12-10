import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import UserContext from "../../context/userContext";
import PrimaryButton from "../../components/PrimaryButton";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import Table from "../../components/Table";
import BudgetSlider from "../../components/BudgetSlider";
import BudgetSidePanel from "./BudgetSidePanel";
import { fetchBudgets, deleteBudget, updateBudget } from "../../services/budgetService";
import { getExpenseCategories } from "../../services/categoryService";

/**
 * Main Budgets Page Component
 * Displays budgets in both chart and table formats with CRUD functionality
 */
function BudgetsPage() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  /**
   * Fetch all categories for the budget form
   */
  const fetchCategories = async () => {
    try {
      const data = await getExpenseCategories(user.$id);
      if (data && data.rows) {
        setCategories(data.rows);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    }
  };

  /**
   * Fetch all budgets for the logged-in user
   */
  const loadBudgets = async () => {
    if (!user?.$id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchBudgets(user.$id);

      if (data && data.rows) {
        setBudgets(data.rows);
      } else {
        setBudgets([]);
      }
    } catch (error) {
      console.error("Error loading budgets:", error);
      setError("Failed to load budgets");
      setBudgets([]);
      toast.error("Error loading budgets");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle edit action - opens side panel with budget data
   * @param {Object} budgetData - The budget to edit
   */
  const handleEdit = (budgetData) => {
    setEditingBudget(budgetData);
    setIsSidePanelOpen(true);
  };

  /**
   * Handle delete action - confirms and deletes a budget
   * @param {string} budgetId - The ID of the budget to delete
   */
  const handleDelete = async (budgetId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this budget?");
    if (confirmDelete) {
      try {
        const result = await deleteBudget(budgetId);
        if (result) {
          toast.success("Budget deleted successfully");
          reloadData(); // Refresh the data
        } else {
          toast.error("Failed to delete budget");
        }
      } catch (error) {
        console.error("Error deleting budget:", error);
        toast.error("Error deleting budget");
      }
    }
  };

  /**
   * Handle quick add expense action - opens a prompt to quickly add an expense to a budget
   * @param {Object} budget - The budget to add an expense to
   */
  const handleQuickAddExpense = async (budget) => {
    const amount = prompt(`Enter expense amount for budget "${budget.name}":`);
    
    if (amount === null) {
      // User cancelled the prompt
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid positive number");
      return;
    }
    
    try {
      // Calculate new spent amount
      const currentSpent = budget.spentAmount || 0;
      const newSpent = currentSpent + parsedAmount;
      
      // Update the budget with new spent amount
      const result = await updateBudget(budget.$id, {
        ...budget,
        spentAmount: newSpent
      });
      
      if (result) {
        toast.success(`Added MK ${parsedAmount.toFixed(2)} to budget "${budget.name}"`);
        reloadData(); // Refresh the data
      } else {
        toast.error("Failed to update budget");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Error updating budget");
    }
  };

  /**
   * Reload all data
   */
  const reloadData = () => {
    loadBudgets();
    fetchCategories();
  };

  // Initial data loading
  useEffect(() => {
    if (user?.$id) {
      fetchCategories();
      loadBudgets();
    }
  }, [user?.$id]);

  // Prepare data for table display
  const budgetTableData = budgets.map((budget) => ({
    "Name": budget.name,
    "Amount": `MK ${parseFloat(budget.amount).toLocaleString()}`,
    "Spent": `MK ${parseFloat(budget.spentAmount || 0).toLocaleString()}`,
    "Category": budget.category && budget.category.length > 0 
      ? budget.category.map(cat => cat.categoryName).join(", ") 
      : "No category",
    "Start Date": new Date(budget.startDate).toLocaleDateString(),
    "End Date": budget.endDate ? new Date(budget.endDate).toLocaleDateString() : "Ongoing",
    "Notes": budget.notes || "",
    "Actions": (
      <div className="flex space-x-2">
        <button 
          onClick={() => handleQuickAddExpense(budget)}
          className="p-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
          title="Quick Add Expense"
        >
          <FaPlus />
        </button>
        <button 
          onClick={() => handleEdit(budget)}
          className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
        >
          <AiFillEdit />
        </button>
        <button 
          onClick={() => handleDelete(budget.$id)}
          className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
        >
          <AiFillDelete />
        </button>
      </div>
    ),
  }));

  return (
    <div className="my-8">
      <div className="flex justify-between items-center">
        <h1 className="flex flex-col">
          <span className="text-2xl text-gray-800">Budgets</span>
          <span className="text-sm text-gray-600">Manage your budgets</span>
        </h1>
        <PrimaryButton
          text={"New Budget"}
          onClick={() => {
            setEditingBudget(null);
            setIsSidePanelOpen(true);
          }}
        />
        
        {/* Side Panel for Adding/Editing Budgets */}
        <AnimatePresence>
          {isSidePanelOpen && (
            <BudgetSidePanel
              categories={categories}
              budgetItem={editingBudget}
              onClose={() => {
                setIsSidePanelOpen(false);
                setEditingBudget(null);
                reloadData();
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Charts Section */}
      <div className="my-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Budget Overview</h2>
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Budget Charts Slider */}
        {!loading && <BudgetSlider budgets={budgets} />}
      </div>

      {/* Table Section */}
      <div className="my-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Budget Details</h2>
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Budgets Table */}
        {!loading && (
          budgetTableData.length > 0 ? (
            <Table 
              headers={["Name", "Amount", "Spent", "Category", "Start Date", "End Date", "Notes", "Actions"]} 
              data={budgetTableData} 
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No budgets found. Add a budget to get started.
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default BudgetsPage;
import React, { useContext, useEffect, useRef, useState } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import { motion, AnimatePresence } from "framer-motion";
import { addBudget, fetchPaginatedBudgetData, deleteBudget, updateBudget, fetchBudgets } from "../../services/budgetService";
import { getExpenseCategories } from "../../services/categoryService";
import UserContext from "../../context/userContext";
import BudgetSidePanel from "./BudgetSidePanel";
import BudgetDoughnutChart from "../../components/BudgetDoughnutChart";
import StatBuilder from "../../components/StatBuilder";
import { AiFillDollarCircle, AiFillEdit, AiFillDelete } from "react-icons/ai";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import { toast } from "sonner";
import { formatMoney } from "../../utils/formatMoney";

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

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this budget?"
    );
    if (confirmDelete) {
      try {
        const result = await deleteBudget(budgetId);
        if (result) {
          toast.success("Budget deleted successfully");
          loadBudgets(); // Refresh the data
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
   * Reload data when needed
   */
  const reloadData = () => {
    loadBudgets();
    fetchCategories();
  };

  // Load budgets and categories on component mount
  useEffect(() => {
    loadBudgets();
    fetchCategories();
  }, [user]);

  // Auto-slide carousel
  useEffect(() => {
    if (budgets.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % budgets.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [budgets.length]);

  // Scroll to current slide
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: currentSlide * 280, // Width of each slide (256px + margins)
        behavior: "smooth",
      });
    }
  }, [currentSlide]);

  // Format budgets for table display
  const formatBudgetsForTable = (budgetsData) => {
    if (!budgetsData || budgetsData.length === 0) return [];

    return budgetsData.map((budget) => ({
      Name: budget.name,
      Amount: `MK ${formatMoney(budget.amount || 0)}`,
      Notes: budget.notes || "N/A",
      "Start Date": budget.startDate
        ? new Date(budget.startDate).toLocaleDateString()
        : "N/A",
      "End Date": budget.endDate
        ? new Date(budget.endDate).toLocaleDateString()
        : "N/A",
      Category:
        budget.category && budget.category.length > 0
          ? budget.category.map((cat) => cat.categoryName).join(", ")
          : "N/A",
      "Spent Amount": `MK ${formatMoney(budget.spentAmount || 0)}`,
      Actions: (
        <div className="flex space-x-2">
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
  };

  const formattedBudgets = formatBudgetsForTable(budgets);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
            <p className="text-gray-600 mt-2">
              Manage your spending limits and track expenses
            </p>
          </div>
          <PrimaryButton
            text={"+ New Budget"}
            onClick={() => setIsSidePanelOpen(true)}
          />
        </div>

        {/* Budget Chart Carousel */}
        {budgets && budgets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Budget Overview
            </h2>
            <div
              ref={sliderRef}
              className="w-full overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="flex space-x-6 min-w-max">
                {budgets.map((budget, index) => (
                  <div
                    key={budget.$id}
                    className="shrink-0 w-64 bg-white rounded-lg shadow p-4"
                  >
                    <BudgetDoughnutChart budget={budget} />
                  </div>
                ))}
              </div>
            </div>

            {budgets.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {budgets.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentSlide ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-gray-500 text-sm font-medium">
              Total Budgets
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              {budgets ? budgets.length : 0}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-gray-500 text-sm font-medium">
              Within Budget
            </div>
            <div className="text-2xl font-bold text-green-600 mt-2">
              {budgets
                ? budgets.filter((b) => {
                    const spent = b.spentAmount || 0;
                    const target = b.targetAmount || 1;
                    return spent <= target;
                  }).length
                : 0}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-gray-500 text-sm font-medium">Over Budget</div>
            <div className="text-2xl font-bold text-red-600 mt-2">
              {budgets
                ? budgets.filter((b) => {
                    const spent = b.spentAmount || 0;
                    const target = b.targetAmount || 1;
                    return spent > target;
                  }).length
                : 0}
            </div>
          </div>
        </div>

        {/* Budgets Table */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Budget Details
            </h2>
          </div>
          <Table
            headers={[
              "Name",
              "Amount",
              "Notes",
              "Start Date",
              "End Date",
              "Category",
              "Spent Amount",
              "Actions",
            ]}
            data={formattedBudgets}
          />
        </div>

        {/* Side Panel */}
        <AnimatePresence>
          {isSidePanelOpen && (
            <BudgetSidePanel
              categories={categories}
              budgetItem={editingBudget}
              refreshCategories={fetchCategories}
              onClose={() => {
                setIsSidePanelOpen(false);
                setEditingBudget(null);
                reloadData();
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default BudgetsPage;

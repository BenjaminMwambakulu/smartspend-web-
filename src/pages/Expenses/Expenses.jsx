import React, { useContext, useEffect, useState } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import { motion, AnimatePresence } from "framer-motion";
import { getExpenseCategories } from "../../services/categoryService";
import { addExpense, fetchPaginatedExpenseData, deleteExpense } from "../../services/expenseService";
import UserContext from "../../context/userContext";
import ExpenseSidePanel from "./ExpenseSidePanel";
import StatBuilder from "../../components/StatBuilder";
import { AiFillDollarCircle, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdCategory } from "react-icons/md";
import { fetchDashboardData } from "../../services/dashboardService";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import { toast } from "sonner";
import { formatMoney } from "../../utils/formatMoney";

function Expenses() {
  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false);
  const [categories, setCategories] = React.useState(null);
  const [totalExpenses, setTotalExpenses] = React.useState(0);
  const { user } = useContext(UserContext);
  const [expenseData, setExpenseData] = useState([]);
  
  // State for editing
  const [editingExpense, setEditingExpense] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const data = await getExpenseCategories(user.$id);
      if (data && data.rows) {
        setCategories(data.rows);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Load paginated expense data
   * Uses Appwrite's pagination with limit and offset
   */
  const loadExpenseData = async (page = 1) => {
    if (!user?.$id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Calculate offset based on current page and page size
      const offset = (page - 1) * pageSize;
      
      // Fetch paginated data from Appwrite
      const data = await fetchPaginatedExpenseData(user.$id, pageSize, offset);
      
      // Update pagination metadata
      setTotalDocuments(data.total);
      setTotalPages(Math.ceil(data.total / pageSize));
      
      if (data && data.rows) {
        // Transform data for display in table
        const transformedData = data.rows.map((row) => ({
          // Map API fields to your table headers
          "Category":
            row.category && row.category.length > 0 ? row.category[0].categoryName : "N/A",
          Amount: `MK ${formatMoney(row.amount)}`,
          Date: new Date(row.transactionDate).toLocaleDateString(),
          Notes: row.notes || "",
          Actions: (
            <div className="flex space-x-2">
              <button 
                onClick={() => handleEdit(row)} // Pass the whole row data
                className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              >
                <AiFillEdit />
              </button>
              <button 
                onClick={() => handleDelete(row.$id)}
                className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                <AiFillDelete />
              </button>
            </div>
          ),
        }));

        setExpenseData(transformedData);
      } else {
        setExpenseData([]);
      }
    } catch (error) {
      console.log("Error loading expense data:", error);
      setError("Failed to load expense data");
      setExpenseData([]);
      toast.error("Error loading expense data");
    } finally {
      setLoading(false);
    }
  };

  // Updated handleEdit to store the expense data for editing
  const handleEdit = (expenseData) => {
    setEditingExpense(expenseData);
    setIsSidePanelOpen(true);
  };

  const handleDelete = async (expenseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense entry?");
    if (confirmDelete) {
      try {
        const result = await deleteExpense(expenseId);
        if (result) {
          toast.success("Expense entry deleted successfully");
          reloadData(); // Refresh the data
        } else {
          toast.error("Failed to delete expense entry");
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
        toast.error("Error deleting expense entry");
      }
    }
  };

  const fetchTotalExpenses = async () => {
    try {
      const data = await fetchDashboardData(user.$id);
      setTotalExpenses(data.expenses);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Handle page change
   * @param {number} page - The page number to navigate to
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadExpenseData(page);
  };

  /**
   * Reload all data including pagination
   */
  const reloadData = () => {
    loadExpenseData(currentPage);
    fetchTotalExpenses();
    fetchCategories();
  };

  useEffect(() => {
    if (user?.$id) {
      fetchCategories();
      fetchTotalExpenses();
      loadExpenseData(currentPage);
    }
  }, [user?.$id, pageSize]); // Dependency on user.$id and pageSize

  return (
    <div className="my-8">
      <div className="flex justify-between items-center">
        <h1 className="flex flex-col">
          <span className="text-2xl text-gray-800">Expenses</span>
          <span className="text-sm text-gray-600">Manage your Expenses</span>
        </h1>
        <PrimaryButton
          text={"New Expense"}
          onClick={() => {
            setEditingExpense(null); // Reset editing state
            setIsSidePanelOpen(!isSidePanelOpen);
            console.log("Side panel opened");
          }}
        />
        {/* Modal Display */}
        <AnimatePresence>
          {isSidePanelOpen && (
            <ExpenseSidePanel
              categories={categories}
              expenseItem={editingExpense} // Pass expense data for editing
              onClose={() => {
                setIsSidePanelOpen(false);
                setEditingExpense(null); // Reset editing state
                reloadData(); // Reload data when panel closes
              }}
            />
          )}
        </AnimatePresence>
      </div>
      {/* Stats Display */}
      <div className="my-8 flex gap-8 justify-center items-center">
        {/* Stats components would go here */}
        <StatBuilder
          title={"Total Expenses"}
          value={totalExpenses ? `MK ${formatMoney(totalExpenses)}` : "MK 0.00"}
          icon={<AiFillDollarCircle />}
          color={"text-red-500"}
        />
        <StatBuilder
          title={"Total Expense Categories"}
          value={categories && categories.length ? categories.length : 0}
          icon={<MdCategory />}
          className={"ml-10"}
          color={"text-blue-500"}
        />
      </div>
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Table section */}
      {!loading && <Table data={expenseData} />}
      
      {/* Pagination controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />
      
      {/* Pagination info */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalDocuments)} of {totalDocuments} entries
      </div>
    </div>
  );
}

export default Expenses;
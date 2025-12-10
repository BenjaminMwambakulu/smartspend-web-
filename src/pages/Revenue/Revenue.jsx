import React, { useContext, useEffect, useRef, useState } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import { motion, AnimatePresence } from "framer-motion";
import { getIncomeCategories } from "../../services/categoryService";
import { addRevenue, fetchRevenueData, deleteRevenue } from "../../services/revenueService";
import UserContext from "../../context/userContext";
import SidePanel from "./RevenueSidePanel";
import StatBuilder from "../../components/StatBuilder";
import { AiFillDollarCircle, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdCategory } from "react-icons/md";
import { fetchDashboardData } from "../../services/dashboardService";
import Table from "../../components/Table";
import { toast } from "sonner";

function Revenue() {
  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false);
  const [categories, setCategories] = React.useState(null);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const { user } = useContext(UserContext);
  const [revenueData, setRevenueData] = useState([]);

  const fetchCategories = async () => {
    try {
      const data = await getIncomeCategories(user.$id);
      if (data && data.rows) {
        setCategories(data.rows);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadRevenueData = async () => {
    try {
      const data = await fetchRevenueData(user.$id);
      console.log("Raw revenue data:", data); // Log the raw data

      if (data && data.rows) {
        const transformedData = data.rows.map((row) => ({
          // Map API fields to your table headers
          "Source/Category":
            row.category && row.category.length > 0 ? row.category[0].categoryName : "N/A",
          Amount: `MK ${parseFloat(row.amount).toFixed(2)}`,
          Date: new Date(row.receiptDate).toLocaleDateString(),
          Notes: row.notes || "",
          Actions: (
            <div className="flex space-x-2">
              <button 
                onClick={() => handleEdit(row)}
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

        setRevenueData(transformedData);
      } else {
        setRevenueData([]);
      }
    } catch (error) {
      console.log("Error loading revenue data:", error);
      setRevenueData([]);
    }
  };

  const handleEdit = (rowData) => {
    // TODO: Implement edit functionality
    console.log("Edit row:", rowData);
    toast.info("Edit functionality to be implemented");
  };

  const handleDelete = async (incomeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this revenue entry?");
    if (confirmDelete) {
      try {
        const result = await deleteRevenue(incomeId);
        if (result) {
          toast.success("Revenue entry deleted successfully");
          reloadData(); // Refresh the data
        } else {
          toast.error("Failed to delete revenue entry");
        }
      } catch (error) {
        console.error("Error deleting revenue:", error);
        toast.error("Error deleting revenue entry");
      }
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const data = await fetchDashboardData(user.$id);
      setTotalRevenue(data.revenue);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.$id) {
      fetchCategories();
      fetchTotalRevenue();
      loadRevenueData();
    }
  }, [user?.$id]); // Dependency on user.$id ensures data loads after user context is ready

  // Add reload function to refresh data after adding new revenue
  const reloadData = () => {
    loadRevenueData();
    fetchTotalRevenue();
    fetchCategories();
  };

  return (
    <div className="my-8">
      <div className="flex justify-between items-center">
        <h1 className="flex flex-col">
          <span className="text-2xl text-gray-800">Revenue</span>
          <span className="text-sm text-gray-600">Manage your Income</span>
        </h1>
        <PrimaryButton
          text={"New Row"}
          onClick={() => {
            setIsSidePanelOpen(!isSidePanelOpen);
            console.log("Side panel opened");
          }}
        />
        {/* Modal Display */}
        <AnimatePresence>
          {isSidePanelOpen && (
            <SidePanel
              categories={categories}
              onClose={() => {
                setIsSidePanelOpen(false);
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
          title={"Total Revenue"}
          value={totalRevenue ? `MK ${totalRevenue}` : "MK 0"}
          icon={<AiFillDollarCircle />}
          color={"text-green-500"}
        />
        <StatBuilder
          title={"Total Revenue Categories"}
          value={categories && categories.length ? categories.length : 0}
          icon={<MdCategory />}
          className={"ml-10"}
          color={"text-blue-500"}
        />
      </div>
      {/* Table section */}
      <Table data={revenueData} />
    </div>
  );
}

export default Revenue;
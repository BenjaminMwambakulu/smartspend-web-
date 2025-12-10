import React, { useContext, useEffect, useRef, useState } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import { motion, AnimatePresence } from "framer-motion";
import { getIncomeCategories } from "../../services/categoryService";
import { addRevenue, fetchRevenueData } from "../../services/revenueService";
import UserContext from "../../context/userContext";
import SidePanel from "./RevenueSidePanel";
import StatBuilder from "../../components/StatBuilder";
import { AiFillDollarCircle } from "react-icons/ai";
import { MdCategory } from "react-icons/md";
import { fetchDashboardData } from "../../services/dashboardService";
import Table from "../../components/Table";

function Revenue() {
  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false);
  const [categories, setCategories] = React.useState(null);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const { user } = useContext(UserContext);
  const [revenueData, setRevenueData] = useState([]);

  const fetchCategories = async () => {
    try {
      const data = await getIncomeCategories(user.$id);
      setCategories(data.rows);
    } catch (error) {
      console.log(error);
    }
  };

  const loadRevenueData = async () => {
    try {
      const data = await fetchRevenueData(user.$id);
      console.log(data.rows); // Log the raw data // Corrected logic: Transform the raw data into an array where keys match table headers

      const transformedData = data.rows.map((row) => ({
        // Map API fields to your table headers
        "Source/Category":
          row.category?.length > 0 ? row.category[0].name : "N/A", // Assuming category is an array of objects
        Amount: `MK ${row.amount.toFixed(2)}`, // Format amount for display
        Date: new Date(row.receiptDate).toLocaleDateString(), // Format date
        Notes: row.notes, // Include a placeholder for the Actions column
        Actions: "...", // This should be replaced with an Action button/component later
      }));

      setRevenueData(transformedData);
    } catch (error) {
      console.log(error);
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
              onClose={() => setIsSidePanelOpen(false)}
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
          value={categories ? categories.length : 0}
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

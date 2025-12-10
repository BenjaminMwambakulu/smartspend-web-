import React, { useContext, useEffect, useRef, useState } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import { motion, AnimatePresence } from "framer-motion";
import { getIncomeCategories } from "../../services/categoryService";
import UserContext from "../../context/userContext";
import SidePanel from "./RevenueSidePanel";
import StatBuilder from "../../components/StatBuilder";
import { AiFillDollarCircle } from "react-icons/ai";
import { MdCategory } from "react-icons/md";
import { fetchDashboardData } from "../../services/dashboardService";

function Revenue() {
  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false);
  const [categories, setCategories] = React.useState(null);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const { user } = useContext(UserContext);
  const fetchCategories = async () => {
    try {
      const data = await getIncomeCategories(user.$id);
      setCategories(data.rows);
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
    fetchCategories();
    fetchTotalRevenue();
  }, []);

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
      {/* Stats  Display   */}

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
    </div>
  );
}

export default Revenue;

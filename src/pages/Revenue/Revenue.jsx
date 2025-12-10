import React, { useContext, useEffect, useRef, useState } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import { motion, AnimatePresence } from "framer-motion";
import { getIncomeCategories } from "../../services/categoryService";
import UserContext from "../../context/userContext";
import SidePanel from "./RevenueSidePanel";

function Revenue() {
  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false);
  const [categories, setCategories] = React.useState(null);
  const { user } = useContext(UserContext);
  const fetchCategories = async () => {
    try {
      const data = await getIncomeCategories(user.$id);
      setCategories(data.rows);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
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
    </div>
  );
}

export default Revenue;

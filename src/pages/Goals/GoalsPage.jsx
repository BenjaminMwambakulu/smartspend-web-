import React, { useContext, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import UserContext from "../../context/userContext";
import PrimaryButton from "../../components/PrimaryButton";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import Table from "../../components/Table";
import GoalsTable from "./GoalsTable";
import GoalSidePanel from "./GoalSidePanel";
import GoalDonut from "./GoalDonut";
import QuickActionContribution from "./QuickActionContribution";
import Pagination from "../../components/Pagination";
import { databaseID } from "../../config/db";
import { tableDB, account } from "../../config/appwrite";
import { ID, Query } from "appwrite";

/**
 * Goals Management Page
 * Displays goals in both chart and table formats with CRUD functionality
 */
function GoalsPage() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);
  const [quickUpdateGoal, setQuickUpdateGoal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [totalDocuments, setTotalDocuments] = useState(0);

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  /**
   * Fetch paginated goals for the logged-in user
   */
  const loadGoals = async (page = 1) => {
    if (!user?.$id) return;

    setLoading(true);
    setError(null);

    try {
      // Calculate offset based on current page and page size
      const offset = (page - 1) * pageSize;

      // Fetch paginated data from Appwrite
      const data = await tableDB.listRows({
        databaseId: databaseID,
        tableId: "goals",
        queries: [
          Query.equal("userId", user.$id),
          Query.limit(pageSize),
          Query.offset(offset),
        ],
      });

      // Update pagination metadata
      setTotalDocuments(data.total);
      setTotalPages(Math.ceil(data.total / pageSize));

      if (data && data.rows) {
        setGoals(data.rows);
      } else {
        setGoals([]);
      }
    } catch (error) {
      console.error("Error loading goals:", error);
      setError("Failed to load goals");
      setGoals([]);
      toast.error("Error loading goals");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle edit action - opens side panel with goal data
   * @param {Object} goalData - The goal to edit
   */
  const handleEdit = (goalData) => {
    setEditingGoal(goalData);
    setIsSidePanelOpen(true);
  };

  /**
   * Handle delete action - confirms and deletes a goal
   * @param {string} goalId - The ID of the goal to delete
   */
  const handleDelete = async (goalId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this goal?"
    );
    if (confirmDelete) {
      try {
        const result = await tableDB.deleteRow({
          databaseId: databaseID,
          tableId: "goals",
          rowId: goalId,
        });

        if (result) {
          toast.success("Goal deleted successfully");
          loadGoals(currentPage); // Refresh the data
        } else {
          toast.error("Failed to delete goal");
        }
      } catch (error) {
        console.error("Error deleting goal:", error);
        toast.error("Error deleting goal");
      }
    }
  };

  /**
   * Handle quick update contribution action
   * @param {Object} goalData - The goal to update
   */
  const handleQuickUpdate = (goalData) => {
    setQuickUpdateGoal(goalData);
  };

  /**
   * Handle form submission for adding/updating goals
   * @param {Object} formData - Form data to submit
   * @param {string} goalId - ID of goal to update (null for new goal)
   */
  const handleSubmit = async (formData, goalId = null) => {
    try {
      // Add userId to form data
      const dataWithUserId = {
        ...formData,
        userId: user.$id,
      };

      let result;
      if (goalId) {
        // Update existing goal
        result = await tableDB.updateRow({
          databaseId: databaseID,
          tableId: "goals",
          rowId: goalId,
          data: dataWithUserId,
        });
        toast.success("Goal updated successfully");
      } else {
        // Create new goal
        result = await tableDB.createRow({
          databaseId: databaseID,
          tableId: "goals",
          rowId: ID.unique(),
          data: dataWithUserId,
        });
        toast.success("Goal created successfully");
      }

      if (result) {
        setIsSidePanelOpen(false);
        loadGoals(currentPage); // Refresh the data
      }
    } catch (error) {
      console.error("Error saving goal:", error);
      toast.error(`Error ${editingGoal ? "updating" : "creating"} goal`);
    }
  };

  /**
   * Handle quick contribution update
   * @param {Object} formData - Contains additionalAmount to add
   */
  const handleQuickContributionSubmit = async (formData) => {
    try {
      const { additionalAmount } = formData;

      // Calculate new contributed amount
      const currentAmount = quickUpdateGoal.amountContributed || 0;
      const newAmount = currentAmount + parseFloat(additionalAmount);

      // Update the goal with new contributed amount
      const result = await tableDB.updateRow({
        databaseId: databaseID,
        tableId: "goals",
        rowId: quickUpdateGoal.$id,
        data: {
          amountContributed: newAmount,
        },
      });

      if (result) {
        toast.success("Contribution updated successfully");
        setQuickUpdateGoal(null);
        loadGoals(currentPage); // Refresh the data
      }
    } catch (error) {
      console.error("Error updating contribution:", error);
      toast.error("Error updating contribution");
    }
  };

  /**
   * Reload data when user or page changes
   */
  const reloadData = () => {
    loadGoals(currentPage);
  };

  // Load goals when user or page changes
  useEffect(() => {
    loadGoals(currentPage);
  }, [user, currentPage]);

  // Auto-slide carousel
  useEffect(() => {
    if (goals.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % goals.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [goals.length]);

  // Scroll to current slide
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: currentSlide * 280, // Width of each slide (256px + margins)
        behavior: "smooth",
      });
    }
  }, [currentSlide]);

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
            <h1 className="text-3xl font-bold text-gray-900">
              Financial Goals
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage your savings targets
            </p>
          </div>
          <PrimaryButton
            text={"+ New Goal"}
            onClick={() => setIsSidePanelOpen(true)}
          />
        </div>

        {/* Donut Chart Carousel */}
        {goals && goals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Goal Progress
            </h2>
            <div
              ref={sliderRef}
              className="w-full overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="flex space-x-6 min-w-max">
                {goals.map((goal, index) => (
                  <div
                    key={goal.$id}
                    className="shrink-0 w-64 bg-white rounded-lg shadow p-4"
                  >
                    <GoalDonut goal={goal} />
                  </div>
                ))}
              </div>
            </div>

            {goals.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {goals.map((_, index) => (
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-gray-500 text-sm font-medium">Total Goals</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              {goals ? goals.length : 0}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-gray-500 text-sm font-medium">In Progress</div>
            <div className="text-2xl font-bold text-blue-600 mt-2">
              {goals
                ? goals.filter((g) => {
                    const contributed = g.amountContributed || 0;
                    const target = g.targetAmount || 1;
                    const progress = (contributed / target) * 100;
                    return progress > 0 && progress < 100;
                  }).length
                : 0}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-gray-500 text-sm font-medium">Completed</div>
            <div className="text-2xl font-bold text-green-600 mt-2">
              {goals
                ? goals.filter((g) => {
                    const contributed = g.amountContributed || 0;
                    const target = g.targetAmount || 1;
                    const progress = (contributed / target) * 100;
                    return progress >= 100;
                  }).length
                : 0}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-gray-500 text-sm font-medium">Total Saved</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              <sup>MK</sup>
              {goals
                ? goals
                    .reduce((sum, g) => sum + (g.amountContributed || 0), 0)
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                : 0}
            </div>
          </div>
        </div>

        {/* Goals Table */}
        <div className="mb-6">
          <GoalsTable
            goalsData={goals}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onQuickUpdate={handleQuickUpdate}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalDocuments={totalDocuments}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Empty State */}
        {goals && goals.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No goals yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first financial goal
            </p>
            <PrimaryButton onClick={() => setIsSidePanelOpen(true)}>
              Create Your First Goal
            </PrimaryButton>
          </div>
        )}
      </div>

      {/* Side Panel for Adding/Editing Goals */}
      <GoalSidePanel
        isOpen={isSidePanelOpen}
        onClose={() => {
          setIsSidePanelOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleSubmit}
        goalData={editingGoal}
      />

      {/* Quick Action Contribution Popup */}
      <AnimatePresence>
        {quickUpdateGoal && (
          <QuickActionContribution
            goal={quickUpdateGoal}
            onClose={() => setQuickUpdateGoal(null)}
            onSubmit={handleQuickContributionSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default GoalsPage;

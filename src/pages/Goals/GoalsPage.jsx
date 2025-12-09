import React from "react";
import UserContext from "../../context/userContext";
import { getGoals } from "../../services/goalsService";

export default function Goals() {
  const [goals, setGoals] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const { user } = React.useContext(UserContext);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await getGoals(user.$id);
      setGoals(res.rows);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const calculateProgress = (goal) => {
    if (!goal.targetAmount || goal.targetAmount === 0) return 0;
    const contributed = goal.amountContributed || 0;
    return Math.min(Math.round((contributed / goal.targetAmount) * 100), 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Financial Goals
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage your savings targets
            </p>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-colors"
            onClick={() => {
              /* Add goal functionality */
            }}
          >
            + New Goal
          </button>
        </div>

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
                ? goals.filter(
                    (g) =>
                      calculateProgress(g) > 0 && calculateProgress(g) < 100
                  ).length
                : 0}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-gray-500 text-sm font-medium">Completed</div>
            <div className="text-2xl font-bold text-green-600 mt-2">
              {goals
                ? goals.filter((g) => calculateProgress(g) === 100).length
                : 0}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-gray-500 text-sm font-medium">Total Saved</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              $
              {goals
                ? goals
                    .reduce((sum, g) => sum + (g.amountContributed || 0), 0)
                    .toLocaleString()
                : 0}
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals && goals.length > 0 ? (
            goals.map((goal) => (
              <GoalCard
                key={goal.goalId}
                goal={goal}
                calculateProgress={calculateProgress}
              />
            ))
          ) : (
            <div className="col-span-2">
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
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">
                  Create Your First Goal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GoalCard({ goal, calculateProgress }) {
  const progress = calculateProgress(goal);
  const contributed = goal.amountContributed || 0;
  const target = goal.targetAmount || 1;

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!goal.deadline) return null;
    const deadline = new Date(goal.deadline);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  // Priority colors
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  const progressColor =
    progress === 100
      ? "bg-green-500"
      : progress >= 75
      ? "bg-blue-500"
      : progress >= 50
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-100 to-primary flex items-center justify-center">
            <svg
              className="w-7 h-7 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {goal.goalName}
            </h3>
            <p className="text-sm text-gray-500 truncate max-w-xs">
              {goal.description || "No description"}
            </p>
          </div>
        </div>
        {goal.priority && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              priorityColors[goal.priority] || "bg-gray-100 text-gray-800"
            }`}
          >
            {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-gray-900">{progress}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColor} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Amount Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Saved</div>
          <div className="text-lg font-bold text-gray-900">
            ${contributed.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Target</div>
          <div className="text-lg font-bold text-gray-900">
            ${target.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          {daysRemaining !== null && (
            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {daysRemaining > 0 ? `${daysRemaining} days left` : "Expired"}
              </span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button className="text-gray-600 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/userContext";
import { getGoals } from "../services/goalsService";
import { GiStairsGoal } from "react-icons/gi";
import { AiFillClockCircle } from "react-icons/ai";
import { IoBatteryFullOutline } from "react-icons/io5";
import { FaEquals } from "react-icons/fa";
import { formatMoney } from "../utils/formatMoney";

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
    <div className="bg-transparent mt-16">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Financial Goals
            </h1>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <StatBuilder
              title="Goals"
              value={goals ? goals.length : 0}
              icon={<GiStairsGoal />}
            />
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <StatBuilder
              title={"In Progress"}
              value={
                goals
                  ? goals.filter(
                      (g) =>
                        calculateProgress(g) > 0 && calculateProgress(g) < 100
                    ).length
                  : 0
              }
              color={"text-blue-500"}
              icon={<AiFillClockCircle />}
            />
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <StatBuilder
              title="Completed"
              value={
                goals
                  ? goals.filter((g) => calculateProgress(g) === 100).length
                  : 0
              }
              icon={<IoBatteryFullOutline />}
              color="text-green-500"
            />
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <StatBuilder
              title="Total Saved"
              value={
                goals ? (
                  <>
                    <sup>MK</sup>
                    {formatMoney(goals.reduce((sum, g) => sum + (g.amountContributed || 0), 0))}
                  </>
                ) : (
                  <>
                    <sup>MK</sup>0
                  </>
                )
              }
              icon={<FaEquals />}
              color="text-orange-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBuilder({ title, value, icon, color }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`mb-4 text-4xl p-2 rounded-full ${color}`}>{icon}</div>
      <div className="text-2xl">{value}</div>
      <div className={`${color}`}>{title}</div>
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import { AiFillDollarCircle } from "react-icons/ai";
import { TbShoppingCartDollar } from "react-icons/tb";
import { FaHandHoldingDollar } from "react-icons/fa6";
import {
  getBudget,
  getExpenses,
  getRevenue,
} from "../services/overviewService"; // Assume these service functions exist
import UserContext from "../context/userContext"; // Assume this context exists
import BudgetPie from "../pages/Home/budgetPie"; // Assume this component exists
import BarGraph from "../pages/Home/barGraph"; // Your modified BarGraph component

/**
 * Aggregates financial data by month/year key (YYYY-MM).
 * @param {Array} rows - The data rows (expenses or revenue).
 * @param {string} dateColumn - The name of the date column ('transactionDate' or 'receiptDate').
 * @returns {Object} An object where keys are 'YYYY-MM' and values are the total amount.
 */
const aggregateDataByMonth = (rows, dateColumn) => {
  return rows.reduce((acc, row) => {
    const dateString = row[dateColumn];
    if (!dateString || !row.amount) return acc;

    const date = new Date(dateString);

    // Create the month key in YYYY-MM format (e.g., "2025-01")
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    acc[monthKey] = (acc[monthKey] || 0) + (row.amount || 0);
    return acc;
  }, {});
};

// Proper money formatting
const formatMoney = (num) => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function Overview() {
  const { user } = useContext(UserContext);
  // States for total amounts
  const [expenses, setExpenses] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [balance, setBalance] = useState(0);

  // States for budget tracking
  const [budget, setBudget] = useState(0);
  const [budgetName, setBudgetName] = useState("");

  // New states for monthly aggregated data for the bar graph
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [monthlyRevenue, setMonthlyRevenue] = useState({});

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch Data
      const data = await getExpenses(user.$id);
      const revenueData = await getRevenue(user.$id);
      const budgetData = await getBudget(user.$id);

      // console.log("Revenue Data:", revenueData);
      // console.log("Expenses Data:", data);
      // console.log("Budget Data:", budgetData);

      let totalRevenue = 0;
      let totalExpenses = 0;
      let monthlyRev = {};
      let monthlyExp = {};

      // 2. Process Revenue Data
      if (revenueData && revenueData.rows) {
        monthlyRev = aggregateDataByMonth(revenueData.rows, "receiptDate");
        setMonthlyRevenue(monthlyRev);

        // Calculate total revenue
        totalRevenue = Object.values(monthlyRev).reduce(
          (sum, amount) => sum + amount,
          0
        );
        setRevenue(totalRevenue);
      }

      // 3. Process Expenses Data
      if (data && data.rows) {
        monthlyExp = aggregateDataByMonth(data.rows, "transactionDate");
        setMonthlyExpenses(monthlyExp);

        // Calculate total expenses
        totalExpenses = Object.values(monthlyExp).reduce(
          (sum, amount) => sum + amount,
          0
        );
        setExpenses(totalExpenses);
      }

      // 4. Process Budget Data
      if (budgetData && budgetData.rows && budgetData.rows.length > 0) {
        const totalBudget = budgetData.rows[0].amount || 0;
        setBudget(totalBudget);
        setBudgetName(budgetData.rows[0]["name"] || "");
      }

      // 5. Calculate Balance
      setBalance(totalRevenue - totalExpenses);
    }
    fetchData();
  }, [user.$id]); // Re-run effect if user ID changes

  // Note: The second useEffect is removed as it was redundant.

  return (
    <div className="p-8 bg-white rounded-3xl flex justify-between">
      <div className="flex w-[60%] flex-col  border-r-2 pr-8 border-gray-300">
        <div className="flex justify-between w-full">
          {/* Total Expenses Stat */}
          <StatBuilder
            title="Expenses"
            value={`MK ${formatMoney(expenses)}`}
            icon={<FaHandHoldingDollar />}
            color="text-red-500"
          />
          {/* Total Revenue Stat */}
          <StatBuilder
            title="Revenue"
            value={`MK ${formatMoney(revenue)}`}
            icon={<AiFillDollarCircle />}
            color="text-blue-500"
          />
          {/* Total Balance Stat */}
          <StatBuilder
            title="Balance"
            value={`MK ${formatMoney(balance)}`}
            icon={<TbShoppingCartDollar />}
            color="text-green-500"
          />
        </div>

        {/* Monthly Bar Graph */}
        <BarGraph
          monthlyExpenses={monthlyExpenses}
          monthlyRevenue={monthlyRevenue}
        />
      </div>

      <div className="w-[40%] pl-6">
        <h1 className="text-3xl text-gray-700 mb-2 flex items-center">
          Budget{" "}
          <span className="text-secondary text-base ml-2">({budgetName})</span>
        </h1>
        <BudgetPie budget={budget} expenses={expenses} />
      </div>
    </div>
  );
}

// StatBuilder Component (Kept as is)
function StatBuilder({ title, value, icon, color }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`mb-4 text-4xl shadow p-2 rounded-full ${color}`}>
        {icon}
      </div>
      <div className="text-2xl">{value}</div>
      <div className={`${color}`}>{title}</div>
    </div>
  );
}

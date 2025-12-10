import React, { useContext, useEffect, useState } from "react";
import { AiFillDollarCircle } from "react-icons/ai";
import { TbShoppingCartDollar } from "react-icons/tb";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { fetchDashboardData } from "../services/dashboardService"; // Updated import
import UserContext from "../context/userContext";
import BudgetPie from "../pages/Home/budgetPie";
import BarGraph from "../pages/Home/barGraph";

// Proper money formatting
const formatMoney = (num) => {
  // Handle case where num is undefined or null
  if (num === undefined || num === null) {
    num = 0;
  }
  
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
      try {
        const data = await fetchDashboardData(user.$id);
        
        setExpenses(data.expenses);
        setRevenue(data.revenue);
        setBalance(data.balance);
        setBudget(data.budget);
        setBudgetName(data.budgetName);
        setMonthlyExpenses(data.monthlyExpenses);
        setMonthlyRevenue(data.monthlyRevenue);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    }
    fetchData();
  }, [user.$id]);

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
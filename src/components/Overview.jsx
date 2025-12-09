import React, { useContext, useEffect, useState } from "react";
import { AiFillDollarCircle } from "react-icons/ai";
import { TbShoppingCartDollar } from "react-icons/tb";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { getExpenses, getRevenue } from "../services/overviewService";
import UserContext from "../context/userContext";
import BudgetPie from "../pages/Home/budgetPie";

export default function Overview() {
  const { user } = useContext(UserContext);
  const [expenses, setExpenses] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const data = await getExpenses(user.$id);
      const revenueData = await getRevenue(user.$id);

      console.log("Revenue Data:", revenueData);
      console.log("Expenses Data:", data);

      if (revenueData && revenueData.rows) {
        const totalRevenue = revenueData.rows.reduce(
          (sum, row) => sum + (row.amount || 0),
          0
        );
        setRevenue(totalRevenue);
      }

      if (data && data.rows) {
        const totalExpenses = data.rows.reduce(
          (sum, row) => sum + (row.amount || 0),
          0
        );
        setExpenses(totalExpenses);
      }

      setBalance(revenue - expenses);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      setBalance(revenue - expenses);
    }
    fetchData();
  });

  // Proper money formatting
  const formatMoney = (num) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="p-8 bg-white rounded-3xl flex justify-between">
      <div className="flex w-[60%] justify-between border-r-2 pr-8 border-gray-300">
        <StatBuilder
          title="Expenses"
          value={`MK ${formatMoney(expenses)}`}
          icon={<FaHandHoldingDollar />}
          color="text-red-500"
        />
        <StatBuilder
          title="Revenue"
          value={`MK ${formatMoney(revenue)}`}
          icon={<AiFillDollarCircle />}
          color="text-green-500"
        />
        <StatBuilder
          title="Balance"
          value={`MK ${formatMoney(balance)}`}
          icon={<TbShoppingCartDollar />}
          color="text-blue-500"
        />
      </div>

      <div className="w-[40%] pl-6">
        <h1 className="text-3xl text-gray-700">Budget</h1>
        <BudgetPie revenue={5000} expenses={3000} />
      </div>
    </div>
  );
}

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

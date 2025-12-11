import React, { useContext, useEffect, useState, useRef } from "react";
import { AiFillDollarCircle } from "react-icons/ai";
import { TbShoppingCartDollar } from "react-icons/tb";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { fetchDashboardData } from "../services/dashboardService";
import { fetchBudgets } from "../services/budgetService";
import UserContext from "../context/userContext";
import BudgetDoughnutChart from "./BudgetDoughnutChart";
import BarGraph from "../pages/Home/barGraph";
import { formatMoney } from "../utils/formatMoney";

export default function Overview() {
  const { user } = useContext(UserContext);
  // States for total amounts
  const [expenses, setExpenses] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [balance, setBalance] = useState(0);

  // States for budget tracking
  const [budgets, setBudgets] = useState([]);
  
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

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
        setMonthlyExpenses(data.monthlyExpenses);
        setMonthlyRevenue(data.monthlyRevenue);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    }
    fetchData();
    fetchBudgetData();
  }, [user.$id]);
  
  async function fetchBudgetData() {
    try {
      const budgetData = await fetchBudgets(user.$id);
      if (budgetData && budgetData.rows) {
        setBudgets(budgetData.rows);
      }
    } catch (error) {
      console.error("Error loading budget data:", error);
    }
  }
  
  // Auto-slide carousel
  useEffect(() => {
    if (budgets.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % budgets.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [budgets.length]);

  // Scroll to current slide
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: currentSlide * 280, // Width of each slide (256px + margins)
        behavior: "smooth",
      });
    }
  }, [currentSlide]);

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-3xl flex flex-col lg:flex-row justify-between">
      <div className="w-full lg:w-[60%] flex flex-col border-r-0 lg:border-r-2 border-gray-300 pr-0 lg:pr-8 mb-6 lg:mb-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
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
        <div className="mt-6">
          <BarGraph
            monthlyExpenses={monthlyExpenses}
            monthlyRevenue={monthlyRevenue}
          />
        </div>
      </div>

      <div className="w-full lg:w-[40%] pl-0 lg:pl-6">
        <h1 className="text-2xl md:text-3xl text-gray-700 mb-2">Budgets</h1>
        {budgets.length > 0 ? (
          <>
            <div
              ref={sliderRef}
              className="w-full overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="flex space-x-4 sm:space-x-6 min-w-max">
                {budgets.map((budget, index) => (
                  <div
                    key={budget.$id}
                    className="shrink-0 w-64 sm:w-72 bg-white rounded-lg shadow p-4"
                  >
                    <BudgetDoughnutChart budget={budget} />
                  </div>
                ))}
              </div>
            </div>

            {budgets.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {budgets.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                      index === currentSlide ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No budgets available. Add a budget to get started.
          </div>
        )}
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
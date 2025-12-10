import {
  getBudget,
  getExpenses,
  getRevenue,
} from "./overviewService";

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

/**
 * Fetches and aggregates all dashboard data for a user
 * @param {string} userID - The ID of the user to fetch data for
 * @returns {Object} An object containing all dashboard data
 */
export async function fetchDashboardData(userID) {
  try {
    // Fetch all data in parallel
    const [expensesData, revenueData, budgetData] = await Promise.all([
      getExpenses(userID),
      getRevenue(userID),
      getBudget(userID)
    ]);

    // Initialize return values with defaults
    let totalRevenue = 0;
    let totalExpenses = 0;
    let monthlyRev = {};
    let monthlyExp = {};
    let budget = 0;
    let budgetName = "";

    // Process Revenue Data
    if (revenueData && revenueData.rows) {
      monthlyRev = aggregateDataByMonth(revenueData.rows, "receiptDate");
      
      // Calculate total revenue
      totalRevenue = Object.values(monthlyRev).reduce(
        (sum, amount) => sum + amount,
        0
      );
    }

    // Process Expenses Data
    if (expensesData && expensesData.rows) {
      monthlyExp = aggregateDataByMonth(expensesData.rows, "transactionDate");
      
      // Calculate total expenses
      totalExpenses = Object.values(monthlyExp).reduce(
        (sum, amount) => sum + amount,
        0
      );
    }

    // Process Budget Data
    if (budgetData && budgetData.rows && budgetData.rows.length > 0) {
      budget = budgetData.rows[0].amount || 0;
      budgetName = budgetData.rows[0]["name"] || "";
    }

    return {
      expenses: totalExpenses || 0,
      revenue: totalRevenue || 0,
      balance: (totalRevenue - totalExpenses) || 0,
      budget: budget || 0,
      budgetName: budgetName || "",
      monthlyExpenses: monthlyExp,
      monthlyRevenue: monthlyRev
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return default values in case of error
    return {
      expenses: 0,
      revenue: 0,
      balance: 0,
      budget: 0,
      budgetName: "",
      monthlyExpenses: {},
      monthlyRevenue: {}
    };
  }
}
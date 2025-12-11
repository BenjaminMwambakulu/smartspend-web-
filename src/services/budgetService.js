import { ID, Query } from "appwrite";
import { tableDB } from "../config/appwrite";
import { databaseID } from "../config/db";

/**
 * Fetch all budgets for a user
 * @param {string} userID - The ID of the user
 * @returns {Promise} - Promise that resolves to budget data
 */
export async function fetchBudgets(userID) {
  try {
    const budgetData = await tableDB.listRows({
      databaseId: databaseID,
      tableId: "budget",
      queries: [
        Query.equal("userId", userID),
        Query.orderAsc("name"),
        Query.select(["*", "category.categoryName"]),
      ],
    });
    return budgetData;
  } catch (error) {
    console.error("Error fetching budget data:", error);
    return null;
  }
}

// New function for fetching paginated budget data
export async function fetchPaginatedBudgetData(userID, limit = 10, offset = 0) {
  try {
    // Fetch budget data with pagination
    const budgetData = await tableDB.listRows({
      databaseId: databaseID,
      tableId: "budget",
      queries: [
        Query.equal("userId", userID),
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc("$createdAt"), // Order by creation date, newest first
        Query.select(["*", "category.categoryName"]),
      ],
    });
    
    return budgetData;
  } catch (error) {
    console.error("Error fetching paginated budget data:", error);
    throw error;
  }
}

/**
 * Add a new budget
 * @param {Object} budgetData - The budget data to add
 * @returns {Promise} - Promise that resolves to the added budget
 */
export async function addBudget(budgetData = {}) {
  if (!budgetData) return new Error("Invalid budget data");
  try {
    const res = await tableDB.createRow({
      databaseId: databaseID,
      rowId: ID.unique(),
      tableId: "budget",
      data: budgetData,
    });
    return res;
  } catch (error) {
    console.error("Error adding budget:", error);
    return null;
  }
}

/**
 * Update an existing budget
 * @param {string} budgetId - The ID of the budget to update
 * @param {Object} budgetData - The updated budget data
 * @returns {Promise} - Promise that resolves to the updated budget
 */
export async function updateBudget(budgetId, budgetData = {}) {
  if (!budgetId || !budgetData) return new Error("Invalid budget data");
  try {
    const res = await tableDB.updateRow({
      databaseId: databaseID,
      tableId: "budget",
      rowId: budgetId,
      data: budgetData,
    });
    return res;
  } catch (error) {
    console.error("Error updating budget:", error);
    return null;
  }
}

/**
 * Delete a budget
 * @param {string} budgetId - The ID of the budget to delete
 * @returns {Promise} - Promise that resolves to the deletion result
 */
export async function deleteBudget(budgetId) {
  try {
    const res = await tableDB.deleteRow({
      databaseId: databaseID,
      tableId: "budget",
      rowId: budgetId,
    });
    return res;
  } catch (error) {
    console.error("Error deleting budget:", error);
    return null;
  }
}
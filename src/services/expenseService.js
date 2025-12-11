import { ID, Query } from "appwrite";
import { tableDB } from "../config/appwrite";
import { databaseID } from "../config/db";

export async function fetchExpenseData(userID) {
  try {
    const expenseData = await tableDB.listRows({
      databaseId: databaseID,
      tableId: "expenses",
      queries: [
        Query.equal("userId", userID),
        Query.select(["*", "category.categoryName"]), 
      ],
    });
    return expenseData;
  } catch (error) {
    console.error("Error fetching expense data:", error);
    return null;
  }
}

// New function for fetching paginated expense data
export async function fetchPaginatedExpenseData(userID, limit = 10, offset = 0) {
  try {
    // Fetch expense data with pagination
    const expenseData = await tableDB.listRows({
      databaseId: databaseID,
      tableId: "expenses",
      queries: [
        Query.equal("userId", userID),
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc("$createdAt"), // Order by creation date, newest first
        Query.select(["*", "category.categoryName"]),
      ],
    });
    
    return expenseData;
  } catch (error) {
    console.error("Error fetching paginated expense data:", error);
    throw error;
  }
}

export async function addExpense(expenseData = {}) {
  if (!expenseData) return new Error("Invalid expense data");
  try {
    const res = await tableDB.createRow({
      databaseId: databaseID,
      rowId: ID.unique(),
      tableId: "expenses",
      data: expenseData,
    });
    return res;
  } catch (error) {
    console.error("Error adding expense:", error);
    return null;
  }
}

export async function updateExpense(expenseId, expenseData = {}) {
  if (!expenseData) return new Error("Invalid expense data");
  try {
    const res = await tableDB.updateRow({
      databaseId: databaseID,
      tableId: "expenses",
      rowId: expenseId,
      data: expenseData,
    });
    return res;
  } catch (error) {
    console.error("Error updating expense:", error);
    return null;
  }
}

export async function deleteExpense(expenseId) {
  try {
    const res = await tableDB.deleteRow({
      databaseId: databaseID,
      tableId: "expenses",
      rowId: expenseId,
    });
    return res;
  } catch (error) {
    console.error("Error deleting expense:", error);
    return null;
  }
}
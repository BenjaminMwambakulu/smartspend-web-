import { ID, Query } from "appwrite";
import { tableDB } from "../config/appwrite";
import { databaseID } from "../config/db";

export async function fetchRevenueData(userID) {
  try {
    const revenueData = await tableDB.listRows({
      databaseId: databaseID,
      tableId: "income",
      queries: [
        Query.equal("userId", userID),
        Query.select(["*", "category.categoryName"]), 
      ],
    });
    return revenueData;
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return null;
  }
}

// New function for fetching paginated revenue data
export async function fetchPaginatedRevenueData(userID, limit = 10, offset = 0) {
  try {
    // Fetch revenue data with pagination
    const revenueData = await tableDB.listRows({
      databaseId: databaseID,
      tableId: "income",
      queries: [
        Query.equal("userId", userID),
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc("$createdAt"), // Order by creation date, newest first
        Query.select(["*", "category.categoryName"]),
      ],
    });
    
    return revenueData;
  } catch (error) {
    console.error("Error fetching paginated revenue data:", error);
    throw error;
  }
}

export async function addRevenue(revenueData = {}) {
  if (!revenueData) return new Error("Invalid revenue data");
  try {
    const res = await tableDB.createRow({
      databaseId: databaseID,
      rowId: ID.unique(),
      tableId: "income",
      data: revenueData,
    });
    return res;
  } catch (error) {
    console.error("Error adding revenue:", error);
    return null;
  }
}

export async function deleteRevenue(incomeId) {
  try {
    const res = await tableDB.deleteRow({
      databaseId: databaseID,
      tableId: "income",
      rowId: incomeId,
    });
    return res;
  } catch (error) {
    console.error("Error deleting revenue:", error);
    return null;
  }
}
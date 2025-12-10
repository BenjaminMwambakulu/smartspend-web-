import { ID, Query } from "appwrite";
import { tableDB } from "../config/appwrite";
import { databaseID } from "../config/db";
export async function fetchRevenueData(userID) {
  try {
    const revenueData = await tableDB.listRows({
      databaseId: databaseID,
      tableId: "income",
      queries: [
        Query.select(["*", "category.categoryName", "category.type"]),
        Query.equal("category.type", "income"),
        Query.equal("userId", userID),
      ],
    });
    return revenueData;
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return null;
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

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
        Query.equal("userId", userID),
      ],
    });
    return revenueData;
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return null;
  }
}

import { ID, Query } from "appwrite";
import { tableDB } from "../config/appwrite";
import { databaseID } from "../config/db";
export async function getIncomeCategories(userID) {
  try {
    const res = await tableDB.listRows({
      databaseId: databaseID,
      tableId: "category",
      queries: [
        Query.equal("userId", userID),
        Query.equal("type", "income"),
        Query.select("categoryName", "type", "categoryId"),
      ],
    });
    return res;
  } catch (error) {
    console.error("Error fetching income categories:", error);
    return null;
  }
}

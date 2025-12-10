import { ID, Query } from "appwrite";
import { tableDB } from "../config/appwrite";
import { databaseID } from "../config/db";

export async function getExpenses(userID) {
  try {
    const res = await tableDB.listRows({
      databaseId: databaseID,
      tableId: "expenses",
      // FIX: Add 'transactionDate' to the selection
      queries: [
        Query.select(["amount", "transactionDate"]),
        Query.equal("userId", userID),
      ],
    });

    return res;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return null;
  }
}

export async function getRevenue(userID) {
  try {
    const res = await tableDB.listRows({
      databaseId: databaseID,
      tableId: "income", // Assuming 'income' is the correct tableId for revenue
      // FIX: Add 'receiptDate' to the selection
      queries: [
        Query.select(["amount", "receiptDate"]),
        Query.equal("userId", userID),
      ],
    });
    return res;
  } catch (error) {
    console.error("Error fetching revenue:", error);
    return null;
  }
}

export async function getBudget(userID) {
  try {
    const res = await tableDB.listRows({
      databaseId: databaseID,
      tableId: "budget",
      queries: [
        Query.select(["*", "category.categoryName", "category.type"]),
        Query.equal("userId", userID),
      ],
    });
    return res;
  } catch (error) {
    console.error("Error fetching budget:", error);
    return null;
  }
}

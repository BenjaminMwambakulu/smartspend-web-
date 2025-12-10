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


export async function addIncomeCategory(userID, categoryName) { 
  try {
    const res = await tableDB.createRow({
      databaseId: databaseID,
      tableId: "category",
      rowId : ID.unique(),
      data: {
        userId: userID,
        categoryId: ID.unique(),
        categoryName: categoryName,
        type: "income",
      },
    });
    getIncomeCategories(userID)
    return res;
  } catch (error) {
    console.error("Error adding income category:", error);
    return null;
  }
}
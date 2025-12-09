import { ID, Query } from "appwrite";
import { tableDB } from "../config/appwrite";
import { databaseID } from "../config/db";

export async function getGoals(userID) {
  try {
    const res = await tableDB.listRows({
      databaseId: databaseID,
      tableId: "goals",
      queries: [Query.equal("userId", userID)],
    });
    return res;
  } catch (error) {
    console.error("Error fetching goals:", error);
    return null;
  }
}

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

/**
 * Add a new goal
 * @param {Object} goalData - The goal data to add
 * @returns {Promise} - Promise that resolves to the added goal
 */
export async function addGoal(goalData = {}) {
  if (!goalData) return new Error("Invalid goal data");
  try {
    const res = await tableDB.createRow({
      databaseId: databaseID,
      rowId: ID.unique(),
      tableId: "goals",
      data: goalData,
    });
    return res;
  } catch (error) {
    console.error("Error adding goal:", error);
    return null;
  }
}

/**
 * Update an existing goal
 * @param {string} goalId - The ID of the goal to update
 * @param {Object} goalData - The updated goal data
 * @returns {Promise} - Promise that resolves to the updated goal
 */
export async function updateGoal(goalId, goalData = {}) {
  if (!goalId || !goalData) return new Error("Invalid goal data");
  try {
    const res = await tableDB.updateRow({
      databaseId: databaseID,
      tableId: "goals",
      rowId: goalId,
      data: goalData,
    });
    return res;
  } catch (error) {
    console.error("Error updating goal:", error);
    return null;
  }
}

/**
 * Delete a goal
 * @param {string} goalId - The ID of the goal to delete
 * @returns {Promise} - Promise that resolves to the deletion result
 */
export async function deleteGoal(goalId) {
  try {
    const res = await tableDB.deleteRow({
      databaseId: databaseID,
      tableId: "goals",
      rowId: goalId,
    });
    return res;
  } catch (error) {
    console.error("Error deleting goal:", error);
    return null;
  }
}
import { account, storage, tableDB } from "../config/appwrite";
import { databaseID, profileBucket } from "../config/db";
import { ID, Query } from "appwrite";

/**
 * Update user's name
 * @param {string} name - New name for the user
 * @returns {Promise} Promise that resolves with the updated user data
 */
export async function updateUserName(name) {
  try {
    const response = await account.updateName(name);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get user profile from the profiles collection
 * @param {string} userId - The user ID
 * @returns {Promise} Promise that resolves with the user profile data
 */
export async function getUserProfile(userId) {
  try {
    const response = await tableDB.listRows({
      databaseId: databaseID,
      tableId: "profiles",
      queries: [Query.equal("userId", userId)],
    });

    if (response.rows.length > 0) {
      return { success: true, data: response.rows[0] };
    } else {
      return { success: false, error: "Profile not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update user profile in the profiles collection
 * @param {string} profileId - The profile document ID
 * @param {object} data - The data to update
 * @returns {Promise} Promise that resolves with the updated profile data
 */
export async function updateUserProfile(profileId, data) {
  try {
    const response = await tableDB.updateRow({
      databaseId: databaseID,
      tableId: "profiles",
      rowId: profileId,
      data: data,
    });

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default {
  updateUserName,
  getUserProfile,
  updateUserProfile,
};


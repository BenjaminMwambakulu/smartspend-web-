import { account } from "../config/appwrite";

export async function registerWithEmail(name, email, password) {
  try {
    const user = await account.create({ name, email, password });
    return { success: "User registered successfully", data: user };
  } catch (error) {
    return { error: error.message };
  }
}

export async function loginWithEmail(email, password) {
  try {
    const session = await account.createEmailPasswordSession({
      email,
      password,
    });
    return { success: "User logged in successfully", data: session };
  } catch (error) {
    return { error: error.message };
  }
}

export async function logout() {
  try {
    await account.deleteSession({ sessionId: "current" });
    return { success: "User logged out successfully" };
  } catch (error) {
    return { error: error.message };
  }
}

export async function passwordRecovery(email) {
  try {
    await account.createRecovery({
      email: email,
      url: "https://example.com/recovery",
    });
    return { success: "Password recovery email sent successfully" };
  } catch (error) {
    return { error: error.message };
  }
}

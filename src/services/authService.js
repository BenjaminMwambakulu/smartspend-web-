import { ID, Permission, Role } from "appwrite";
import { account, tableDB } from "../config/appwrite";

export async function registerWithEmail(email, password, name = "user") {
  try {
    const cleanEmail = email.trim();

    const user = await account.create({
      userId: ID.unique(),
      email: cleanEmail,
      password: password,
      name: name,
    });
    console.log(user);

    const session = await account.createEmailPasswordSession({
      email: cleanEmail,
      password: password,
    });

    console.log("Logged in session:", session);

    const profile = await tableDB.createRow({
      databaseId: "693729b80010142ed09e",
      tableId: "profiles",
      rowId: ID.unique(),
      data: {
        userId: user.$id,
        username: name,
        email: cleanEmail,
        profilePicture: `https://ui-avatars.com/api/?name=${name}`,
      },
      permissions: [
        Permission.read(Role.user(user.$id)),
        Permission.write(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ],
    });

    return { success: "User registered successfully", data: user };
  } catch (error) {
    console.error(error);
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

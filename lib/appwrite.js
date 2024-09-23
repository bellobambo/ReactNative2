import { router } from "expo-router";
import { Alert } from "react-native";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.bambo.aora",
  projectId: "66f057d00028ae75c7a1",
  databaseId: "66f1649a001bf24440ff",
  userCollectionId: "66f164af0038d6f58dd2",
  videoCollectionId: "66f164f2000f55394f5a",
  storageId: "66f16a49002cf00ce5db",
};

const client = new Client(config.endpoint);

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const sessions = await account.listSessions();

    if (sessions.total > 0) {
      for (const session of sessions.sessions) {
        await account.deleteSession(session.$id);
      }
    }

    const session = await account.createEmailPasswordSession(email, password);
    router.replace("/home");
    return session;
  } catch (error) {
    throw new Error(error.message || "Sign-in failed");
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$createdAt)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

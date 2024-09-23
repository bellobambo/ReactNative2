import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";

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
    const newUser = await databases.createDocument();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error(error);
  }
}

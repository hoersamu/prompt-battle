import { useStorage } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";

export function useAnonymousAuth() {
  const user = useSupabaseUser();
  const { auth } = useSupabaseClient();
  const acc = useStorage(
    "acc",
    {},
    undefined,
    {
      serializer: {
        // Encode the value as base64 before saving it to the storage. This is just obfuscation
        read: (value) => {
          if (!value)
            return {};
          return JSON.parse(atob(value));
        },
        write: value => btoa(JSON.stringify(value)),
      },
    },
  );

  const signUp = async () => {
    const email = `${uuidv4()}@example.com`;
    const password = uuidv4();

    Logger.log("Signing up...");
    auth.signUp({ email, password }).then(() => {
      acc.value = { email, password };
      Logger.log("Signed up!");
    }).catch((error) => {
      Logger.error("Error signing up:", error);
    });
  };

  const signIn = async () => {
    Logger.log("Signing in...");
    auth.signInWithPassword({ email: acc.value.email, password: acc.value.password }).then(() => {
      Logger.log("Signed in!");
    }).catch((error) => {
      Logger.error("Error signing in:", error);
      signUp();
    });
  };

  const clearAcc = () => {
    acc.value = {};
  };

  const handleLoginOrSignUp = async () => {
    if (user.value)
      return Logger.log("User is already signed in.");

    if (acc.value.email && acc.value.password)
      return await signIn();
    signUp();
  };

  const signOut = () => {
    auth.signOut();
  };

  return {
    handleLoginOrSignUp,
    signOut,
    clearAcc,
  };
}

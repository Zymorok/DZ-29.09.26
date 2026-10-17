import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import type { DataModel } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password<DataModel>({
    profile(params) {
      const email = String(params.email ?? "").trim().toLowerCase();
      const name = String(params.name ?? "").trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Некоректний email");
      }
      if (params.flow === "signUp" && !name) {
        throw new Error("Вкажіть ім'я гравця");
      }

      return params.flow === "signUp" ? { email, name } : { email };
    },
  })],
});


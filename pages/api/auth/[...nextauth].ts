import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Code", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.password === "7913") {
          return {
            id: "1",
            name: "Admin", 
            email: "admin@example.com",
            role: "admin"
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Updated path to match the correct route
  },
  session: {
    strategy: "jwt",
  }
});

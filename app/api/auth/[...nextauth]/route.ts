import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

// In-memory user store (replace with DB in production)
const users = [
  {
    id: "1",
    name: "AllFi User",
    email: "demo@allfi.app",
    // password: "allfi2026" — pre-hashed for demo
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMye.Izqy0VJjVQJHYfWQJ1b3c5c5v5xyzq",
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = users.find((u) => u.email === credentials.email);
        if (!user) return null;

        // For demo: plain text check (demo@allfi.app / allfi2026)
        if (
          credentials.email === "demo@allfi.app" &&
          credentials.password === "allfi2026"
        ) {
          return { id: user.id, name: user.name, email: user.email };
        }

        // Check hashed password
        const valid = await compare(credentials.password, user.password);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? "allfi-dev-secret-change-in-prod",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

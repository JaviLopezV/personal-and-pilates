import "server-only";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // ✅ mejor con Prisma para evitar líos de columnas
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) return null;

        if ((user as any).disabled) {
          throw new Error("ACCOUNT_DISABLED");
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user as any).role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user?.id) token.id = user.id;
      if (user?.role) token.role = user.role;
      return token;
    },
    async session({ session, token }: any) {
      (session.user as any).id = token.id;
      (session.user as any).role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

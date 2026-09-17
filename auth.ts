import NextAuth from "next-auth"; 
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";


import { prisma } from "@/src/lib/prisma";
import Email from "next-auth/providers/email";

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials){
                if (
                    typeof credentials?.email !== "string" ||
                    typeof credentials?.password !== "string"
                ) {
                    return null;
                }

                const email = credentials.email.toLowerCase().trim()

                const user = await prisma.user.findUnique({
                    where: {email},
                });

                if (!user){
                    return null;
                }

                const passwordMatches = await bcrypt.compare(
                    credentials.password,
                    user.password,
                );

                if (!passwordMatches){
                    return null;
                }

                return {
                    id : user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],

    session: {
        strategy : "jwt",
    },

    pages: {
        signIn : "/login",
    },

});




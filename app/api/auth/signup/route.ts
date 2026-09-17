import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {z} from "zod";

import {prisma} from "@/src/lib/prisma";

const signupSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(100)
});

export async function POST(request: Request) {
    try{
        const body = await request.json();
        const result = signupSchema.safeParse(body);

        if (!result.success){
            return NextResponse.json(
                {
                    error: "Invalid Input", 
                },
                {status: 400},
            );
        }

        const {name, email, password} = result.data;
        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });
        if (existingUser){
            return NextResponse.json(
                {
                    error: "A user with this email already exists",
                },
                {status: 409},
            );
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        return NextResponse.json(
            {
                message: "User created successfully",
                user,
            },
            {status: 201},
        );
    }
    catch (error){
        console.error("Signup Error:", error);

        return NextResponse.json(
            {
                error: "Something went wrong",
            },
            {status: 500},
        );
    }
}




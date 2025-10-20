"use server";

import { cookies } from "next/headers";
import { sign, verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { CurrentUser } from "@/lib/types";

type LoginInput = {
  email: string;
  password: string;
};

type LoginResult = {
  success: boolean;
  message?: string;
};

export async function signIn(input: LoginInput): Promise<LoginResult> {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(input.password, user.password);

    if (!isValidPassword) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Create JWT token
    const token = sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An error occurred during login",
    };
  }
}

type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

type SignUpResult = {
  success: boolean;
  message?: string;
};

export async function signUp(input: SignUpInput): Promise<SignUpResult> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email already registered",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An error occurred during registration",
    };
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return null;
    }

    // Verify and decode the token
    const decoded = verify(
      token.value,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { userId: string };

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        memberOf: true,
      },
    });

    if (!user) {
      return null;
    }
    user.password = "";

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user !== null;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
}

export async function logout(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("Failed to logout");
  }
}

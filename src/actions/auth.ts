"use server";

import { cookies } from "next/headers";
import { sign, verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { CurrentUser } from "@/lib/types";
import { tryCatch } from "@/lib/try-catch";
import {
  requestPasswordResetSchema,
  verifyResetCodeSchema,
  resetPasswordWithCodeSchema,
} from "@/lib/validation-schemas";
import { sendTransactionalEmail } from "@/lib/sendEmail";

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

// Generate a 6-character alphanumeric code
function generateResetCode(): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function requestPasswordReset(email: string) {
  const validatedData = requestPasswordResetSchema.safeParse({ email });
  if (!validatedData.success) {
    return {
      data: null,
      error: validatedData.error.errors[0].message,
    };
  }

  // Find user by email
  const { data: user, error: findUserError } = await tryCatch(
    prisma.user.findUnique({
      where: { email: validatedData.data.email },
    })
  );

  if (findUserError) {
    return { data: null, error: "Failed to process request" };
  }

  // Don't reveal if user exists or not for security
  if (!user) {
    // Still return success to prevent email enumeration
    return { data: { success: true }, error: null };
  }

  // Generate reset code
  const resetCode = generateResetCode();
  const hashedCode = await bcrypt.hash(resetCode, 10);

  // Set expiration to 1 day from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1);

  // Delete any existing password reset for this user
  await tryCatch(
    prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    })
  );

  // Create or update password reset record
  const { data: passwordReset, error: createResetError } = await tryCatch(
    prisma.passwordReset.create({
      data: {
        email: user.email,
        token: hashedCode,
        expiresAt,
        userId: user.id,
      },
    })
  );

  if (createResetError || !passwordReset) {
    return { data: null, error: "Failed to create reset request" };
  }

  // Send email with code
  try {
    await sendTransactionalEmail(
      {
        email: user.email,
        name: user.name || "User",
      },
      "Reset your password - Teamlypro",
      `
        <div>
          <h2>Password Reset Code</h2>
          <p>You requested to reset your password for your Teamlypro account.</p>
          
          <p><strong>Your reset code is:</strong></p>
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 32px; letter-spacing: 8px; margin: 0; color: #333;">${resetCode}</h1>
          </div>
          
          <p>This code will expire in 24 hours.</p>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          
          <p><strong>Teamlypro Security Team</strong></p>
        </div>
      `,
      {
        senderName: "Teamlypro",
        senderEmail: "notifications@teamlypro.com",
      }
    );
  } catch (error) {
    console.error("Error sending password reset email:", error);
    // Don't fail the request if email fails
  }

  return { data: { success: true }, error: null };
}

export async function verifyResetCode(email: string, code: string) {
  const validatedData = verifyResetCodeSchema.safeParse({ email, code });
  if (!validatedData.success) {
    return {
      data: null,
      error: validatedData.error.errors[0].message,
    };
  }

  // Find password reset record
  const { data: passwordReset, error: findResetError } = await tryCatch(
    prisma.passwordReset.findUnique({
      where: { email: validatedData.data.email },
      include: { user: true },
    })
  );

  if (findResetError || !passwordReset) {
    return { data: null, error: "Invalid or expired reset code" };
  }

  // Check if expired
  if (new Date(passwordReset.expiresAt) < new Date()) {
    // Clean up expired reset
    await tryCatch(
      prisma.passwordReset.delete({
        where: { id: passwordReset.id },
      })
    );
    return { data: null, error: "Reset code has expired" };
  }

  // Verify code (convert to uppercase for comparison)
  const codeToVerify = code.toUpperCase();
  const isValidCode = await bcrypt.compare(codeToVerify, passwordReset.token);

  if (!isValidCode) {
    return { data: null, error: "Invalid reset code" };
  }

  return { data: { success: true }, error: null };
}

export async function resetPasswordWithCode(
  email: string,
  code: string,
  newPassword: string,
  confirmNewPassword: string
) {
  const validatedData = resetPasswordWithCodeSchema.safeParse({
    email,
    code,
    newPassword,
    confirmNewPassword,
  });

  if (!validatedData.success) {
    return {
      data: null,
      error: validatedData.error.errors[0].message,
    };
  }

  // Verify code first (convert to uppercase)
  const codeToVerify = code.toUpperCase();
  const verifyResult = await verifyResetCode(email, codeToVerify);
  if (verifyResult.error) {
    return verifyResult;
  }

  // Find password reset record to get user
  const { data: passwordReset, error: findResetError } = await tryCatch(
    prisma.passwordReset.findUnique({
      where: { email },
      include: { user: true },
    })
  );

  if (findResetError || !passwordReset) {
    return { data: null, error: "Invalid or expired reset code" };
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user password and delete reset record
  const { error: updateError } = await tryCatch(
    prisma.$transaction([
      prisma.user.update({
        where: { id: passwordReset.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordReset.delete({
        where: { id: passwordReset.id },
      }),
    ])
  );

  if (updateError) {
    return { data: null, error: "Failed to reset password" };
  }

  // Send notification email
  try {
    await sendTransactionalEmail(
      {
        email: passwordReset.user.email,
        name: passwordReset.user.name || "User",
      },
      "Your password has been reset - Teamlypro",
      `
        <div>
          <h2>Password Reset Successful</h2>
          <p>Your password for your Teamlypro account has been successfully reset.</p>
          
          <p><strong>Security Information:</strong></p>
          <ul>
            <li>If you did not make this change, please contact support immediately</li>
            <li>If you made this change, you can safely ignore this email</li>
          </ul>
          
          <p>Date: ${new Date().toLocaleDateString()}</p>
          
          <p><strong>Teamlypro Security Team</strong></p>
        </div>
      `,
      {
        senderName: "Teamlypro",
        senderEmail: "notifications@teamlypro.com",
      }
    );
  } catch (error) {
    console.error("Error sending password reset notification:", error);
    // Don't fail the request if email fails
  }

  return { data: { success: true }, error: null };
}
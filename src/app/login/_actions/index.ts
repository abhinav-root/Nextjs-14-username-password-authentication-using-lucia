"use server";

import { Argon2id } from "oslo/password";
import { generateId } from "lucia";
import { cookies } from "next/headers";

import prisma from "../../../../config/db";
import { lucia } from "@/auth";
import { LoginSchema, loginSchema } from "../_schemas";

export async function loginAction(values: LoginSchema) {
  try {
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      return { success: false, errors: result.error.flatten() };
    }

    const { email, password } = result.data;
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (!userExists) {
      return {
        success: false,
        errors: {
          root: `Invalid email or password`,
        },
      };
    }

    const isPasswordCorrect = await new Argon2id().verify(
      userExists.hashedPassword,
      password
    );
    if (!isPasswordCorrect) {
      return {
        success: false,
        errors: {
          root: `Invalid email or password`,
        },
      };
    }

    const session = await lucia.createSession(userExists.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return {
      success: true,
      message: "Your account has been created",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      errors: {
        root: "Internal Server Error",
      },
    };
  }
}

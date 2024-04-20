"use server";

import { Argon2id } from "oslo/password";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SignupSchema, signupSchema } from "../_schemas";
import prisma from "../../../../config/db";
import { lucia } from "@/auth";

export async function createAccountAction(values: SignupSchema) {
  try {
    const result = signupSchema.safeParse(values);
    if (!result.success) {
      return { success: false, errors: result.error.flatten() };
    }
      
    const { firstName, lastName, email, password } = result.data;
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return {
        success: false,
        errors: {
          root: `Email already registered. Please user a different email`,
        },
      };
    }
  
    const hashedPassword = await new Argon2id().hash(password);
    console.log({hashedPassword})
    const userId = generateId(15);
    const user = await prisma.user.create({
      data: { id: userId, email, hashedPassword, firstName, lastName},
    });
  
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return {
      success: true,
      data: user,
      message: "Your account has been created",
    };
  } catch(err) {
    console.log(err)
    return {
      success: false,
      errors: {
        root: 'Internal Server Error',
      },
    };
  }
  
}

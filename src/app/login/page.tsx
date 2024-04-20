import { validateRequest } from "@/auth";
import LoginForm from "./_components/login-form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { user } = await validateRequest();
  if (user) {
    redirect("/");
  }
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <LoginForm />
    </div>
  );
}

import { validateRequest } from "@/auth";
import Signupform from "./_components/signup-form";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const { user } = await validateRequest();
  if (user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <Signupform />
    </div>
  );
}

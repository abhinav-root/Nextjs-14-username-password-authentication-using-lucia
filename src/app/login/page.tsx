"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ReloadIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoginSchema, loginSchema } from "./_schemas";
import { FormError } from "@/components/form-error";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginAction } from "./_actions";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { setError, formState } = form;
  const rootError = formState?.errors?.root?.message;

  async function onSubmit(values: LoginSchema) {
    console.log(values);
    const response = await loginAction(values);
    if (!response.success) {
      if (response?.errors?.fieldErrors) {
        const { email, password } = response?.errors?.fieldErrors;
        email && setError("email", { message: email?.[0] });
        password && setError("password", { message: password?.[0] });
      }
      const root = response.errors?.root;
      root && setError("root", { message: root });
      return;
    } else {
      form.reset();
      toast.success("Login Successful", {
        position: "bottom-center",
      });
      setTimeout(() => router.replace("/"), 2000);
    }
  }
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="py-6 px-4 bg-white rounded shadow grow max-w-80">
        <h1 className="text-xl font-bold text-center mb-8">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="johndoe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {rootError && <FormError message={rootError} />}
            {form.formState.isSubmitting ? (
              <Button disabled className={cn("w-full")}>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className={cn("w-full")}>
                Login
              </Button>
            )}
          </form>
        </Form>
        <p className="mt-4 text-center text-sm text-gray-500">Not a user? <Link href={"/signup"} className="text-blue-500 hover:underline">Signup</Link></p>
      </div>
    </div>
  );
}

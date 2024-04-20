import { lucia, validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const { session, user } = await validateRequest();
  if (!user) {
    redirect("/login")
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="text-center text-xl">This is a protected page</h1>
        {JSON.stringify(user)}
        <br />
        {JSON.stringify(session)}
        <form
          action={async () => {
            "use server";
            const { session } = await validateRequest();
            if (!session) {
              return {
                error: "Unauthorized",
              };
            }

            await lucia.invalidateSession(session.id);

            const sessionCookie = lucia.createBlankSessionCookie();
            cookies().set(
              sessionCookie.name,
              sessionCookie.value,
              sessionCookie.attributes
            );
            return redirect("/login");
          }}
        >
          <Button type="submit">Logout</Button>
        </form>
      </div>
    </main>
  );
}

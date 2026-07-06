import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SiteNav } from "@/components/ui/nav";
import { DeleteAccountForm } from "./delete-account-form";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[440px] px-6 py-16">
        <h1 className="mb-2 text-3xl">Account</h1>
        <p className="mb-8 text-[0.95rem] text-ink-soft">
          Signed in as {session.user.email}.
        </p>

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-2 font-display text-lg font-semibold">
            Delete account
          </h2>
          <p className="mb-4 text-[0.9rem] text-ink-soft">
            This deactivates your account immediately and permanently erases
            all of your data after 30 days. Enter your password to confirm.
          </p>
          <DeleteAccountForm />
        </div>
      </main>
    </>
  );
}

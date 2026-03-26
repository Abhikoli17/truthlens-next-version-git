import Link from "next/link";
import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 md:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:items-center">
        <div>
          <Link href="/" className="text-sm text-slate-400 underline">Back to home</Link>
          <h1 className="mt-4 text-5xl font-black">Admin login</h1>
          <p className="mt-4 max-w-lg text-slate-300">
            Sign in with the admin email and password from your environment variables. This protects the dashboard for managing trust lists and score thresholds.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}

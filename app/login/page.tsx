import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm space-y-5 pt-8">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
          AgriTrack
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
          Unlock your harvests
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Enter the app password to continue.
        </p>
      </header>
      <LoginForm />
    </div>
  );
}

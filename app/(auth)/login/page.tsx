import { Suspense } from "react";
import LoginForm from "./login-form";

function LoginFallback() {
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 text-white">
      Loading…
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
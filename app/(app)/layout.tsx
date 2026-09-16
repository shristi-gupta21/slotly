import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { UserProvider } from "@/components/context/user-provider";
import { getCurrentUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getCurrentUser();
  const user = "user" in auth ? auth.user : null;
  return (
    <UserProvider user={user}>
      <div className="min-h-full flex">
        <Sidebar />
        <main className="lg:pl-72 flex flex-col w-full">
          <Header />
          <div className="px-4 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </UserProvider>
  );
}

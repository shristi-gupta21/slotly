import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex">
      <Sidebar />
      <main className="lg:pl-72 flex flex-col w-full">
        <Header />
        <div className="px-4 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}

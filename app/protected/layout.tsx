import Sidebar from '@/components/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar className="text-[#7C161600] bg-[#F08451]" />
      <main className="flex-1 px-2 sm:px-4 lg:px-6 lg:ml-64 w-full overflow-x-hidden">
        <div className="w-full pt-4">{children}</div>
      </main>
    </div>
  );
}

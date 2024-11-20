import Sidebar from '@/components/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="main-layout flex">
        <Sidebar className="text-[#7C161600] bg-[#F08451]" />
        <main className="flex-grow p-5 lg:ml-60">{children}</main>
      </div>
    </>
  );
}

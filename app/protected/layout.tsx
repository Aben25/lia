import Sidebar from '@/components/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="main-layout flex">
        <Sidebar />
        <main className="flex-grow lg:ml-60 p-5">{children}</main>
      </div>
    </>
  );
}

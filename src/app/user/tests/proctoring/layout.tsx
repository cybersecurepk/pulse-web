export default function ProctoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
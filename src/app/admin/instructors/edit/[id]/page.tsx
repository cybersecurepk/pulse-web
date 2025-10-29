import { EditInstructorPage } from "@/feature/admin/instructors/view";

export default async function EditInstructorRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <EditInstructorPage params={resolvedParams} />;
}
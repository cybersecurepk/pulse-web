import { useGetUserByIdQuery } from "@/service/rtk-query/users/users-apis";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const { id } = params;
  const { data, isLoading, isError } = useGetUserByIdQuery(id);

  if (isError) return notFound();

  return <div className="p-4"></div>;
}

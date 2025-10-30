"use client";

import { useGetUserByIdQuery } from "@/service/rtk-query/users/users-apis";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const { data, isLoading } = useGetUserByIdQuery(id, { skip: !id });

  return <div className="p-4"></div>;
}

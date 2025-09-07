"use client";

import { useParams } from "next/navigation";
import TestSection from "../../../components/test/TestSection";

export default function TestPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  if (!id) return null;

  return <TestSection id={id} />;
}
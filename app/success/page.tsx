"use client";
import { Suspense } from "react";
import SucessPage from "./SucessPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading your receipt…</div>}>
      <SucessPage />
    </Suspense>
  );
}

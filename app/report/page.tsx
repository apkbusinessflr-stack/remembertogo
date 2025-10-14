// app/report/page.tsx
import type { Metadata } from "next";
import ReportForm from "./ReportForm";

export const metadata: Metadata = { title: "Report Abuse • remembertogo" };

export default function Page() {
  return (
    <main className="space-y-4">
      <h1>Report Abuse</h1>
      <ReportForm />
    </main>
  );
}

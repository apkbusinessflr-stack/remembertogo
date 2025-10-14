// app/report/page.tsx
export const metadata = { title: "Report Abuse" };
import ReportForm from "./ReportForm";

export default function Page() {
  return (
    <main className="space-y-4">
      <h1>Report Abuse</h1>
      <ReportForm />
    </main>
  );
}

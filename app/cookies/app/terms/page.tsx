// app/cookies/app/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use • remembertogo" };

export default function Terms() {
  return (
    <main className="space-y-4">
      <h1>Terms of Use</h1>

      <h3>User Content</h3>
      <p>You grant us a license to display/distribute your tips/photos within the service.</p>

      <h3>Acceptable Use</h3>
      <p>No illegal, hateful, or infringing content. We may remove content and suspend accounts.</p>

      <h3>Liability</h3>
      <p>Service is provided “as is”. We are not liable for travel decisions or third-party content.</p>
    </main>
  );
}

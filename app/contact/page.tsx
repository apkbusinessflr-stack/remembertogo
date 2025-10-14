// app/contact/page.tsx
import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = { title: "Contact • remembertogo" };

export default function Page() {
  return (
    <main className="space-y-4">
      <h1>Contact</h1>
      <ContactForm />
    </main>
  );
}

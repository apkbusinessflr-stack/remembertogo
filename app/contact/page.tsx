// app/contact/page.tsx
export const metadata = { title: "Contact" };
import ContactForm from "./ContactForm";

export default function Page() {
  return (
    <main className="space-y-4">
      <h1>Contact</h1>
      <ContactForm />
    </main>
  );
}

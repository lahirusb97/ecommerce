// app/login/page.tsx

import CustomerLoginFormClient from "@/components/CustomerLoginForm";

export default function page() {
  return <CustomerLoginFormClient authenticated={false} />;
}

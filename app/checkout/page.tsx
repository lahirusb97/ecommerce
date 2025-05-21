// app/checkout/page.tsx
import { CheckoutForm } from "@/components/CheckoutForm";
import { CheckoutFormModel } from "@/schema/schemaCheckoutForm";

export default function CheckoutPage() {
  // On successful submit, send data to your API and proceed to payment
  const handleSubmit = async (data: CheckoutFormModel) => {
    // Here you could also attach the cart, etc.
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        // cart, etc.
      }),
    });
    const result = await response.json();
    if (result.url) {
      window.location.href = result.url; // Stripe Checkout URL
    } else {
      alert(result.error || "Checkout failed");
    }
  };

  return (
    <div className="py-6 px-2">
      <h2 className="text-2xl font-bold mb-4 text-center">Shipping Details</h2>
      <CheckoutForm onSubmit={handleSubmit} showPasswordField={true} />
      {/* Optionally, display cart summary and totals below */}
    </div>
  );
}

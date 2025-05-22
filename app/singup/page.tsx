import Link from "next/link";
import { SignupForm } from "@/components/SignupForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SignupPage() {
  return (
    <div className="flex  w-full items-center justify-center p-2 bg-background">
      <div className="w-full max-w-sm bg-white dark:bg-muted rounded-2xl shadow-lg p-2 flex flex-col space-y-2">
        <div className="flex flex-col space-y-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your details or start shopping right away!
          </p>
        </div>
        {/* Unique feature highlight */}
        <div className="flex flex-col items-center">
          <Badge variant="outline" className="bg-primary/10 text-primary mb-1">
            🛒 No account needed to shop!
          </Badge>
          <p className="text-xs text-muted-foreground text-center">
            We’ll create your account for you at checkout—no hassle!
          </p>
        </div>
        <div>
          <SignupForm />
        </div>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </p>
        {/* Call to action: Continue Shopping */}
        <Button asChild variant="outline" className="mt-1 w-full">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}

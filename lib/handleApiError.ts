import { toast } from "sonner";

export async function handleApiError(
  res: Response,
  fallback = "Something went wrong."
): Promise<string> {
  let message = fallback;
  try {
    const data = await res.json();
    if (data?.error) message = data.error;
    toast.error(message);
  } catch {
    // If the response isn't JSON, keep fallback message
    toast.error(fallback);
  }
  return message;
}

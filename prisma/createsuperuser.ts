import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

async function main() {
  console.log("=== Create SUPERADMIN User ===");
  const name = prompt("Name: ");
  const email = prompt("Email: ");
  const phone = prompt("Phone: ");
  const password = prompt.hide("Password: ");
  const confirmPassword = prompt.hide("Confirm Password: ");

  if (password !== confirmPassword) {
    console.error("Passwords do not match. Exiting.");
    process.exit(1);
  }

  // Check if user exists
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    console.error("A user with this email already exists.");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      phone,
    },
  });

  console.log("ADMIN created:", {
    id: user.id,
    email: user.email,
    role: user.role,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { redirect } from "next/navigation";

export default function RootPage() {
  console.log("Redirecting to /es");
  redirect("/es");
}

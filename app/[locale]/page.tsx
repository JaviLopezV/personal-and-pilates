import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/auth`);
  }

  const role = (session.user as any)?.role;

  // Ajusta estas rutas a las reales de tu proyecto
  if (role === "ADMIN") {
    redirect(`/bo/blogs`);
  }

  // CLIENT (o cualquier otro caso)
  redirect(`/under-construction`);
  // redirect(`/home`);
}

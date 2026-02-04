import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getTranslations } from "next-intl/server";
import EditClassForm from "./EditClassForm";
import BoPage from "../../../../components/BoPage";

type Params = { params: Promise<{ id: string }> };

export default async function EditClassPage({ params }: Params) {
  const { id } = await params;
  const t = await getTranslations("bo.boEditClass");

  const session = await prisma.classSession.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      type: true,
      instructor: true,
      notes: true,
      startsAt: true,
      endsAt: true,
      capacity: true,
    },
  });

  if (!session) return notFound();

  return (
    <BoPage title={t("title")} backHref="/bo/classes" maxWidth={900}>
      <EditClassForm session={session} />
    </BoPage>
  );
}

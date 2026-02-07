import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getTranslations } from "next-intl/server";
import BoPage from "../../../components/BoPage";
import ViewUserClient from "./ViewUserClient";
import UserNavTabs from "./UserNavTabs";

type Params = { params: Promise<{ id: string; locale: string }> };

export default async function ViewUserPage({ params }: Params) {
  const { id } = await params;
  const t = await getTranslations("bo.boViewUser");

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      notes: true,
      role: true,
      disabled: true,
      availableClasses: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) return notFound();

  const bookings = await prisma.booking.findMany({
    where: { userId: id },
    select: {
      id: true,
      status: true,
      createdAt: true,
      canceledAt: true,
      session: {
        select: {
          id: true,
          title: true,
          type: true,
          instructor: true,
          startsAt: true,
          endsAt: true,
        },
      },
    },
    orderBy: { session: { startsAt: "desc" } },
  });

  return (
    <BoPage
      title={t("title")}
      subtitle={user.name || user.email}
      backHref="/bo/users"
      maxWidth={900}
      actions={<UserNavTabs id={id} active="view" />}
    >
      <ViewUserClient
        user={{
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        } as any}
        bookings={
          bookings.map((b) => ({
            ...b,
            createdAt: b.createdAt.toISOString(),
            canceledAt: b.canceledAt ? b.canceledAt.toISOString() : null,
            session: {
              ...b.session,
              startsAt: b.session.startsAt.toISOString(),
              endsAt: b.session.endsAt.toISOString(),
            },
          })) as any
        }
      />
    </BoPage>
  );
}

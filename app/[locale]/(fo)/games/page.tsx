import { enforceFoPageStatus } from "@/app/lib/pages";
import GamesClient from "./GamesClient";

type Props = { params: Promise<{ locale: string }> };

export default async function GamesPage({ params }: Props) {
  const { locale } = await params;

  await enforceFoPageStatus({ locale, path: "/games" });

  return <GamesClient />;
}

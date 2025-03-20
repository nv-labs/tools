import { Metadata } from "next";
import Toolspage from "@/app/components/toolspage";
import List from "@/app/components/list";

export const metadata: Metadata = {
  title: "Startup tools directory - foundertools.co",
  description: "Find the best tools to launch, market, and grow your projects.",
  openGraph: {
    images: [{ url: "https://foundertools.co/img/og.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup tools directory - foundertools.co",
    description:
      "Find the best tools to launch, market, and grow your projects.",
    creator: "@socodemaker",
    images: ["https://foundertools.co/img/og.jpg"],
  },
};

export default async function Home() {
  return (
    <>
      <Toolspage>
        <List />
      </Toolspage>
    </>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import AuthProvider from "@/context/AuthProvider";
import { UserProvider } from "@/context/UserContext";
import { MenuProvider } from "@/context/MenuContext";
import LayoutWrapper from "./components/layout-wrapper";
import Categories from "./components/categories";
import "./globals.css";
import Image from "next/image";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Founder Tools Directory",
  description: "A list of useful tools and resources for startups and growth.",
  openGraph: {
    images: [{ url: "https://foundertools.co/img/og.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Founder Tools Directory",
    description:
      "A list of useful tools and resources for startups and growth.",
    creator: "@socodemaker",
    images: ["https://foundertools.co/img/og.jpg"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token || null;

  return (
    <AuthProvider accessToken={accessToken}>
      <UserProvider>
        <MenuProvider>
          <html lang="en" className="h-full" data-theme="lofi">
            <body className={`h-full ${inter.className}`}>
              <LayoutWrapper categories={<Categories />}>
                {children}
              </LayoutWrapper>
              <footer className="pb-12">
                <div className="container text-sm text-center">
                  <div className="mb-6 flex justify-center">
                    <a href="/">
                      <Image
                        src={"/img/logo.svg"}
                        className="opacity-90 w-36 lg:w-auto"
                        alt="Logo"
                        width={180}
                        height={27}
                      />
                    </a>
                  </div>
                  <div className="mb-4">
                    Some links may be affiliate links. If you click and buy
                    anything I may receive a small commission.
                  </div>
                  <div className="">
                    &copy; {new Date().getFullYear()} - Founder Tools Directory
                  </div>
                </div>
              </footer>
              <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
            </body>
          </html>
        </MenuProvider>
      </UserProvider>
    </AuthProvider>
  );
}

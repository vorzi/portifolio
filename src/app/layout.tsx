import AnimatedTitle from '@/components/TitleTyping/AnimatedTitle';
import type { Metadata } from "next";
import "@/css/globals.css";

export const metadata: Metadata = {
  description: "Vorzi platform",

  keywords: [
    "Vorzi",
    "Next.js",
    "React",
    "Web App",
  ],

  authors: [
    {
      name: "Vorzi",
    },
  ],

  creator: "Vorzi",

  applicationName: "Vorzi",

  icons: {
    icon: "https://i.ibb.co/xKLCQ9M9/Mary-Asized.png",
    shortcut: "https://i.ibb.co/xKLCQ9M9/Mary-Asized.png",
    apple: "https://i.ibb.co/xKLCQ9M9/Mary-Asized.png",
  },

  openGraph: {
    title: "Vorzi",
    description: "Vorzi platform",
    url: "https://vorzi.com",
    siteName: "Vorzi",
    images: [
      {
        url: "https://i.ibb.co/xKLCQ9M9/Mary-Asized.png",
        width: 1200,
        height: 630,
        alt: "Vorzi",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Vorzi",
    description: "Vorzi platform",
    images: ["https://i.ibb.co/xKLCQ9M9/Mary-Asized.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-full flex flex-col">
          <AnimatedTitle text='@Vorzi'/>
          {children}
        </body>
    </html>
  );
}

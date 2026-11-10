import type { Metadata } from "next";
import { DM_Sans,Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";


const dmSans = DM_Sans({
   subsets: ['latin'],
  weight: ['300','400', '500', '600'],
  variable: "--font-sans",
});
const lora = Lora({
   subsets: ['latin'],
  weight: ['400', '500', '600'],
  style : ['normal', 'italic'],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "AI App Builder",
  description: "Presonalized your AI App Builder with your own data and knowledge base. Build your own AI app with ease.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
     <ClerkProvider>
    <html   lang="en" suppressHydrationWarning>
        <body className={`${lora.variable} ${dmSans.variable} font-sans`}>
                    <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>
              <Header/>
           <main>{children}</main> 
          </ThemeProvider>
</body>
    </html>
     </ClerkProvider>
  );
}

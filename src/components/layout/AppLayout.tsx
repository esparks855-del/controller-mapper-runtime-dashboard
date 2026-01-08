import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = true, className, contentClassName }: AppLayoutProps): JSX.Element {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className={cn("flex flex-col min-h-screen transition-all duration-300", className)}>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 lg:h-[60px] sticky top-0 z-50">
          <SidebarTrigger />
          <div className="flex-1" />
          <ThemeToggle className="relative top-0 right-0" />
        </header>
        <main className={cn("flex-1", container ? "max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10" : "", contentClassName)}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
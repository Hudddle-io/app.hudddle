"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronLeft, PanelRightOpen } from "lucide-react";

import Sidebar from "@/components/shared/sidebar";
import Notificationbar from "@/components/shared/notifcation-bar";
import GoLiveCounter from "@/components/shared/golive-components/golive-counter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const RIGHT_SIDEBAR_WIDTH_OPEN = "clamp(280px, 24vw, 360px)";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const shouldShowRightSidebar = useMemo(() => {
    return pathname.startsWith("/workroom") || pathname.startsWith("/friends");
  }, [pathname]);

  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  const [isXlUp, setIsXlUp] = useState(true);
  const [isRightSidebarSheetOpen, setIsRightSidebarSheetOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");

    const handleMediaQueryChange = () => {
      setIsXlUp(mediaQuery.matches);
    };

    handleMediaQueryChange();
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () =>
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  useEffect(() => {
    // On smaller screens, keep the right sidebar out of the layout grid
    // and use the slide-in Sheet instead.
    if (!isXlUp) {
      setIsRightSidebarOpen(false);
    }
  }, [isXlUp]);

  const rightSidebarWidth =
    shouldShowRightSidebar && isXlUp
      ? isRightSidebarOpen
        ? RIGHT_SIDEBAR_WIDTH_OPEN
        : "0px"
      : "0px";

  const gridTemplateColumns =
    shouldShowRightSidebar && isXlUp
      ? `250px minmax(0, 1fr) ${rightSidebarWidth}`
      : "250px minmax(0, 1fr)";

  return (
    <main className="w-full h-screen grid" style={{ gridTemplateColumns }}>
      <Sidebar />

      <div className="relative overflow-y-auto overflow-x-hidden scroll-hidden h-screen border-r border-slate-200 min-w-0">
        <GoLiveCounter />
        {children}

        {shouldShowRightSidebar && !isXlUp && (
          <Sheet
            open={isRightSidebarSheetOpen}
            onOpenChange={setIsRightSidebarSheetOpen}
          >
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="fixed right-4 top-24 z-40 h-10 w-10 rounded-full bg-white shadow hover:bg-slate-100"
                aria-label="Open right sidebar"
              >
                <PanelRightOpen className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[360px] max-w-[92vw] p-0 pt-8"
            >
              <Notificationbar />
            </SheetContent>
          </Sheet>
        )}
      </div>

      {shouldShowRightSidebar && isXlUp && (
        <aside
          className={
            "relative transition-[width] duration-300 overflow-visible" +
            (isRightSidebarOpen ? " border-l border-slate-200" : "")
          }
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute -left-4 top-8 h-8 w-8 rounded-full bg-white hover:bg-slate-100 shadow"
            aria-label="Toggle sidebar"
            aria-expanded={isRightSidebarOpen}
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          >
            {isRightSidebarOpen ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          <div
            className={
              "pt-8 transition-opacity duration-200 " +
              (isRightSidebarOpen
                ? "opacity-100"
                : "opacity-0 pointer-events-none")
            }
          >
            <Notificationbar />
          </div>
        </aside>
      )}
    </main>
  );
}

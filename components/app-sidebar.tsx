"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Bookmark, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center px-4 py-2">
          <Link
            href="/"
            className="flex  items-center gap-1 align-middle justify-center"
          >
            <div className="w-10 ">
              <Image
                src="/images/EAIIcon-only.png"
                width={200}
                height={200}
                alt="logo"
              />
            </div>
            <div className="w-12">
              <Image
                src="/images/EAIwords.png"
                width={200}
                height={200}
                alt="logo"
              />
            </div>
            {/* <span className="text-xl font-semibold">Asendio</span> */}
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-4 py-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            asChild
          >
            <Link href="#">
              <PlusCircle className="w-4 h-4" />
              New conversation
            </Link>
          </Button>
        </div>
        <div className="px-4 py-2 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            asChild
          >
            <Link href="#">
              <Bookmark className="w-4 h-4" />
              Saved
            </Link>
          </Button>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 border-t">
          <Button
            className="w-full bg-[#0364E0] hover:bg-[#2373dc] text-white"
            size="lg"
          >
            Log in
          </Button>
          <p className="mt-4 text-xs text-center text-muted-foreground">
            Log in to save your conversation history.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

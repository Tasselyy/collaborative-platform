"use client";
import { AppSidebar } from '@/components/app-sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1" />
                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="flex items-center text-gray-600 hover:text-black text-sm"
                                >
                                    <ArrowLeft className="w-5 h-5 mr-1" />
                                </button>
                                <Separator
                                    orientation="vertical"
                                    className="mr-2 h-4"
                                />
                            </div>
                        </header>
                    </SidebarInset>
                </SidebarProvider>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                {children}
            </div>
        </div>
    );
}

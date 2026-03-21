import React from "react";
import NewBlogPageClient from "./client-page";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Admin | Create Blog",
};

export default async function NewBlogPage() {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN" && session.role !== "MENTOR")) {
        redirect("/login");
    }

    return <NewBlogPageClient />;
}

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | Keysprint",
    description: "View your typing stats, recent games, and track your progress on Keysprint.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Help & Support | Keysprint",
    description: "Get help with Keysprint, learn how to play, and find answers to common questions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

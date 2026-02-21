import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Keysprint",
    description: "Log in to your Keysprint account to track your typing progress.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

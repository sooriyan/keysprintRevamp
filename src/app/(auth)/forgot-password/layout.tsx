import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forgot Password | Keysprint",
    description: "Reset your Keysprint account password.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

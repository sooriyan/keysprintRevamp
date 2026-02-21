import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reset Password | Keysprint",
    description: "Set a new password for your Keysprint account.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

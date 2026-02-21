import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Profile | Keysprint",
    description: "Update your Keysprint profile, change your username, and manage your account.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

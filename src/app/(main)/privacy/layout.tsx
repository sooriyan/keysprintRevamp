import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Keysprint",
    description: "Read the Keysprint Privacy Policy to understand how we handle your data.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

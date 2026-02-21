import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Keysprint",
    description: "Read the Keysprint Terms of Service before using our platform.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

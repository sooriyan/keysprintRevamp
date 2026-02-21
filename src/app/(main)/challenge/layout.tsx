import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Typing Challenges | Keysprint",
    description: "Choose a typing protocol: Standard, Paragraph, Developer, or the Daily Challenge.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

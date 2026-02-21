import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Leaderboard | Keysprint",
    description: "Check the top typists on Keysprint and see where you rank.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

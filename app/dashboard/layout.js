

import AppLayout from "@/components/Layout/AppLayout";

export const metadata = {
	title: "Dashboard - Reading Journal",
	description: "Your personal reading journal",
	icons: {
		// icon: "/favicon.ico",
	},
};

export default function DashboardLayout({ children }) {
	return (
		<AppLayout>
          {children}
        </AppLayout>
	);
}

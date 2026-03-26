

import AppLayout from "@/components/Layout/AppLayout";

export const metadata = {
	title: "Library - Reading Journal",
	description: "Your personal reading journal",
	icons: {
		// icon: "/favicon.ico",
	},
};

export default function LibraryLayout({ children }) {
	return (
		<AppLayout>
          {children}
        </AppLayout>
	);
}

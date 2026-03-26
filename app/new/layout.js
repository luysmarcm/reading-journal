

import AppLayout from "@/components/Layout/AppLayout";

export const metadata = {
	title: "New Book - Reading Journal",
	description: "Your personal reading journal",
	icons: {
		// icon: "/favicon.ico",
	},
};

export default function NewBookLayout({ children }) {
	return (
		<AppLayout>
          {children}
        </AppLayout>
	);
}

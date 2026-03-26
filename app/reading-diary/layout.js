

import AppLayout from "@/components/Layout/AppLayout";

export const metadata = {
	title: "Reading Diary - Reading Journal",
	description: "Your personal reading journal",
	icons: {
		// icon: "/favicon.ico",
	},
};

export default function ReadingDiaryLayout({ children }) {
	return (
		<AppLayout>
          {children}
        </AppLayout>
	);
}

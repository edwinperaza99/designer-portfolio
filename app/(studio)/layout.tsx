import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSettings } from "@/sanity/queries";
import "@/app/globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
	const settings = await getSettings();

	if (!settings) {
		console.warn(
			"Warning: No settings document found. Returning fallback metadata."
		);
		return {
			title: "My Site",
			description: "",
		};
	}

	const title = settings.siteTitle ?? "My Site";
	const description = settings.siteDescription ?? "";
	const applicationName = settings.applicationName;
	const authors = settings.authors ?? [];
	const creator = settings.creator;
	const publisher = settings.publisher;
	const keywords = settings.defaultKeywords ?? [];

	let openGraph;
	if (settings.openGraphImages?.length) {
		openGraph = {
			title,
			description,
			url: settings.openGraphUrl ?? undefined,
			type: "website" as const,
			locale: settings.openGraphLocale,
			siteName: settings.openGraphSiteName,
			images: settings.openGraphImages.map((img) => ({
				url: img.asset.url,
				width: 1200,
				height: 630,
				alt: img.alt,
			})),
		};
	}

	let twitter;
	if (settings.twitterImages?.length) {
		twitter = {
			card:
				(settings.twitterCard as
					| "summary_large_image"
					| "summary"
					| "player"
					| "app") ?? "summary_large_image",
			title,
			description,
			images: settings.twitterImages.map(
				(img: { asset: { url: string }; alt?: string }) => ({
					url: img.asset.url,
					alt: img.alt || "Default alt text",
				})
			),
		};
	}

	return {
		title: { default: title, template: `%s | ${title}` },
		description,
		...(applicationName && { applicationName }),
		...(authors.length > 0 && { authors }),
		...(creator && { creator }),
		...(publisher && { publisher }),
		keywords,
		...(openGraph && { openGraph }),
		...(twitter && { twitter }),
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased `}
			>
				{children}
			</body>
		</html>
	);
}

import { Toaster } from "react-hot-toast";
import "./globals.css";
export const metadata = {
  title: "ProjectPulse",
  description: "Project Health Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        {children}
                <Toaster position="top-right" />

      </body>
    </html>
  );
}

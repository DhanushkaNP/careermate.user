import "@/styles/global.css";
import ReduxProvider from "./redux/Provider";
export const metadata = {
  title: "CareerMate-Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-dark-bg font-default text-dark-dark-blue">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

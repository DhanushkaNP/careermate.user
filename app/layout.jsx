import "@/styles/global.css";
import ReduxProvider from "./redux/Provider";
export const metadata = {
  title: "CareerMate-user",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className=" bg-default-background font-default text-dark-dark-blue h-full">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

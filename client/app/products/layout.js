import Breadcrumb from "../components/Breadcrumb/breadcrumb";

export default function RootLayout({ children }) {
  return (
    <>
      <Breadcrumb />
      {children}
    </>
  );
}

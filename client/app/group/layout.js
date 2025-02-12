import Breadcrumb from "../components/Breadcrumb/breadcrumb.js";

export default function RootLayout({ children }) {
    return (
        <>
            <Breadcrumb />
            {children}
        </>
    );
}

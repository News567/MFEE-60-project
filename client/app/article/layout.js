import Breadcrumb from "../components/Breadcrumb/breadcrumb";
// import Sidebar from './components/sidebar';
import "./components/articleAside.css";
import "./components/articleList.css";
import "./components/article.css";
import "./components/articleCreate.css";

export const metadata = {
  title: "潛水 Blog",
  description: "分享潛水經驗與知識的部落格",
};

export default function ArticleLayout({ children }) {
  return (
    <>
      <Breadcrumb />
      {/* <Sidebar /> */}
      {children}
    </>
  );
}

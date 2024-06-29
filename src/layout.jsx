// layout.jsx
import { Outlet } from "react-router-dom";
import Header from './components/Header.jsx';

const Layout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer>フッター</footer>
    </div>
  );
};

export default Layout;

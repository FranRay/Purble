import FollowBar from "./layout/FollowBar";
import Sidebar from "./layout/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

// webapp layout
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-[#EEF5FF] relative z-1">
      <div className="container h-full mx-auto xl:px-30 lg:max-w-8xl">
        <div
          className="
                flex 
                flex-row 
                items-start
                justify-center 
                md:justify-start 
                h-full 
                px-1
                lg:px-0
                "
        >
          {/* display sidebar, page, and followbar */}
          <Sidebar />
          <div
            className="
            w-full
            min-h-screen
            "
          >
            {children}
          </div>
          <FollowBar />
        </div>
      </div>
    </div>
  );
};

export default Layout;

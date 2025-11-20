import PrincipalCardHome from "@/views/Cards/PrincipalCardHome";
import Footer from "@/views/Layouts/Footer";
import TopBar from "@/views/Layouts/TopBar";
import TopBarHome from "@/views/Layouts/TopBarHome";


export default function Home() {
  return (
    <div className="relative bg-[#ffffff] min-h-screen flex flex-col">
      <TopBarHome/>
      <PrincipalCardHome/>
      <Footer/>
    </div>
  );
};

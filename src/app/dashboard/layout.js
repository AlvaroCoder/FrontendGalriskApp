import { SimluacionProvider } from "@/context/SimulacionContext";
import Footer from "@/views/Layouts/Footer";
import TopBar from "@/views/Layouts/TopBar";
import React from "react";

export default function Layout({ children }) {
  return (
    <main className="">
      <SimluacionProvider>
        <TopBar />
          <section className="w-full min-h-screen ">{children}</section>
        <Footer />
      </SimluacionProvider>
    </main>
  );
}

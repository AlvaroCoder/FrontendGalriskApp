"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Sparkles, Home, User, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSession } from "@/authentication/lib";
import ButtonUser from "@/elements/Buttons/ButtonUser";

export default function TopBarHome() {
  const router = useRouter();
  const [dataUser, setDataUser] = useState(null);

  useEffect(() => {
    async function fetchDataSession() {
      const session = await getSession();
      setDataUser(session);
    }
    fetchDataSession();
  }, []);
  return (
    <div
      className="
      fixed 
      top-6 
      left-1/2 
      transform 
      -translate-x-1/2 
      z-50 
      w-[95%] 
      max-w-4xl
      rounded-2xl 
      p-4 
      flex 
      flex-row 
      items-center 
      justify-between 
      bg-white/90 
      backdrop-blur-md 
      shadow-lg 
      border 
      border-white/20
      hover:shadow-3xl
      transition-all 
      duration-300
    "
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-intense to-orange-400">
          <Sparkles className="w-5 h-5 text-nigth-blue" />
        </div>
        <h1 className="text-xl font-bold text-nigth-blue tracking-tight">
          Gallrisk
        </h1>
      </div>

      <section className="flex items-center gap-8">
        <Link
          href={"/"}
          className="
            flex 
            items-center 
            gap-2 
            text-nigth-blue 
            font-medium 
            hover:text-yellow-intense 
            transition-all 
            duration-200 
            group
          "
        >
          <Home className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span className="relative">
            Inicio
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-intense transition-all duration-200 group-hover:w-full"></span>
          </span>
        </Link>

        <Link
          href={"/about"}
          className="
            flex 
            items-center 
            gap-2 
            text-nigth-blue 
            font-medium 
            hover:text-yellow-intense 
            transition-all 
            duration-200 
            group
          "
        >
          <User className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span className="relative">
            Acerca
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-intense transition-all duration-200 group-hover:w-full"></span>
          </span>
        </Link>
      </section>

      <section>
        {dataUser ? (
          <ButtonUser username={dataUser?.username} />
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="
          relative
          bg-gradient-to-r 
          from-yellow-intense 
          to-orange-400 
          text-nigth-blue 
          px-6 
          py-3 
          rounded-xl 
          font-bold 
          transition-all 
          duration-300 
          hover:shadow-lg 
          hover:scale-105 
          active:scale-95
          flex 
          items-center 
          gap-2
          group
          overflow-hidden
          cursor-pointer
        "
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />

            <LogIn className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Iniciar</span>

            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-intense to-orange-400 opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500" />
            </div>
          </button>
        )}
      </section>
    </div>
  );
}

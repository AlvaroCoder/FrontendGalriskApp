'use client'
import { ChevronRight, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function ButtonUser({
  username = "Usuario"
}) {
  const router = useRouter();
  
  return (
      <button
        onClick={()=>router.push("/dashboard/profile")}
        className='
        hidden
        md:flex
        items-center 
        gap-2 
        px-6
        py-3
        rounded-xl
        bg-gradient-to-r
        from-white
        to-yellow-intense
        text-nigth-blue
        font-bold
        cursor-pointer
      '>
        <User className='w-3 h-3' />
        <span>{username}</span>
      </button>
  );
}
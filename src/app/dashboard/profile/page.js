'use client';
import { getSession } from '@/authentication/lib';
import UserProfile from '@/elements/Card/UserProfile'
import { getDataProfileByIdUser } from '@/lib/apiConnection';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [dataUser, setDataUser] = useState(null);

  useEffect(() => {
    async function getDataUser() {
      const session = await getSession();
      const data = await getDataProfileByIdUser(session?.id);

      const dataJSON = await data.json();
      console.log(dataJSON);
      
      setDataUser(dataJSON);
      
    }
    getDataUser();

  },[])
  return (
    <div>
      <UserProfile
        userData={dataUser}
      />
    </div>
  )
};

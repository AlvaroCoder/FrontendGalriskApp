"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey=process.env.SECRET_KEY;
const URL_REGISTER_USER = process.env.NEXT_PUBLIC_URL_SIGNUP;
const URL_LOGIN_USER = process.env.NEXT_PUBLIC_URL_LOGIN;

const key=new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
    return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(key);
}

export async function decrypt(input){
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
}

export async function login(dataUser) {
    const formData = dataUser;
  
    const response = await fetch(URL_LOGIN_USER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      mode : 'cors'
    });
  
    if (!response.ok) {
      const rpta = await response.json();
      return {
        error: true,
        message: rpta,
      };
    }
  
    const responseJson = await response.json();    
    const { id, value } = responseJson;

    const session = await encrypt(value);    
    (await cookies()).set("dashboard-session", session, {
      httpOnly: true,
    });
  
    return {
      error: false,
      message: "Ingreso exitoso",
      tokenData: value, 
    };
  }

export async function logout() {
    cookies().set("dashboard-session", "", {expires:new Date(0)})
    redirect('/login');
}

export async function getSession() {
    const session = (await cookies()).get("dashboard-session")?.value;
    if(!session) return null;
    return await decrypt(session);
}

export async function signUp(dataUser) {
    const response = await fetch(URL_REGISTER_USER,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(dataUser)
    });
    if (!response.ok) {
        const resp = await response.json();
        console.log(resp);
        
        return {
            error : true,
            message : resp?.error
        }
    };

    const {id, username, email} = await response.json();
    const user = {
        id,
        username, 
        email
    };
    
    const session = await encrypt(user);
    (await cookies()).set("dashboard-session", session, { httpOnly : true });
    
    return {
        error : false,
        message : "Ingreso exitoso"
    }
}
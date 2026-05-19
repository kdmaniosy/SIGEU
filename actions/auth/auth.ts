"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    name: formData.get("name") as string,
    lastName: formData.get("lastName") as string,
    rol: Number(formData.get("rol") as string),
    code: Number(formData.get("code") as string),
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  console.log("DATA:", data);

  /* Podemos implemetar luego la autenticación 
  
  ---- Signup Auth ----
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  console.log("AUTH DATA:", authData)
  console.log("AUTH ERROR:", authError)
  */

  // ---- Insert en tabla user----
  const { error: insertError } = await supabase.from("user").insert({
    code: data.code,
    user_type_id: data.rol,
    first_name: data.name,
    last_name: data.lastName,
    email: data.email,
  });

  console.log("INSERT ERROR:", insertError);

  if (insertError) {
    console.log(insertError);
    throw new Error(insertError.message);
  }

  revalidatePath("/", "layout");
  redirect("/page"); 
}

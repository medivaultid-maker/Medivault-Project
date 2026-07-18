"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const finishLogin = async () => {
        console.log("=== CALLBACK BERJALAN ===");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("USER:", user);

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", user.id)
        .maybeSingle();
console.log("PROFILE:", profile);

      if (!profile) {
        console.log("AKAN INSERT");
        const { error: insertError } = await supabase
  .from("profiles")
  .insert({
  id: user.id,
  full_name:
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "",
  Email: user.email,
  university: "",
  batch: "",
  role: "user",
  token: 0,
});

if (insertError) {
  console.error(insertError);
  alert(insertError.message);
  return;
}
console.log("INSERT BERHASIL");
        router.replace("/dashboard");
        return;
      }

      if (profile.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    };

    finishLogin();
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 24,
      }}
    >
      Sedang masuk...
    </div>
  );
}
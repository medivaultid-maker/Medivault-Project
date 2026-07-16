import { supabase } from "./supabase";

/* ==========================
   PROFILE
========================== */

export async function getUserToken(userId: string) {
  return await supabase
    .from("profiles")
    .select("token")
    .eq("id", userId)
    .single();
}

export async function updateUserToken(
  userId: string,
  token: number
) {
  return await supabase
    .from("profiles")
    .update({ token })
    .eq("id", userId);
}

/* ==========================
   PACKAGE
========================== */

export async function getPackages() {
  return await supabase
    .from("exam_packages")
    .select("*")
    .eq("status", "published");
}

/* ==========================
   QUESTIONS
========================== */

export async function getQuestions(packageId: string) {
  return await supabase
    .from("questions")
    .select("*")
    .eq("package_id", packageId)
    .order("order_no");
}

/* ==========================
   ATTEMPT
========================== */

export async function createAttempt(
  userId: string,
  packageId: string
) {
  return await supabase
    .from("exam_attempts")
    .insert({
      user_id: userId,
      package_id: packageId,
      score: 0,
      status: "ongoing",
    })
    .select()
    .single();
}

export async function getHistory(userId: string) {
  return await supabase
    .from("exam_attempts")
    .select(`
      id,
      package_id,
      score,
      status,
      created_at,
      exam_packages (
        title,
        category
      )
    `)
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });
}

/* ==========================
   SESSION
========================== */

export async function getActiveSession(
  userId: string,
  packageId: string
) {
  return await supabase
    .from("exam_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("package_id", packageId)
    .eq("finished", false)
    .maybeSingle();
}

export async function createSession(
  userId: string,
  packageId: string,
  attemptId: string,
  duration: number
) {
  return await supabase
    .from("exam_sessions")
    .insert({
      user_id: userId,
      package_id: packageId,
      attempt_id: attemptId,
      duration,
      finished: false,
    });
}

export async function finishSession(
  attemptId: string
) {
  return await supabase
    .from("exam_sessions")
    .update({
      finished: true,
    })
    .eq("attempt_id", attemptId);
}

export async function startExam(
  item: any,
  setToken: (token: number) => void
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Silakan login.");
    return;
  }

  const { data: profile } = await getUserToken(user.id);

  if (!profile) {
    alert("Profil tidak ditemukan.");
    return;
  }

  const { data: activeSession } = await getActiveSession(
    user.id,
    item.id
  );

  if (activeSession) {
    localStorage.setItem(
      "medivault_attempt_id",
      activeSession.attempt_id
    );

    window.location.href = `/ujian/${item.id}`;
    return;
  }

  if (profile.token < item.tokenCost) {
    alert("Token tidak cukup.");
    return;
  }

  const { data: attempt, error } =
    await createAttempt(user.id, item.id);

  if (error || !attempt) {
    alert("Gagal membuat attempt.");
    return;
  }

  localStorage.setItem(
    "medivault_attempt_id",
    attempt.id
  );

 await createSession(
  user.id,
  item.id,
  attempt.id,
  item.duration
);

  await updateUserToken(
    user.id,
    profile.token - item.tokenCost
  );

  setToken(profile.token - item.tokenCost);

  const { data: questions } =
    await getQuestions(item.id);

  localStorage.setItem(
    "medivault_selected_package",
    JSON.stringify({
      ...item,
      questions,
    })
  );

  window.location.href = `/ujian/${item.id}`;
}
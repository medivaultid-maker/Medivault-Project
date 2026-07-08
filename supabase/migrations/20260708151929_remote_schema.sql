drop extension if exists "pg_net";


  create table "public"."attempt_answers" (
    "id" uuid not null default gen_random_uuid(),
    "attempt_id" uuid not null,
    "question_id" uuid not null,
    "selected_answer" integer,
    "is_correct" boolean,
    "is_doubt" boolean default false,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."attempt_answers" enable row level security;


  create table "public"."exam_attempts" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "package_id" uuid not null,
    "score" integer default 0,
    "passing_grade" integer default 70,
    "correct_count" integer default 0,
    "wrong_count" integer default 0,
    "unanswered_count" integer default 0,
    "doubt_count" integer default 0,
    "total_questions" integer default 0,
    "duration" integer default 0,
    "status" text default 'Belum Lulus'::text,
    "created_at" timestamp with time zone default now(),
    "started_at" timestamp with time zone default now(),
    "finished_at" timestamp with time zone,
    "answers" jsonb
      );


alter table "public"."exam_attempts" enable row level security;


  create table "public"."exam_packages" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "category" text not null,
    "total_questions" integer default 0,
    "duration" integer default 0,
    "token_cost" integer default 0,
    "status" text default 'draft'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."exam_packages" enable row level security;


  create table "public"."exam_results" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "package_id" uuid,
    "score" integer default 0,
    "correct" integer default 0,
    "wrong" integer default 0,
    "duration" integer default 0,
    "answers" jsonb,
    "status" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."exam_results" enable row level security;


  create table "public"."exam_sessions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "package_id" uuid,
    "started_at" timestamp with time zone default now(),
    "expires_at" timestamp with time zone,
    "finished" boolean default false,
    "attempt_id" uuid,
    "duration" integer
      );


alter table "public"."exam_sessions" enable row level security;


  create table "public"."payment_requests" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "package_name" text not null,
    "token" integer not null,
    "amount" integer not null,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone default now(),
    "approved_at" timestamp with time zone,
    "approved_by" uuid
      );


alter table "public"."payment_requests" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "full_name" text not null,
    "university" text,
    "batch" text,
    "created_at" timestamp with time zone default now(),
    "role" text default 'user'::text,
    "token" integer default 0
      );


alter table "public"."profiles" enable row level security;


  create table "public"."questions" (
    "id" uuid not null default gen_random_uuid(),
    "package_id" uuid,
    "question" text,
    "image" text,
    "options" jsonb,
    "answer" integer,
    "essay_answer" text,
    "discussion" text,
    "discussion_image" text,
    "created_at" timestamp with time zone default now(),
    "order_index" integer default 0,
    "order_no" integer default 0
      );


CREATE UNIQUE INDEX attempt_answers_pkey ON public.attempt_answers USING btree (id);

CREATE UNIQUE INDEX exam_attempts_pkey ON public.exam_attempts USING btree (id);

CREATE UNIQUE INDEX exam_packages_pkey ON public.exam_packages USING btree (id);

CREATE UNIQUE INDEX exam_results_pkey ON public.exam_results USING btree (id);

CREATE UNIQUE INDEX exam_sessions_pkey ON public.exam_sessions USING btree (id);

CREATE INDEX idx_exam_attempts_package ON public.exam_attempts USING btree (package_id);

CREATE INDEX idx_exam_attempts_user ON public.exam_attempts USING btree (user_id);

CREATE UNIQUE INDEX payment_requests_pkey ON public.payment_requests USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX questions_pkey ON public.questions USING btree (id);

alter table "public"."attempt_answers" add constraint "attempt_answers_pkey" PRIMARY KEY using index "attempt_answers_pkey";

alter table "public"."exam_attempts" add constraint "exam_attempts_pkey" PRIMARY KEY using index "exam_attempts_pkey";

alter table "public"."exam_packages" add constraint "exam_packages_pkey" PRIMARY KEY using index "exam_packages_pkey";

alter table "public"."exam_results" add constraint "exam_results_pkey" PRIMARY KEY using index "exam_results_pkey";

alter table "public"."exam_sessions" add constraint "exam_sessions_pkey" PRIMARY KEY using index "exam_sessions_pkey";

alter table "public"."payment_requests" add constraint "payment_requests_pkey" PRIMARY KEY using index "payment_requests_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."questions" add constraint "questions_pkey" PRIMARY KEY using index "questions_pkey";

alter table "public"."attempt_answers" add constraint "attempt_answers_attempt_id_fkey" FOREIGN KEY (attempt_id) REFERENCES public.exam_attempts(id) ON DELETE CASCADE not valid;

alter table "public"."attempt_answers" validate constraint "attempt_answers_attempt_id_fkey";

alter table "public"."attempt_answers" add constraint "attempt_answers_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE not valid;

alter table "public"."attempt_answers" validate constraint "attempt_answers_question_id_fkey";

alter table "public"."exam_attempts" add constraint "exam_attempts_package_id_fkey" FOREIGN KEY (package_id) REFERENCES public.exam_packages(id) ON DELETE CASCADE not valid;

alter table "public"."exam_attempts" validate constraint "exam_attempts_package_id_fkey";

alter table "public"."exam_attempts" add constraint "exam_attempts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."exam_attempts" validate constraint "exam_attempts_user_id_fkey";

alter table "public"."exam_sessions" add constraint "exam_sessions_attempt_id_fkey" FOREIGN KEY (attempt_id) REFERENCES public.exam_attempts(id) not valid;

alter table "public"."exam_sessions" validate constraint "exam_sessions_attempt_id_fkey";

alter table "public"."exam_sessions" add constraint "exam_sessions_package_id_fkey" FOREIGN KEY (package_id) REFERENCES public.exam_packages(id) ON DELETE CASCADE not valid;

alter table "public"."exam_sessions" validate constraint "exam_sessions_package_id_fkey";

alter table "public"."exam_sessions" add constraint "exam_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."exam_sessions" validate constraint "exam_sessions_user_id_fkey";

alter table "public"."payment_requests" add constraint "payment_requests_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public.profiles(id) not valid;

alter table "public"."payment_requests" validate constraint "payment_requests_approved_by_fkey";

alter table "public"."payment_requests" add constraint "payment_requests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."payment_requests" validate constraint "payment_requests_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."questions" add constraint "questions_package_id_fkey" FOREIGN KEY (package_id) REFERENCES public.exam_packages(id) ON DELETE CASCADE not valid;

alter table "public"."questions" validate constraint "questions_package_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.approve_payment(payment_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
    p record;
begin
    -- ambil data payment
    select *
    into p
    from payment_requests
    where id = payment_id;

    if not found then
        raise exception 'Payment tidak ditemukan';
    end if;

    -- tambah token user
    update profiles
    set token = token + p.token
    where id = p.user_id;

    -- ubah status pembayaran
    update payment_requests
    set status = 'approved'
    where id = payment_id;
end;
$function$
;

grant delete on table "public"."attempt_answers" to "anon";

grant insert on table "public"."attempt_answers" to "anon";

grant references on table "public"."attempt_answers" to "anon";

grant select on table "public"."attempt_answers" to "anon";

grant trigger on table "public"."attempt_answers" to "anon";

grant truncate on table "public"."attempt_answers" to "anon";

grant update on table "public"."attempt_answers" to "anon";

grant delete on table "public"."attempt_answers" to "authenticated";

grant insert on table "public"."attempt_answers" to "authenticated";

grant references on table "public"."attempt_answers" to "authenticated";

grant select on table "public"."attempt_answers" to "authenticated";

grant trigger on table "public"."attempt_answers" to "authenticated";

grant truncate on table "public"."attempt_answers" to "authenticated";

grant update on table "public"."attempt_answers" to "authenticated";

grant delete on table "public"."attempt_answers" to "service_role";

grant insert on table "public"."attempt_answers" to "service_role";

grant references on table "public"."attempt_answers" to "service_role";

grant select on table "public"."attempt_answers" to "service_role";

grant trigger on table "public"."attempt_answers" to "service_role";

grant truncate on table "public"."attempt_answers" to "service_role";

grant update on table "public"."attempt_answers" to "service_role";

grant delete on table "public"."exam_attempts" to "anon";

grant insert on table "public"."exam_attempts" to "anon";

grant references on table "public"."exam_attempts" to "anon";

grant select on table "public"."exam_attempts" to "anon";

grant trigger on table "public"."exam_attempts" to "anon";

grant truncate on table "public"."exam_attempts" to "anon";

grant update on table "public"."exam_attempts" to "anon";

grant delete on table "public"."exam_attempts" to "authenticated";

grant insert on table "public"."exam_attempts" to "authenticated";

grant references on table "public"."exam_attempts" to "authenticated";

grant select on table "public"."exam_attempts" to "authenticated";

grant trigger on table "public"."exam_attempts" to "authenticated";

grant truncate on table "public"."exam_attempts" to "authenticated";

grant update on table "public"."exam_attempts" to "authenticated";

grant delete on table "public"."exam_attempts" to "service_role";

grant insert on table "public"."exam_attempts" to "service_role";

grant references on table "public"."exam_attempts" to "service_role";

grant select on table "public"."exam_attempts" to "service_role";

grant trigger on table "public"."exam_attempts" to "service_role";

grant truncate on table "public"."exam_attempts" to "service_role";

grant update on table "public"."exam_attempts" to "service_role";

grant delete on table "public"."exam_packages" to "anon";

grant insert on table "public"."exam_packages" to "anon";

grant references on table "public"."exam_packages" to "anon";

grant select on table "public"."exam_packages" to "anon";

grant trigger on table "public"."exam_packages" to "anon";

grant truncate on table "public"."exam_packages" to "anon";

grant update on table "public"."exam_packages" to "anon";

grant delete on table "public"."exam_packages" to "authenticated";

grant insert on table "public"."exam_packages" to "authenticated";

grant references on table "public"."exam_packages" to "authenticated";

grant select on table "public"."exam_packages" to "authenticated";

grant trigger on table "public"."exam_packages" to "authenticated";

grant truncate on table "public"."exam_packages" to "authenticated";

grant update on table "public"."exam_packages" to "authenticated";

grant delete on table "public"."exam_packages" to "service_role";

grant insert on table "public"."exam_packages" to "service_role";

grant references on table "public"."exam_packages" to "service_role";

grant select on table "public"."exam_packages" to "service_role";

grant trigger on table "public"."exam_packages" to "service_role";

grant truncate on table "public"."exam_packages" to "service_role";

grant update on table "public"."exam_packages" to "service_role";

grant delete on table "public"."exam_results" to "anon";

grant insert on table "public"."exam_results" to "anon";

grant references on table "public"."exam_results" to "anon";

grant select on table "public"."exam_results" to "anon";

grant trigger on table "public"."exam_results" to "anon";

grant truncate on table "public"."exam_results" to "anon";

grant update on table "public"."exam_results" to "anon";

grant delete on table "public"."exam_results" to "authenticated";

grant insert on table "public"."exam_results" to "authenticated";

grant references on table "public"."exam_results" to "authenticated";

grant select on table "public"."exam_results" to "authenticated";

grant trigger on table "public"."exam_results" to "authenticated";

grant truncate on table "public"."exam_results" to "authenticated";

grant update on table "public"."exam_results" to "authenticated";

grant delete on table "public"."exam_results" to "service_role";

grant insert on table "public"."exam_results" to "service_role";

grant references on table "public"."exam_results" to "service_role";

grant select on table "public"."exam_results" to "service_role";

grant trigger on table "public"."exam_results" to "service_role";

grant truncate on table "public"."exam_results" to "service_role";

grant update on table "public"."exam_results" to "service_role";

grant delete on table "public"."exam_sessions" to "anon";

grant insert on table "public"."exam_sessions" to "anon";

grant references on table "public"."exam_sessions" to "anon";

grant select on table "public"."exam_sessions" to "anon";

grant trigger on table "public"."exam_sessions" to "anon";

grant truncate on table "public"."exam_sessions" to "anon";

grant update on table "public"."exam_sessions" to "anon";

grant delete on table "public"."exam_sessions" to "authenticated";

grant insert on table "public"."exam_sessions" to "authenticated";

grant references on table "public"."exam_sessions" to "authenticated";

grant select on table "public"."exam_sessions" to "authenticated";

grant trigger on table "public"."exam_sessions" to "authenticated";

grant truncate on table "public"."exam_sessions" to "authenticated";

grant update on table "public"."exam_sessions" to "authenticated";

grant delete on table "public"."exam_sessions" to "service_role";

grant insert on table "public"."exam_sessions" to "service_role";

grant references on table "public"."exam_sessions" to "service_role";

grant select on table "public"."exam_sessions" to "service_role";

grant trigger on table "public"."exam_sessions" to "service_role";

grant truncate on table "public"."exam_sessions" to "service_role";

grant update on table "public"."exam_sessions" to "service_role";

grant delete on table "public"."payment_requests" to "anon";

grant insert on table "public"."payment_requests" to "anon";

grant references on table "public"."payment_requests" to "anon";

grant select on table "public"."payment_requests" to "anon";

grant trigger on table "public"."payment_requests" to "anon";

grant truncate on table "public"."payment_requests" to "anon";

grant update on table "public"."payment_requests" to "anon";

grant delete on table "public"."payment_requests" to "authenticated";

grant insert on table "public"."payment_requests" to "authenticated";

grant references on table "public"."payment_requests" to "authenticated";

grant select on table "public"."payment_requests" to "authenticated";

grant trigger on table "public"."payment_requests" to "authenticated";

grant truncate on table "public"."payment_requests" to "authenticated";

grant update on table "public"."payment_requests" to "authenticated";

grant delete on table "public"."payment_requests" to "service_role";

grant insert on table "public"."payment_requests" to "service_role";

grant references on table "public"."payment_requests" to "service_role";

grant select on table "public"."payment_requests" to "service_role";

grant trigger on table "public"."payment_requests" to "service_role";

grant truncate on table "public"."payment_requests" to "service_role";

grant update on table "public"."payment_requests" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."questions" to "anon";

grant insert on table "public"."questions" to "anon";

grant references on table "public"."questions" to "anon";

grant select on table "public"."questions" to "anon";

grant trigger on table "public"."questions" to "anon";

grant truncate on table "public"."questions" to "anon";

grant update on table "public"."questions" to "anon";

grant delete on table "public"."questions" to "authenticated";

grant insert on table "public"."questions" to "authenticated";

grant references on table "public"."questions" to "authenticated";

grant select on table "public"."questions" to "authenticated";

grant trigger on table "public"."questions" to "authenticated";

grant truncate on table "public"."questions" to "authenticated";

grant update on table "public"."questions" to "authenticated";

grant delete on table "public"."questions" to "service_role";

grant insert on table "public"."questions" to "service_role";

grant references on table "public"."questions" to "service_role";

grant select on table "public"."questions" to "service_role";

grant trigger on table "public"."questions" to "service_role";

grant truncate on table "public"."questions" to "service_role";

grant update on table "public"."questions" to "service_role";


  create policy "Users can insert own answers"
  on "public"."attempt_answers"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.exam_attempts
  WHERE ((exam_attempts.id = attempt_answers.attempt_id) AND (exam_attempts.user_id = auth.uid())))));



  create policy "Users can view own answers"
  on "public"."attempt_answers"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.exam_attempts
  WHERE ((exam_attempts.id = attempt_answers.attempt_id) AND (exam_attempts.user_id = auth.uid())))));



  create policy "Users can insert own attempts"
  on "public"."exam_attempts"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Users can update own attempts"
  on "public"."exam_attempts"
  as permissive
  for update
  to authenticated
using ((auth.uid() = user_id));



  create policy "Users can view own attempts"
  on "public"."exam_attempts"
  as permissive
  for select
  to authenticated
using ((auth.uid() = user_id));



  create policy "admin can delete exam_packages"
  on "public"."exam_packages"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "admin can insert exam_packages"
  on "public"."exam_packages"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "admin can update exam_packages"
  on "public"."exam_packages"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "authenticated can read exam_packages"
  on "public"."exam_packages"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can create their own exam sessions"
  on "public"."exam_sessions"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own exam sessions"
  on "public"."exam_sessions"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own exam sessions"
  on "public"."exam_sessions"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Admin full access payment"
  on "public"."payment_requests"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));



  create policy "User dapat melihat pembayaran sendiri"
  on "public"."payment_requests"
  as permissive
  for select
  to authenticated
using ((auth.uid() = user_id));



  create policy "User dapat membuat pembayaran"
  on "public"."payment_requests"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Users can insert their own profile"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = id));



  create policy "Users can update their own profile"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));



  create policy "Users can view their own profile"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((auth.uid() = id));



  create policy "Allow admin insert questions"
  on "public"."questions"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated select questions"
  on "public"."questions"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated users can read questions"
  on "public"."questions"
  as permissive
  for select
  to authenticated
using (true);




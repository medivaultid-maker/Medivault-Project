"use client";


import {useEffect,useState} from "react";
import Navbar from "../../components/Navbar";
import {supabase} from "../../lib/supabase";
import {generateAdminAnalytics} from "../../lib/adminAnalytics";


export default function AdminAnalytics(){


const [data,setData]=useState<any>(null);



useEffect(()=>{


async function load(){


const {
data:users
}=await supabase
.from("profiles")
.select("*");



const {
data:attempts
}=await supabase
.from("exam_attempts")
.select("*");



const {
data:answers
}=await supabase
.from("attempt_answers")
.select("*");



const result =
generateAdminAnalytics(
users || [],
attempts || [],
answers || []
);



setData(result);


}


load();


},[]);



if(!data){

return (

<div className="p-10">
Loading analytics...
</div>

)

}



return (

<main className="min-h-screen bg-slate-50">

<Navbar/>


<section className="p-10">


<h1 className="text-4xl font-extrabold text-[#061B3A]">

📊 Admin Analytics

</h1>


<div className="mt-8 grid gap-5 md:grid-cols-3">


<div className="rounded-3xl bg-white p-6 shadow">

<p className="text-slate-500">
Total User
</p>

<h2 className="text-4xl font-bold">
{data.totalUsers}
</h2>

</div>



<div className="rounded-3xl bg-white p-6 shadow">

<p className="text-slate-500">
Total Ujian
</p>

<h2 className="text-4xl font-bold">
{data.totalExam}
</h2>

</div>



<div className="rounded-3xl bg-white p-6 shadow">

<p className="text-slate-500">
Rata-rata Nilai
</p>

<h2 className="text-4xl font-bold">
{data.averageScore}
</h2>

</div>


</div>




<div className="mt-8 rounded-3xl bg-white p-6 shadow">


<h2 className="text-2xl font-bold">

❌ Soal Tersulit

</h2>


{

data.hardestQuestion ?

<p className="mt-3">

Soal ID:
{data.hardestQuestion.question_id}

<br/>

Jumlah salah:
{data.hardestQuestion.wrong}

kali

</p>

:

<p>
Belum ada data
</p>

}


</div>



</section>


</main>

)

}
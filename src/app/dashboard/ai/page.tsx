"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";
import { generateAIReport } from "../../lib/aiLearningReport";


export default function AIDashboardPage(){

const [report,setReport] = useState<any>(null);
const [loading,setLoading] = useState(true);


useEffect(()=>{

const loadAI = async()=>{


const {
data:{
user
}
}=await supabase.auth.getUser();


if(!user){
window.location.href="/login";
return;
}


const {
data
}=await supabase
.from("exam_attempts")
.select(`
topic_stats,
score,
created_at,
exam_packages(
title
)
`)
.eq("user_id",user.id)
.order("created_at",{ascending:false})
.limit(1)
.single();



if(data?.topic_stats){

const ai =
generateAIReport(
data.topic_stats
);


setReport(ai);

}


setLoading(false);

};


loadAI();


},[]);



if(loading){

return(
<main>
<Navbar/>

<div className="min-h-screen flex items-center justify-center">
Memuat AI Dashboard...
</div>

</main>
)

}



return(

<main className="min-h-screen bg-slate-50">

<Navbar/>


<section className="px-6 py-10">

<div className="mx-auto max-w-5xl">


<h1 className="text-3xl font-extrabold text-[#061B3A]">
🤖 AI Learning Dashboard
</h1>


<p className="mt-2 text-slate-500">
Analisis kemampuan berdasarkan hasil ujian terakhir kamu.
</p>



<div className="mt-8 rounded-3xl bg-white p-6 shadow">


<h2 className="text-xl font-bold text-emerald-600">
💪 Topik Terkuat
</h2>


{
report?.strongest?.map(
(item:any)=>(
<div
key={item.topic}
className="mt-4 rounded-xl bg-emerald-50 p-4"
>

<p className="font-bold">
{item.topic}
</p>

<p>
Skor {item.score}%
</p>

</div>
)
)
}



<h2 className="mt-8 text-xl font-bold text-red-600">
📚 Perlu Dipelajari
</h2>


{
report?.weakest?.map(
(item:any)=>(
<div
key={item.topic}
className="mt-4 rounded-xl bg-red-50 p-4"
>

<p className="font-bold">
{item.topic}
</p>

<p>
Skor {item.score}%
</p>

</div>
)
)
}



</div>



</div>

</section>


</main>

)

}
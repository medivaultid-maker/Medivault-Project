const recommendations:any = {

  "Neuroanatomi": [
    "Nervus cranialis",
    "Traktus sensorik dan motorik",
    "Vaskularisasi otak"
  ],

  "Histologi": [
    "Epitel jaringan",
    "Jaringan ikat",
    "Jaringan saraf"
  ],

  "Anatomi": [
    "Regio anatomi",
    "Hubungan antar struktur",
    "Vaskularisasi organ"
  ],

  "Muskuloskeletal": [
    "Otot utama",
    "Innervasi",
    "Perlekatan otot"
  ]

};


export function generateRecommendation(
 weakest:any[]
){

 if(!weakest || weakest.length===0){
  return [];
 }


 return weakest.map(item=>({

  topic:item.topic,

  score:item.score,

  materials:
    recommendations[item.topic]
    ||
    [
      "Review konsep dasar",
      "Latihan soal kembali",
      "Pelajari pembahasan"
    ]

 }));

}
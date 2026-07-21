export function generateAdminAnalytics(
  users:any[],
  attempts:any[],
  answers:any[]
){

  const totalUsers = users.length;


  const totalExam = attempts.length;


  const averageScore =
    attempts.length > 0
    ?
    Math.round(
      attempts.reduce(
        (sum,item)=>sum+item.score,
        0
      ) / attempts.length
    )
    :
    0;



  // =====================
  // SOAL TERSULIT
  // =====================

  const questionWrong:any = {};


  answers.forEach(item=>{

    if(item.is_correct === false){

      const id = item.question_id;

      questionWrong[id] =
      (questionWrong[id] || 0) + 1;

    }

  });



  let hardestQuestion = null;


  Object.entries(questionWrong)
  .forEach(([id,total]:any)=>{

    if(
      !hardestQuestion ||
      total > hardestQuestion.wrong
    ){

      hardestQuestion={
        question_id:id,
        wrong:total
      };

    }

  });



  return {

    totalUsers,

    totalExam,

    averageScore,

    hardestQuestion,

  };

}
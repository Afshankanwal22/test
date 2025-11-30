// ====== Supabase Config ======
const SUPABASE_URL = "https://jzorrdpsvtvoglvxhjfi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6b3JyZHBzdnR2b2dsdnhoamZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDA3MzMsImV4cCI6MjA3NjYxNjczM30.HOrkOrtH03AS-q9W-E0w7woDS2ESPDIVBaS64qzDpZw";
const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log(client);


// ====== show alert ======
function showThemeAlert(message, type = "success") {
  const colors = {
    success: "text-green-600 border-green-400",
    error: "text-red-600 border-red-400"
  };

  const alert = document.createElement("div");
  alert.className = `bg-white ${colors[type]} border px-4 py-2 rounded shadow-md fixed top-5 right-5 z-50 animate-slideIn`;
  alert.style.fontWeight = "500";
  alert.innerText = message;
  document.body.appendChild(alert);

  setTimeout(() => {
    alert.classList.add("animate-fadeOut");
    alert.addEventListener("animationend", () => alert.remove());
  }, 2000);
}



// ====== Signup Form ======
const signupForm = document.querySelector("#signupForm");
signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector("#signupName").value;
  const email = document.querySelector("#signupEmail").value;
  const password = document.querySelector("#signupPassword").value;
  const confirm = document.querySelector("#signupConfirm").value;

  if (password !== confirm) {
    showThemeAlert("Passwords do not match!", "error");
    return;
  }

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } }
  });

  if (error) {
    showThemeAlert(error.message, "error");
  } else {
    showThemeAlert(`Signup successful! Welcome, ${name}`, "success");
    setTimeout(() => { window.location.href = "login.html"; }, 1500);
  }
});

// Admin emails
  const adminEmails = ["kanwalafshan2244@gmail.com"];

  // Login form
  const loginForm = document.getElementById("loginForm");
   loginForm && loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("password").value;

    if(!email || !password){
      showThemeAlert("Enter both email and password", "error");
      return;
    }

    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if(error){
      showThemeAlert(error.message, "error");
    } else {
      if(adminEmails.includes(email)){
        showThemeAlert("Welcome Admin!", "success");
        setTimeout(()=>{ window.location.href = "dashboard.html"; }, 1500);
      } else {
        showThemeAlert("Welcome!", "success");
        setTimeout(()=>{ window.location.href = "user.html"; }, 1500);
      }
    }
  });

// ====== Add Question Form ======

 document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.getElementById("saveBtn");
    
    saveBtn && saveBtn.addEventListener("click", async () => {
        const type = document.getElementById("qType").value;
        const failMessage = document.getElementById("failMessage").value;

        let question = { qType: type, failMessage };

        if(type === "multiple") {
            question.qText = document.getElementById("mq").value;
            question.A = document.getElementById("ma").value;
            question.B = document.getElementById("mb").value;
            question.C = document.getElementById("mc").value;
            question.D = document.getElementById("md").value;
            question.correct = document.getElementById("mcorrect").value;
        } else if(type === "tf") {
            question.qText = document.getElementById("tfq").value;
            question.correct = document.getElementById("tfCorrect").value;
        } else if(type === "data") {
            question.qText = document.getElementById("dq").value;
            question.correct = null;
        } else {
            Swal.fire({ icon: "error", title: "Error", text: "Select a question type!" });
            return;
        }

        if(!question.qText) {
            Swal.fire({ icon: "error", title: "Error", text: "Enter question text!" });
            return;
        }

        const { data, error } = await client.from('admin').insert([question]);

        if(error) {
            Swal.fire({ icon: "error", title: "Error", text: error.message });
        } else {
            Swal.fire({ icon: "success", title: "Saved!", text: "Question added successfully!", timer: 1500, showConfirmButton: false });
            clearForm();
        }
    });

    function clearForm() {
        document.getElementById("mq").value = "";
        document.getElementById("ma").value = "";
        document.getElementById("mb").value = "";
        document.getElementById("mc").value = "";
        document.getElementById("md").value = "";
        document.getElementById("mcorrect").value = "A";

        document.getElementById("tfq").value = "";
        document.getElementById("tfCorrect").value = "True";

        document.getElementById("dq").value = "";
        document.getElementById("failMessage").value = "";

        document.getElementById("qType").value = "";
        document.getElementById("multipleForm").classList.add("hidden");
        document.getElementById("tfForm").classList.add("hidden");
        document.getElementById("dataForm").classList.add("hidden");
    }
});

// // DOM

// const questionsBox = document.getElementById("questionsBox");
// const submitBtn = document.getElementById("submitBtn");

// // ====== Fetch and Render Questions ======
// async function loadQuestions() {
//   const { data, error } = await client.from('admin').select('*');

//   if(error){
//     Swal.fire({ icon: "error", text: error.message });
//     return;
//   }

//   data.forEach((q, index) => {
//     let html = `<div class="bg-white shadow-lg rounded-xl p-6 mb-4">
//                   <p class="font-semibold mb-2">${index+1}. ${q.qText}</p>`;

//     if(q.qType === "multiple") {
//       html += ['A','B','C','D'].map(opt => `
//         <label class="flex items-center p-2 border rounded-lg cursor-pointer mb-1 hover:bg-blue-50">
//           <input type="radio" name="q${index}" value="${opt}" class="form-radio h-5 w-5 text-blue-600 mr-2">
//           ${q[opt]}
//         </label>
//       `).join('');
//     } else if(q.qType === "tf") {
//       html += ['True','False'].map(opt => `
//         <label class="flex items-center p-2 border rounded-lg cursor-pointer mb-1 hover:bg-blue-50">
//           <input type="radio" name="q${index}" value="${opt}" class="form-radio h-5 w-5 text-blue-600 mr-2">
//           ${opt}
//         </label>
//       `).join('');
//     } else if(q.qType === "data") {
//       html += `<p class="text-gray-500 italic">*This is an informational question.</p>`;
//     }

//     html += `<textarea placeholder="Add your comment (optional)" class="w-full p-2 border rounded mt-2" id="comment${index}"></textarea>`;
//     html += `</div>`;

//     questionsBox && (questionsBox.innerHTML += html);
//   });
// }

// // ====== Submit Answers ======
// submitBtn&& submitBtn.addEventListener("click", () => {
//   let score = 0;

//   questionsBox.querySelectorAll('div').forEach((qDiv, index) => {
//     const qType = ['multiple', 'tf', 'data'][0]; 
//     const questionData = questionsBox.dataset; 
//     const selected = qDiv.querySelector(`input[name="q${index}"]:checked`);
//     const comment = qDiv.querySelector(`#comment${index}`).value;

//     if(selected){
//       const answer = selected.value;
//       const correct = questions[index].correct;

//       if(answer === correct){
//         score++;
//         Swal.fire({ icon:'success', text:`Q${index+1}: Correct!` });
//       } else {
//         Swal.fire({ icon:'error', text:`Q${index+1}: Wrong! ${questions[index].failMessage || ''}` });
//       }
//     }
//   });
// });

// // ====== Initialize ======
// let questions = [];
// document.addEventListener('DOMContentLoaded', async () => {
//   const { data, error } = await client.from('admin').select('*');
//   if(error) return Swal.fire({ icon:'error', text:error.message });
//   questions = data;
//   loadQuestions();
// });


// ADMIN REPORT
const adminReport=document.getElementById("tabAdminReport")
adminReport && adminReport.addEventListener("click", async () => {
    window.location.href = "admin.html";
// Load Admin Report Automatically
    loadAdminReport();
})

   // ====== Fetch and Render Admin Report ======
// ====== Load Admin Responses as Responsive Cards ======
async function loadAdminReport() {
    const box = document.getElementById("adminReport");

    // Wrap in responsive grid
    box.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="cardsGrid"></div>`;
    const grid = document.getElementById("cardsGrid");

    // Fetch all responses
    const { data, error } = await client
        .from("response")
        .select(`
            id,
            user_email,
            user_id,
            answer,
            comment,
            is_correct,
            created_at,
            question:question_id (qText)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        grid.innerHTML = `<p class="text-red-500 col-span-full text-center">Error: ${error.message}</p>`;
        return;
    }

    if (!data || data.length === 0) {
        grid.innerHTML = "<p class='text-gray-500 col-span-full text-center'>No responses found.</p>";
        return;
    }

    // Render each response as a card
    data.forEach((r) => {
        const card = document.createElement("div");
        card.className = "bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300";

        card.innerHTML = `
            <div id="response-${r.id}" class="space-y-2">
                <p id="userEmail-${r.id}" class="font-semibold text-purple-700 text-sm truncate">📩 ${r.user_email}</p>
                <p id="question-${r.id}" class="text-gray-800 font-medium"><b>Question:</b> ${r.question?.qText || "N/A"}</p>
                <p id="answer-${r.id}" class="text-gray-700"><b>Answer:</b> ${r.answer}</p>
                <p id="correct-${r.id}" class="">
                    <b>Status:</b> 
                    <span class="${r.is_correct ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}">
                        ${r.is_correct ? "✔ Correct" : "✘ Incorrect"}
                    </span>
                </p>
                <p id="comment-${r.id}" class="text-gray-600"><b>Comment:</b> ${r.comment || "No comments"}</p>
                <p id="submitted-${r.id}" class="text-xs text-gray-400 mt-1">Submitted: ${new Date(r.created_at).toLocaleString()}</p>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Auto load on page open
document.addEventListener("DOMContentLoaded", loadAdminReport);

// // ====== Submit Quiz Answers ======
// const submitBtns= document.getElementById("submitBtns");
// const resultBox = document.getElementById("resultBox");

// submitBtns&&submitBtns.addEventListener("click", async () => {
//   let correctCount = 0;
//   let wrongCount = 0;

//   // Get current user
//   const { data: userData } = await client.auth.getUser();
//   if(!userData.user){
//     Swal.fire("Please login first!", "", "error");
//     return;
//   }
//   const email = userData.user.email;
//   const user_id = userData.user.id;

//   let responses = [];

// questions.forEach((q, index) => {
//   const selected = document.querySelector(`input[name="q${index}"]:checked`);
//   const answer = selected ? selected.value : null;
//   const is_correct = answer === q.correct;

//   responses.push({
//     user_email: email,
//     user_id: user_id,
//     question_id: q.id,
//     answer,
//     is_correct,
//     comment: null
//   });
// });


//   // Save responses to Supabase
//   const { data, error } = await client.from("response").insert(responses);

//   if(error){
//     Swal.fire("Error saving responses", error.message, "error");
//     return;
//   }

//   // ====== Ensure user exists in "user" table ======
// const { data: userExists, error: userError } = await client
//   .from("user")
//   .select("*")
//   .eq("email", email)
//   .single();

// if (!userExists) {
//   const { data: newUser, error: insertUserError } = await client
//     .from("user")
//     .insert([
//       {
//         name: userData.user.user_metadata?.full_name || "N/A",
//         email: email
//       }
//     ]);

//   if (insertUserError) {
//     Swal.fire("Error saving user info", insertUserError.message, "error");
//     return;
//   }
// }

//   // Hide quiz, show result
//   document.getElementById("surveyBox").classList.add("hidden");
//   resultBox.classList.remove("hidden");
//   resultBox.innerHTML = `
//     <h2 class="text-xl font-bold mb-3">Quiz Result</h2>
//     <p>Total Questions: ${questions.length}</p>
//     <p c
// lass="text-green-700 font-semibold">Correct Answers: ${correctCount}</p>
//     <p class="text-red-700 font-semibold">Wrong Answers: ${wrongCount}</p>
//   `;
// });
// ====== DOM Elements ======
const questionsBox = document.getElementById("questionsBox");
const submitBtns = document.getElementById("submitBtns");
const resultBox = document.getElementById("resultBox");

// ====== Global Variables ======
let questions = [];
let currentIndex = 0;
let userResponses = [];

// ====== Load Questions ======
async function loadQuestionsOneByOne() {
  const { data, error } = await client.from('admin').select('*').order('id', { ascending: true });
  if (error) {
    Swal.fire({ icon: "error", text: error.message });
    return;
  }

  if (!data || data.length === 0) {
    questionsBox.innerHTML = `<p class="text-gray-500 text-center">No questions available.</p>`;
    submitBtns.classList.add("hidden");
    return;
  }

  questions = data;
  currentIndex = 0;
  showQuestion(currentIndex);
}

// ====== Show Single Question ======
function showQuestion(index) {
  const q = questions[index];
  if (!q) return;

  // Clear box
  questionsBox.innerHTML = "";

  let html = `
<div class="bg-white p-6 rounded-2xl shadow-lg space-y-4 border border-red-200 transition hover:shadow-2xl">

  <!-- Progress / Question Number -->
  <div class="flex justify-between items-center mb-3">
    <span class="text-sm text-red-600 font-semibold">Question ${index+1} of ${questions.length}</span>
    <div class="w-1/2 h-2 bg-red-100 rounded-full overflow-hidden">
      <div class="h-full bg-red-600 rounded-full" style="width: ${(index+1)/questions.length*100}%"></div>
    </div>
  </div>
  
  <!-- Question Text with scroll -->
  <p class="text-gray-800 text-lg font-semibold leading-relaxed max-h-40 overflow-y-auto pr-2">
    ${q.qText}
  </p>
  
  <!-- Options -->
  <div id="optionsBox" class="space-y-2">
`;

if (q.qType === "multiple") {
  html += ['A', 'B', 'C', 'D'].map(opt => `
    <label class="flex items-center p-3 border rounded-xl cursor-pointer hover:bg-red-50 transition duration-200">
      <input type="radio" name="q${q.id}" value="${q[opt]}" class="mr-3 h-5 w-5 accent-red-600">
      <span class="text-gray-700 font-medium">${q[opt]}</span>
    </label>
  `).join('');
} else if (q.qType === "tf") {
  html += ['True', 'False'].map(opt => `
    <label class="flex items-center p-3 border rounded-xl cursor-pointer hover:bg-red-50 transition duration-200">
      <input type="radio" name="q${q.id}" value="${opt}" class="mr-3 h-5 w-5 accent-red-600">
      <span class="text-gray-700 font-medium">${opt}</span>
    </label>
  `).join('');
} else if (q.qType === "data") {
  html += `<p class="text-gray-500 italic text-sm">*This is an informational question.</p>`;
}

html += `
  </div>

  <!-- Optional Comment -->
  <textarea placeholder="Add a comment (optional)" id="comment-${q.id}" 
    class="w-full p-3 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 mt-3 resize-none text-gray-700"
    rows="3"></textarea>
</div>`;


  

  questionsBox.innerHTML = html;

  // Update button text
  if(currentIndex < questions.length - 1){
    submitBtns.innerText = "Next";
  } else {
    submitBtns.innerText = "Submit Quiz";
  }
}

// ====== Next / Submit Button ======
submitBtns.addEventListener("click", async () => {
  const q = questions[currentIndex];
  const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
  const comment = document.getElementById(`comment-${q.id}`).value || null;
  const answer = selected ? selected.value : null;
  const is_correct = answer === q.correct;

  // Save user's answer
  userResponses[currentIndex] = {
    question_id: q.id,
    answer,
    is_correct,
    comment
  };

  // If last question, submit all
  if (currentIndex === questions.length - 1) {
    await submitAllResponses();
  } else {
    currentIndex++;
    showQuestion(currentIndex);
  }
});

// ====== Submit all responses to Supabase ======
async function submitAllResponses() {
  const { data: userData } = await client.auth.getUser();
  if (!userData.user) return Swal.fire("Please login first!", "", "error");

  const email = userData.user.email;
  const user_id = userData.user.id;

  const responsesToInsert = userResponses.map(r => ({
    user_email: email,
    user_id: user_id,
    question_id: r.question_id,
    answer: r.answer,
    is_correct: r.is_correct,
    comment: r.comment
  }));

  const { error } = await client.from("response").insert(responsesToInsert);
  if (error) return Swal.fire("Error saving responses", error.message, "error");

  // Show result
  questionsBox.innerHTML = "";
  submitBtns.classList.add("hidden");
  resultBox.classList.remove("hidden");

  const correctCount = userResponses.filter(r => r.is_correct).length;
  const wrongCount = userResponses.filter(r => r.is_correct === false).length;

  resultBox.innerHTML = `
  <div class="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-red-200 max-w-xl mx-auto text-center space-y-4">
    
    <h2 class="text-3xl font-extrabold text-gray-800 drop-shadow-sm">Quiz Completed!</h2>
    
    <div class="flex justify-between text-lg font-medium mt-4">
      <span>Total Questions:</span>
      <span class="text-gray-700">${questions.length}</span>
    </div>

    <div class="flex justify-between text-lg font-medium text-green-700">
      <span>Correct Answers:</span>
      <span>${correctCount}</span>
    </div>

    <div class="flex justify-between text-lg font-medium text-red-700">
      <span>Wrong Answers:</span>
      <span>${wrongCount}</span>
    </div>

    <a href="user.html">
  <button class="mt-6 bg-blue-600 text-white py-3 px-6 rounded-full font-semibold shadow-lg 
                 hover:bg-blue-700 hover:shadow-xl transition-all duration-300">
    Retry Quiz
  </button>
</a>


  </div>
`;

}

// ====== Initialize on Page Load ======
document.addEventListener("DOMContentLoaded", loadQuestionsOneByOne);
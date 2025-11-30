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
    setTimeout(() => { window.location.href = "index.html"; }, 1500);
  }
});

// Admin emails
  const adminEmails = ["kanwalafshan2244@gmail.com"];

  
  function showThemeAlert(msg, type="success") {
    Swal.fire({ icon: type, text: msg, timer: 1500, showConfirmButton: false });
  }

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
    
    saveBtn.addEventListener("click", async () => {
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

// DOM
const questionsBox = document.getElementById("questionsBox");
const submitBtn = document.getElementById("submitBtn");

let questions = [];
let userAnswers = {};

// ===== Fetch Questions from Supabase =====
async function loadQuestions() {
  const { data, error } = await client.from('admin').select('*');

  if(error) {
    Swal.fire({ icon: 'error', text: error.message });
    return;
  }

  questions = data;
  renderQuestions();

 setTimeout(() => {
    window.location.href = "user.html"; 
  }, 1000); 
}

function renderQuestions() {
  questionsBox.innerHTML = '';
  
  questions.forEach((q, index) => {
    let html = `<div class="bg-white p-5 rounded-lg shadow space-y-3">
                  <p class="font-semibold">${index+1}. ${q.qText}</p>`;

    if(q.qType === "multiple") {
      html += `
        <div class="space-y-2">
          ${['A','B','C','D'].map(opt => `
            <label class="block">
              <input type="radio" name="q${index}" value="${opt}" class="mr-2">
              ${q[opt]}
            </label>
          `).join('')}
        </div>
      `;
    } else if(q.qType === "tf") {
      html += `
        <div class="space-y-2">
          ${['True','False'].map(opt => `
            <label class="block">
              <input type="radio" name="q${index}" value="${opt}" class="mr-2">
              ${opt}
            </label>
          `).join('')}
        </div>
      `;
    } else if(q.qType === "data") {
      html += `<p class="text-gray-500 italic">*This is an informational question.</p>`;
    }

    html += `</div>`;
    questionsBox.innerHTML += html;
  });
}

// ===== Submit Answers =====
submitBtn && submitBtn.addEventListener("click", () => {
  let score = 0;

  questions.forEach((q,index) => {
    if(q.qType === "data") return; // skip

    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    const answer = selected ? selected.value : null;

    if(!answer) {
      Swal.fire({ icon: "warning", text: `Question ${index+1} not answered!` });
      return;
    }

    if(answer === q.correct) {
      score++;
      Swal.fire({ icon: 'success', text: `Q${index+1}: Correct!` });
    } else {
      Swal.fire({ icon: 'error', text: `Q${index+1}: Wrong! ${q.failMessage || ''}` });
    }
  });
});

loadQuestions();



const userInfoForm = document.getElementById("userInfoForm");
const startSurveyBtn = document.getElementById("startSurveyBtn");
const surveyBox = document.getElementById("surveyBox");
const questionsBoxs = document.getElementById("questionsBox");
const submitBtns = document.getElementById("submitBtn");
const timerEl = document.getElementById("timer");
const resultBox = document.getElementById("resultBox");

questions = [];
let timer;
let timeLeft = 600; // 10 minutes
let userData = {};

// ===== Start Survey =====
startSurveyBtn && startSurveyBtn.addEventListener("click", async () => {
    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userEmail").value.trim();

    if(!name || !email){
        Swal.fire({ icon: "warning", text: "Enter your name and email!" });
        return;
    }

    userData = { name, email };
    userInfoForm.classList.add("hidden");
    surveyBox.classList.remove("hidden");

    await loadQuestions();
    startTimer();
});

// ===== Load Questions from Supabase =====
async function loadQuestions() {
    const { data, error } = await client.from('questions').select('*');
    if(error){
        {Swal.fire({ icon: "error", text: error.message });}
        return;
    }
    questions = data;
    renderQuestions();
}

function renderQuestions() {
    questionsBox.innerHTML = '';
    questions.forEach((q,index) => {
        let html = `<div class="bg-white p-4 rounded-lg shadow space-y-2">
            <p class="font-semibold">${index+1}. ${q.qText}</p>`;
        
        if(q.qType === "multiple"){
            html += ['A','B','C','D'].map(opt => `
                <label class="block">
                    <input type="radio" name="q${index}" value="${opt}" class="mr-2">${q[opt]}
                </label>
            `).join('');
        } else if(q.qType === "tf"){
            html += ['True','False'].map(opt => `
                <label class="block">
                    <input type="radio" name="q${index}" value="${opt}" class="mr-2">${opt}
                </label>
            `).join('');
        }
        html += `<textarea placeholder="Add your comment (optional)" class="w-full p-2 border rounded mt-2" id="comment${index}"></textarea>`;
        html += `</div>`;
        questionsBox.innerHTML += html;
    });
}

// ===== Timer =====
function startTimer() {
    updateTimerDisplay();
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if(timeLeft <= 0){
            clearInterval(timer);
            Swal.fire({ icon: "info", text: "Time's up! Survey ended." });
            calculateResults();
        }
    },1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft/60);
    const seconds = timeLeft % 60;
    timerEl.innerText = `Time Left: ${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

// ===== Submit Survey =====
submitBtn && submitBtn.addEventListener("click", () => {
    clearInterval(timer);
    calculateResults();
});

async function calculateResults() {
    const userId = await saveUser(userData);
    if (!userId) return;

    let correct = 0;
    let total = 0;

    for (let index = 0; index < questions.length; index++) {
        const q = questions[index];
        if (q.qType === "data") continue;
        total++;

        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const answer = selected ? selected.value : null;
        const comment = document.getElementById(`comment${index}`).value.trim();

        // Save response linked to user_id
        await client.from('responses').insert([{
            user_id: userId,
            question_id: q.id,
            answer: answer,
            comment: comment,
            correct: answer === q.correct
        }]);

        if(answer === q.correct) correct++;
    }

    const percent = total ? Math.round((correct/total)*100) : 0;
    let resultText = `You answered ${correct} out of ${total} correctly (${percent}%). `;
    resultText += percent >= 50 ? "🎉 You Passed!" : "❌ You Failed!";

    surveyBox.classList.add("hidden");
    resultBox.classList.remove("hidden");
    resultBox.innerText = resultText;
}

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

  
  // function showThemeAlert(msg, type="success") {
  //   Swal.fire({ icon: type, text: msg, timer: 1500, showConfirmButton: false });
  // }

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

// DOM
// const questionsBox = document.getElementById("questionsBox");
// ====== DOM Elements ======
const questionsBox = document.getElementById("questionsBox");
const submitBtn = document.getElementById("submitBtn");

// ====== Fetch and Render Questions ======
async function loadQuestions() {
  const { data, error } = await client.from('admin').select('*');

  if(error){
    Swal.fire({ icon: "error", text: error.message });
    return;
  }

  data.forEach((q, index) => {
    let html = `<div class="bg-white shadow-lg rounded-xl p-6 mb-4">
                  <p class="font-semibold mb-2">${index+1}. ${q.qText}</p>`;

    if(q.qType === "multiple") {
      html += ['A','B','C','D'].map(opt => `
        <label class="flex items-center p-2 border rounded-lg cursor-pointer mb-1 hover:bg-blue-50">
          <input type="radio" name="q${index}" value="${opt}" class="form-radio h-5 w-5 text-blue-600 mr-2">
          ${q[opt]}
        </label>
      `).join('');
    } else if(q.qType === "tf") {
      html += ['True','False'].map(opt => `
        <label class="flex items-center p-2 border rounded-lg cursor-pointer mb-1 hover:bg-blue-50">
          <input type="radio" name="q${index}" value="${opt}" class="form-radio h-5 w-5 text-blue-600 mr-2">
          ${opt}
        </label>
      `).join('');
    } else if(q.qType === "data") {
      html += `<p class="text-gray-500 italic">*This is an informational question.</p>`;
    }

    html += `<textarea placeholder="Add your comment (optional)" class="w-full p-2 border rounded mt-2" id="comment${index}"></textarea>`;
    html += `</div>`;

    questionsBox.innerHTML += html;
  });
}

// ====== Submit Answers ======
submitBtn&& submitBtn.addEventListener("click", () => {
  let score = 0;

  questionsBox.querySelectorAll('div').forEach((qDiv, index) => {
    const qType = ['multiple', 'tf', 'data'][0]; // Placeholder if you need type check
    const questionData = questionsBox.dataset; // or fetch from Supabase data again
    const selected = qDiv.querySelector(`input[name="q${index}"]:checked`);
    const comment = qDiv.querySelector(`#comment${index}`).value;

    if(selected){
      const answer = selected.value;
      const correct = questions[index].correct;

      if(answer === correct){
        score++;
        Swal.fire({ icon:'success', text:`Q${index+1}: Correct!` });
      } else {
        Swal.fire({ icon:'error', text:`Q${index+1}: Wrong! ${questions[index].failMessage || ''}` });
      }
    }
  });
});

// ====== Initialize ======
let questions = [];
document.addEventListener('DOMContentLoaded', async () => {
  const { data, error } = await client.from('admin').select('*');
  if(error) return Swal.fire({ icon:'error', text:error.message });
  questions = data;
  loadQuestions();
});
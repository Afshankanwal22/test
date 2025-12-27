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


let editId = null;

// DOM Elements
const editModal = document.getElementById("editModal");
const editBox = document.getElementById("editBox");
const editQText = document.getElementById("editQText");
const editCorrect = document.getElementById("editCorrect");
const updateBtn = document.getElementById("updateBtn");
const cancelEdit = document.getElementById("cancelEdit");
const deleteBtn = document.getElementById("deleteBtn");

// Load Questions from Supabase
async function loadQuestions() {
  const { data, error } = await client.from("admin").select("*").order("id");
  const table = document.getElementById("questionsTable");
  table.innerHTML = "";

  if (error) return Swal.fire("Error", error.message, "error");
  if (!data.length) return table.innerHTML = `<tr><td colspan="5" class="text-center py-4">No Data</td></tr>`;

  data.forEach((q, i) => {
    const row = document.createElement("tr");
    row.className = "border-b hover:bg-blue-50";

    row.innerHTML = `
<td class="p-3 text-center">${i + 1}</td>
<td class="p-3">${q.qText}</td>
<td class="p-3 text-center">${q.qType}</td>
<td class="p-3 text-center font-semibold text-blue-700">
  ${q.correct || "-"}
</td>
<td class="p-3 text-center">
  <button class="editBtn bg-yellow-400 text-white px-3 py-1 rounded"
    data-id="${q.id}"
    data-text="${q.qText}"
    data-correct="${q.correct || ""}">
    Edit
  </button>
</td>
`;

    table.appendChild(row);
  });

  // Add click listener for edit buttons
  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", () => openEdit(btn.dataset.id, btn.dataset.text, btn.dataset.correct));
  });
}

// Open Modal
function openEdit(id, text, correct) {
  editId = id;
  editQText.value = text;
  editCorrect.value = correct;

  editModal.classList.remove("hidden");
  setTimeout(() => editBox.classList.add("show"), 50);
}

// Close Modal
cancelEdit.onclick = () => {
  editBox.classList.remove("show");
  setTimeout(() => editModal.classList.add("hidden"), 200);
};

// Update Question
updateBtn.onclick = async () => {
  const qText = editQText.value.trim();
  const correct = editCorrect.value.trim();

  if (!qText) return Swal.fire("Error", "Question cannot be empty", "error");

  const { error } = await client.from("admin").update({ qText, correct }).eq("id", editId);
  if (error) return Swal.fire("Error", error.message, "error");

  Swal.fire("Updated", "Question updated successfully", "success");
  cancelEdit.click();
  loadQuestions();
};

// Delete Question
deleteBtn.onclick = async () => {
  if (!editId) return;

  const res = await Swal.fire({
    title: "Delete this question?",
    icon: "warning",
    showCancelButton: true
  });

  if (res.isConfirmed) {
    await client.from("admin").delete().eq("id", editId);
    Swal.fire("Deleted", "Question removed", "success");
    cancelEdit.click();
    loadQuestions();
  }
};

// Initial Load
document.addEventListener("DOMContentLoaded", loadQuestions);

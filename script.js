const API_URL = "http://localhost:9400/notes"; // Backend API URL

// Function to load existing notes
async function loadNotes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch notes.");

        const notes = await response.json();
        const notesList = document.getElementById("notesList");
        notesList.innerHTML = ""; // Clear previous list

        notes.forEach(note => {
            const li = document.createElement("li");
            li.textContent = note.title;
            li.onclick = () => showNote(note);
            notesList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading notes:", error);
        showMessage("Error loading notes!", true);
    }
}

// Function to display a selected note
function showNote(note) {
    document.getElementById("noteTitle").value = note.title;
    document.getElementById("noteContent").value = note.content;
    document.getElementById("noteTitle").setAttribute("data-id", note._id);
}

// Unified function to save/update a note
async function saveNote() {
    const titleInput = document.getElementById("noteTitle");
    const contentInput = document.getElementById("noteContent");
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const noteId = titleInput.getAttribute("data-id");

    if (!title || !content) {
        showMessage("Please enter both title and content!", true);
        return;
    }

    try {
        const url = noteId ? `${API_URL}/${noteId}` : API_URL;
        const method = noteId ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content })
        });

        if (!response.ok) throw new Error(`Failed to ${method === "POST" ? "save" : "update"} note`);

        showMessage(noteId ? "Note Updated!" : "Note Saved!");
        clearForm();
        await loadNotes();
    } catch (error) {
        console.error("Error saving note:", error);
        showMessage(`Error ${noteId ? "updating" : "saving"} note!`, true);
    }
}

// Helper function to show messages with timeout
function showMessage(message, isError = false) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = message;
    messageElement.style.color = isError ? "red" : "green";
    setTimeout(() => messageElement.textContent = "", 3000);
}

// Helper function to clear form fields
function clearForm() {
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";
    document.getElementById("noteTitle").removeAttribute("data-id");
}

// Theme Toggle Functionality
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", toggleTheme);

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}

// Initialize application
window.onload = () => {
    loadNotes();
    applySavedTheme();
};

function applySavedTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "Light Mode";
    }
}
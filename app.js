// Small browser-side interactions for family contacts, sharing preferences and reminders.
// These records stay in this browser only; they are not synced to family members.

function readItems(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
}
function saveItems(key, items) {
    localStorage.setItem(key, JSON.stringify(items));
}

// Family contacts
const contactForm = document.getElementById("contactForm");
const contactList = document.getElementById("contactList");
if (contactForm && contactList) {
    function renderContacts() {
        const contacts = readItems("surakshaContacts");
        contactList.innerHTML = "";
        if (contacts.length === 0) {
            contactList.innerHTML = '<p class="small text-secondary">No contacts added yet.</p>';
        }
        contacts.forEach((contact, index) => {
            const row = document.createElement("div");
            row.className = "d-flex justify-content-between align-items-center border-bottom py-3 gap-2";
            const details = document.createElement("div");
            const name = document.createElement("strong");
            name.textContent = contact.name;
            const sub = document.createElement("div");
            sub.className = "small text-secondary";
            sub.textContent = `${contact.relation} • ${contact.phone}`;
            details.append(name, sub);
            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "btn btn-sm btn-outline-danger";
            remove.textContent = "Remove";
            remove.addEventListener("click", () => {
                const updated = readItems("surakshaContacts");
                updated.splice(index, 1);
                saveItems("surakshaContacts", updated);
                renderContacts();
            });
            row.append(details, remove);
            contactList.append(row);
        });
    }
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("contactName").value.trim();
        const relation = document.getElementById("relation").value;
        const phone = document.getElementById("contactPhone").value.trim();
        if (!name || !phone || relation === "Select relationship") {
            alert("Please enter the name, relationship and mobile number.");
            return;
        }
        const contacts = readItems("surakshaContacts");
        contacts.push({ name, relation, phone });
        saveItems("surakshaContacts", contacts);
        contactForm.reset();
        renderContacts();
    });
    renderContacts();
}

// Share and receive preferences
document.querySelectorAll("#sharing input[type='checkbox']").forEach((checkbox) => {
    const saved = JSON.parse(localStorage.getItem("surakshaSharing") || "{}");
    checkbox.checked = Boolean(saved[checkbox.id]);
    checkbox.addEventListener("change", () => {
        const settings = {};
        document.querySelectorAll("#sharing input[type='checkbox']").forEach((item) => {
            settings[item.id] = item.checked;
        });
        localStorage.setItem("surakshaSharing", JSON.stringify(settings));
    });
});

// Reminders
const reminderForm = document.getElementById("reminderForm");
const reminderList = document.getElementById("reminderList");
if (reminderForm && reminderList) {
    function renderReminders() {
        const reminders = readItems("surakshaReminders");
        reminderList.innerHTML = "";
        if (reminders.length === 0) {
            reminderList.innerHTML = '<p class="small text-secondary">No reminders added yet.</p>';
        }
        reminders.forEach((item, index) => {
            const row = document.createElement("div");
            row.className = "d-flex justify-content-between align-items-center border-bottom py-2 gap-2";
            const text = document.createElement("span");
            text.textContent = `${item.title} — ${item.date || "No date"} ${item.time || ""}`;
            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "btn btn-sm btn-outline-danger";
            remove.textContent = "Delete";
            remove.addEventListener("click", () => {
                const updated = readItems("surakshaReminders");
                updated.splice(index, 1);
                saveItems("surakshaReminders", updated);
                renderReminders();
            });
            row.append(text, remove);
            reminderList.append(row);
        });
    }
    reminderForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const title = document.getElementById("task").value.trim();
        const date = document.getElementById("reminderDate").value;
        const time = document.getElementById("reminderTime").value;
        if (!title) {
            alert("Please enter a reminder title.");
            return;
        }
        const reminders = readItems("surakshaReminders");
        reminders.push({ title, date, time });
        saveItems("surakshaReminders", reminders);
        reminderForm.reset();
        renderReminders();
    });
    renderReminders();
}

// Contact form opens the user's email application with the message pre-filled.
const feedbackForm = document.getElementById("feedbackForm");
if (feedbackForm) {
    feedbackForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("mail").value.trim();
        const subject = document.getElementById("subject").value.trim() || "Suraksha Setu feedback";
        const message = document.getElementById("message").value.trim();
        if (!name || !email || !message) {
            alert("Please enter your name, email and message.");
            return;
        }
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}

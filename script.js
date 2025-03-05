const form_errors = [];
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const body = document.body;


document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");

    if (themeToggle) {
        themeToggle.style.display = "block"; 
    }
});

function setTheme(theme) {
    body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
}

function toggleTheme() {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
}

const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

themeToggle.addEventListener("click", toggleTheme);

function flashError(field, message) {
    field.style.borderColor = "red";
    const errorOutput = document.getElementById("error-output");
    errorOutput.textContent = message;

    setTimeout(() => {
        field.style.borderColor = "black";
        errorOutput.textContent = "";
    }, 3000);
}

function updateCharCount() {
    const commentsInput = document.getElementById("comments");
    const charCountOutput = document.getElementById("char-count-output");
    const remaining = 500 - commentsInput.value.length;

    charCountOutput.textContent = `${remaining} characters left`;

    if (remaining <= 10) {
        charCountOutput.classList.add("warning");
    } else {
        charCountOutput.classList.remove("warning");
    }

    if (remaining < 0) {
        charCountOutput.classList.add("error");
        charCountOutput.textContent = `Exceeded character limit by ${-remaining} characters`;
    } else {
        charCountOutput.classList.remove("error");
    }
}

function validateName() {
    const nameInput = document.getElementById("name");

    if (!nameInput.checkValidity()) {
        if (nameInput.validity.patternMismatch) {
            nameInput.setCustomValidity("Name can only contain letters and spaces.");
        } else if (nameInput.validity.tooShort) {
            nameInput.setCustomValidity("Name must be at least 2 characters.");
        } else {
            nameInput.setCustomValidity("");
        }
        flashError(nameInput, nameInput.validationMessage);
        logError("name", nameInput.validationMessage);
        return false;
    }
    nameInput.setCustomValidity("");
    return true;
}

function validateEmail() {
    const emailInput = document.getElementById("email");

    if (!emailInput.checkValidity()) {
        if (emailInput.validity.typeMismatch) {
            emailInput.setCustomValidity("Please enter a valid email address.");
        } else {
            emailInput.setCustomValidity("");
        }
        flashError(emailInput, emailInput.validationMessage);
        logError("email", emailInput.validationMessage);
        return false;
    }
    emailInput.setCustomValidity("");
    return true;
}

function validateComments() {
    const commentsInput = document.getElementById("comments");

    if (!commentsInput.checkValidity()) {
        if (commentsInput.validity.tooLong) {
            commentsInput.setCustomValidity("Comments cannot exceed 500 characters.");
        } else if (commentsInput.validity.tooShort) {
            commentsInput.setCustomValidity("Comments must be at least 1 character.");
        } else {
            commentsInput.setCustomValidity("");
        }
        flashError(commentsInput, commentsInput.validationMessage);
        logError("comments", commentsInput.validationMessage);
        return false;
    }
    commentsInput.setCustomValidity("");
    return true;
}

function logError(field, message) {
    if (message.trim() !== ""){
        const existingError = form_errors.find(error => error.field === field && error.message === message);
        if (!existingError) {
         form_errors.push({ field, message }); 
        }
    console.log("Current Errors:", form_errors); 
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isCommentsValid = validateComments();

    const currentErrors = form_errors.filter(error => {
        const field = document.getElementById(error.field);
        return !field.checkValidity();
    });

    if (currentErrors.length > 0) {
        const errorOutput = document.getElementById("error-output");
        errorOutput.textContent = "Please fix the errors before submitting.";
        console.log("Current Errors on Submission:", currentErrors); 
    } else {
        const form_errorsInput = document.getElementById("form-errors");
        form_errorsInput.value = JSON.stringify(form_errors); 
        console.log("Form Submitted with Errors Log:", form_errorsInput.value); 
        event.target.submit();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const commentsInput = document.getElementById("comments");
    const contactForm = document.getElementById("contact-form");
    if (nameInput) nameInput.addEventListener("input", validateName);
    if (emailInput) emailInput.addEventListener("input", validateEmail);
    if (commentsInput) commentsInput.addEventListener("input", () => {
        updateCharCount();
        validateComments();
    });
    if (contactForm) contactForm.addEventListener("submit", handleSubmit);
});
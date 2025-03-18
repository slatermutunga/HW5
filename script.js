const form_errors = [];
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const body = document.body;

const localData = [
    {
        "title": "Cenk Vs Dr.Phil",
        "image-large": "CenkvsPhil-large.png",
        "image-medium": "CenkvsPhil-medium.png",
        "image-small": "CenkvsPhil-small.png",
        "alt": "CenkVsPhil Image",
        "description": "Cenk vs Dr.Phil Debate On I/P",
        "link": "https://www.youtube.com/watch?v=FG9qBMoYGPk",
        "link-text": "View Video"
    },
    {
        "title": "Mearhsheimer Vs Journalist",
        "image-large": "Mearsheimer-Large.png",
        "image-medium": "Mearsheimer-Medium.png",
        "image-small": "Mearsheimer-Small.png",
        "alt": "Mearsheimer Video",
        "description": "Mearsheimer Vs Polish Journalist Debate On I/P.",
        "link": "https://www.youtube.com/watch?v=K9n6MDVl98c",
        "link-text": "View Video"
    },
    {
        "title": "Myron Vs Rabbi Shmuley",
        "image-large": "Myron-large.png",
        "image-medium": "Myron-medium.png",
        "image-small": "Myron-small.png",
        "alt": "Myron Video",
        "description": "Myron vs Rabbi Shmuley On Kanye West.",
        "link": "https://www.youtube.com/watch?v=88QOkVk2XZw",
        "link-text": "View Video"
    }
];

localStorage.setItem('projects', JSON.stringify(localData));


class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin: 10px;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    background-color: var(--card-bg-color, #fff);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                h2 {
                    color: var(--card-title-color, #333);
                    margin-top: 0;
                }
                picture {
                    display: block;
                    width: 100%;
                    height: auto;
                    border-radius:4px;
                }
                img {
                    width: 100%;
                    height: auto;
                    border-radius: 4px;
                }
                p {
                    color: var(--card-text-color, #666);
                }
                a {
                    color: var(--card-link-color, #007BFF);
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
            <h2></h2>
            <picture>
                <source srcset="" media="(min-width: 768px)">
                <source srcset="" media="(min-width: 480px)">
                <img src="" alt="">
            </picture>
            <p></p>
            <a href="">Read more</a>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('h2').textContent = this.getAttribute('title') || 'Project Title';
        
        const pictureElement = this.shadowRoot.querySelector('picture');
        pictureElement.querySelector('source[media="(min-width: 768px)"]').srcset = this.getAttribute('image-large') || 'default-large.jpg';
        pictureElement.querySelector('source[media="(min-width: 480px)"]').srcset = this.getAttribute('image-medium') || 'default-medium.jpg';
        pictureElement.querySelector('img').src = this.getAttribute('image-small') || 'default-small.jpg';
        pictureElement.querySelector('img').alt = this.getAttribute('alt') || 'Project Image';

        this.shadowRoot.querySelector('p').textContent = this.getAttribute('description') || 'Project description goes here.';
        this.shadowRoot.querySelector('a').href = this.getAttribute('link') || '#';
        this.shadowRoot.querySelector('a').textContent = this.getAttribute('link-text') || 'Read more';
    }
}

customElements.define('project-card', ProjectCard);

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.card-container');
    const loadLocalButton = document.querySelector('#load-local');
    const loadRemoteButton = document.querySelector('#load-remote');

    function populateCards(projects) {
        container.innerHTML = ''; 
        projects.forEach(project => {
            const card = document.createElement('project-card');
            card.setAttribute('title', project.title);
            card.setAttribute('image-large', project['image-large']);
            card.setAttribute('image-medium', project['image-medium']);
            card.setAttribute('image-small', project['image-small']);
            card.setAttribute('alt', project.alt);
            card.setAttribute('description', project.description);
            card.setAttribute('link', project.link);
            card.setAttribute('link-text', project['link-text']);
            container.appendChild(card);
        });
    }

    loadLocalButton.addEventListener('click', () => {
        const localData = JSON.parse(localStorage.getItem('projects')) || [];
        populateCards(localData);
    });

    loadRemoteButton.addEventListener('click', () => {
        fetch('https://my-json-server.typicode.com/slatermutunga/HW5/projects')
            .then(response => response.json())
            .then(data => populateCards(data))
            .catch(error => console.error('Error fetching remote data:', error));
    });
});

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


const $ = (selector) => document.querySelector(selector);

const menuBtn = $("#menuBtn");
const nav = $("#nav");

menuBtn.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", opened);
});

nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => nav.classList.remove("open"));
});

$("#year").textContent = new Date().getFullYear();
const photoInput = $("#photoInput");
const photoButton = $("#photoButton");
const profilePhoto = $("#profilePhoto");
const photoPlaceholder = $("#photoPlaceholder");

const savedPhoto = localStorage.getItem("marianaProfilePhoto");

if (savedPhoto) {
    profilePhoto.src = savedPhoto;
} else {
    profilePhoto.src = "mariana-foto.jpeg";
}

profilePhoto.classList.remove("hidden");
photoPlaceholder.classList.add("hidden");

photoButton.addEventListener("click", () => photoInput.click());

photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
        profilePhoto.src = reader.result;
        profilePhoto.classList.remove("hidden");
        photoPlaceholder.classList.add("hidden");
        localStorage.setItem("marianaProfilePhoto", reader.result);
    };

    reader.readAsDataURL(file);
});

const contactForm = $("#contactForm");
const savedMessage = $("#savedMessage");

const contactFields = ["email", "phone", "address"];

contactFields.forEach(id => {
    const saved = localStorage.getItem(`mariana-${id}`);
    if (saved) $("#" + id).value = saved;
});

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    contactFields.forEach(id => {
        localStorage.setItem(`mariana-${id}`, $("#" + id).value.trim());
    });

    savedMessage.textContent = "Seus contatos foram salvos neste navegador.";
});


const projectModal = $("#projectModal");
const addProjectBtn = $("#addProjectBtn");
const closeModal = $("#closeModal");
const projectForm = $("#projectForm");
const projectGrid = $("#projectGrid");

function openModal() {
    projectModal.classList.remove("hidden");
    projectModal.setAttribute("aria-hidden", "false");
    $("#projectName").focus();
}

function closeProjectModal() {
    projectModal.classList.add("hidden");
    projectModal.setAttribute("aria-hidden", "true");
}

addProjectBtn.addEventListener("click", openModal);
closeModal.addEventListener("click", closeProjectModal);

projectModal.addEventListener("click", (event) => {
    if (event.target === projectModal) closeProjectModal();
});

function getProjects() {
    return JSON.parse(localStorage.getItem("marianaProjects") || "[]");
}

function saveProjects(projects) {
    localStorage.setItem("marianaProjects", JSON.stringify(projects));
}

function renderProjects() {
    const projects = getProjects();

    const fixedProjects = `
        <article class="project-card">
            <div><span class="card-number">PROJETO 01</span><h3>Bella Pizza</h3><p>Painel de gerenciamento de cardápio com login, cadastro de pizzas, preços, imagens e exclusão de itens.</p></div>
            <a href="projetos/bella-pizza/index.html" target="_blank">Entrar no projeto ↗</a>
        </article>
        <article class="project-card">
            <div><span class="card-number">PROJETO 02</span><h3>Cafeteria Aroma</h3><p>Interface de cafeteria com busca, filtro de produtos e carrinho interativo.</p></div>
            <a href="projetos/cafeteria-aroma/index.html" target="_blank">Entrar no projeto ↗</a>
        </article>
    `;

    if (projects.length === 0) {
        projectGrid.innerHTML = fixedProjects + `
            <article class="project-card project-placeholder">
                <div class="project-icon">+</div>
                <h3>Seu próximo projeto</h3>
                <p>Clique em “Adicionar projeto” para colocar aqui seus próximos trabalhos.</p>
            </article>
        `;
        return;
    }

    projectGrid.innerHTML = fixedProjects + projects.map((project, index) => `
        <article class="project-card">
            <div>
                <span class="card-number">PROJETO ${String(index + 1).padStart(2, "0")}</span>
                <h3>${escapeHtml(project.name)}</h3>
                <p>${escapeHtml(project.description)}</p>
            </div>

            ${
                project.link
                ? `<a href="${escapeAttribute(project.link)}" target="_blank" rel="noopener">Ver projeto ↗</a>`
                : ""
            }
        </article>
    `).join("");
}

function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeAttribute(text) {
    return escapeHtml(text);
}

projectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const project = {
        name: $("#projectName").value.trim(),
        description: $("#projectDescription").value.trim(),
        link: $("#projectLink").value.trim()
    };

    const projects = getProjects();
    projects.push(project);
    saveProjects(projects);

    renderProjects();
    projectForm.reset();
    closeProjectModal();
});

renderProjects();

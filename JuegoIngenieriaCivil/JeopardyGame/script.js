
//  SONIDOS


const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const winnerSound = document.getElementById("winnerSound");

bgMusic.volume = 0.3;

// Reproducir música al primer click (restricción navegador)
window.addEventListener("click", () => {
    bgMusic.play();
}, { once: true });



// ESTADO DEL JUEGO


let gameData = {
    players: [],
    categories: [],
    currentPlayer: 0
};

let currentQuestion = null;
let currentCell = null;



// SETUP INICIAL


const numPlayersSelect = document.getElementById("numPlayers");

for (let i = 1; i <= 4; i++) {
    numPlayersSelect.innerHTML += `<option value="${i}">${i}</option>`;
}

numPlayersSelect.addEventListener("change", renderPlayerInputs);
renderPlayerInputs();

function renderPlayerInputs() {
    const container = document.getElementById("playerNames");
    container.innerHTML = "";

    let n = parseInt(numPlayersSelect.value);

    for (let i = 0; i < n; i++) {
        container.innerHTML += `
            <input type="text" 
                   id="player${i}" 
                   placeholder="Nombre Jugador ${i+1}">
            <br>`;
    }
}



// EDITOR DE PREGUNTAS


function createEditor() {

    let nCat = parseInt(document.getElementById("numCategories").value) || 0;
    let nQ = parseInt(document.getElementById("numQuestions").value) || 0;

    const editor = document.getElementById("editor");
    editor.innerHTML = "<h2>Editor de Preguntas</h2>";

    const container = document.createElement("div");
    container.className = "categories-container";
    editor.appendChild(container);

    for (let c = 0; c < nCat; c++) {

        const column = document.createElement("div");
        column.className = "category-column";

        const title = document.createElement("input");
        title.type = "text";
        title.id = `catName${c}`;
        title.className = "category-title";
        title.placeholder = "Nombre categoría";

        column.appendChild(title);

        for (let q = 0; q < nQ; q++) {

            column.innerHTML += `
                <div class="value-box">${(q+1)*100}</div>
                <div class="qa-row">
                    <input type="text" id="q${c}_${q}" placeholder="Pregunta">
                    <input type="text" id="a${c}_${q}" placeholder="Respuesta">
                </div>
            `;
        }

        container.appendChild(column);
    }

    // boton guardar set

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Guardar Set";
    saveBtn.onclick = saveQuestionSet;
    editor.appendChild(saveBtn);

    // boton iniciar juego

    const startBtn = document.createElement("button");
    startBtn.textContent = "Iniciar Juego";
    startBtn.addEventListener("click", startGame);

    editor.appendChild(document.createElement("br"));
    editor.appendChild(document.createElement("br"));
    editor.appendChild(startBtn);
}

//start game

function startGame() {

    // Obtener categorías
    gameData.categories = collectCategoriesFromEditor();

    // Resetear preguntas
    gameData.categories.forEach(cat => {
        cat.questions.forEach(q => q.used = false);
    });

    hideAllScreens();
    document.getElementById("game").style.display = "block";

    renderBoard();
    renderScore();
    updateTurn();
    showTurnModal();

}




// TABLERO


function renderBoard() {

    const board = document.getElementById("board");
    board.innerHTML = "";

    board.style.gridTemplateColumns =
        `repeat(${gameData.categories.length}, 1fr)`;

    // Encabezados categorías
    gameData.categories.forEach(cat => {
        board.innerHTML += `<div class="cell">${cat.name}</div>`;
    });

    let maxQ = gameData.categories[0]?.questions.length || 0;

    for (let q = 0; q < maxQ; q++) {
        gameData.categories.forEach((cat, cIndex) => {

            let question = cat.questions[q];

            board.innerHTML += `
                <div class="cell"
                     onclick="openQuestion(${cIndex},${q}, this)">
                     ${question.value}
                </div>
            `;
        });
    }
    if (!gameData.categories.length) return;

}



// ABRIR PREGUNTA


function openQuestion(cIndex, qIndex, element) {

    currentQuestion =
        gameData.categories[cIndex].questions[qIndex];

    if (currentQuestion.used) return;

    clickSound.currentTime = 0;
    clickSound.play();

    currentCell = element;

    document.getElementById("questionText").innerText =
        currentQuestion.question;

    document.getElementById("answerText").innerText =
        currentQuestion.answer;

    document.getElementById("answerText").style.display = "none";

    document.getElementById("modal").style.display = "flex";
    if (!currentQuestion) return;
    let modal = document.getElementById("modal");
    if (!modal) return;
    modal.style.display = "flex";
}



// MOSTRAR RESPUESTA


function showAnswer() {
    document.getElementById("answerText").style.display = "block";
}



//  RESPONDER


function answer(isCorrect) {

    if (isCorrect) {
        gameData.players[gameData.currentPlayer].score += currentQuestion.value;
        correctSound.currentTime = 0;
        correctSound.play();
        document.body.classList.add("correct-animation");
    } else {
        gameData.players[gameData.currentPlayer].score -= currentQuestion.value;
        wrongSound.currentTime = 0;
        wrongSound.play();
        document.body.classList.add("wrong-animation");
    }

    setTimeout(() => {
        document.body.classList.remove("correct-animation");
        document.body.classList.remove("wrong-animation");
    }, 500);

    currentQuestion.used = true;
    currentCell.classList.add("used");
    currentCell.innerText = "";

    document.getElementById("modal").style.display = "none";

nextTurn();
renderScore();

let finished = gameData.categories.every(cat =>
    cat.questions.every(q => q.used)
);

if (finished) {
    checkGameEnd();
} else {
    showTurnModal();
}

}



// TURNOS


function nextTurn() {
    gameData.currentPlayer++;

    if (gameData.currentPlayer >= gameData.players.length) {
        gameData.currentPlayer = 0;
    }

    updateTurn();
}

function updateTurn() {
    document.getElementById("turn").innerText =
        "Turno: " +
        gameData.players[gameData.currentPlayer].name;
}



// PUNTAJES


function renderScore() {

    const scoreDiv = document.getElementById("scoreboard");
    scoreDiv.innerHTML = "";

    gameData.players.forEach(player => {
        scoreDiv.innerHTML += `
            <div>
                ${player.name}: <strong>${player.score}</strong> pts
            </div>
        `;
    });
}



// FINAL DEL JUEGO


function checkGameEnd() {

    let finished = gameData.categories.every(cat =>
        cat.questions.every(q => q.used)
    );

    if (finished) {

        let winner = gameData.players.reduce((a, b) =>
            a.score > b.score ? a : b
        );

        winnerSound.currentTime = 0;
        winnerSound.play();

        document.getElementById("winnerName").innerText =
            "🏆 " + winner.name + " GANA 🏆";

        document.getElementById("winnerModal").style.display = "flex";
    }
}
function restartGame() {
    location.reload();
}

    // Guardar sets de preguntas

function saveQuestionSet() {

    let setName = prompt("Nombre del set:");

    if (!setName) return;

    let categories = collectCategoriesFromEditor();

    let savedSets =
        JSON.parse(localStorage.getItem("jeopardySets")) || {};

    savedSets[setName] = categories;

    localStorage.setItem("jeopardySets", JSON.stringify(savedSets));

    alert("Set guardado correctamente ✅");
}
    // Recoger categorias

function collectCategoriesFromEditor() {

    let categories = [];
    let columns = document.querySelectorAll(".category-column");

    columns.forEach((column, c) => {

        let categoryName =
            column.querySelector(".category-title").value ||
            `Categoría ${c+1}`;

        let questions = [];

        let qInputs = column.querySelectorAll(".qa-row");

        qInputs.forEach((row, i) => {

            let questionInput =
                row.querySelector(`#q${c}_${i}`);

            let answerInput =
                row.querySelector(`#a${c}_${i}`);

            questions.push({
                question: questionInput.value,
                answer: answerInput.value,
                value: (i+1)*100,
                used: false
            });
        });

        categories.push({
            name: categoryName,
            questions: questions
        });
    });

    return categories;
}


    //mostrar sets guardados 

function renderSavedSets() {

    const container = document.getElementById("savedSets");

    let savedSets =
        JSON.parse(localStorage.getItem("jeopardySets")) || {};

    container.innerHTML = "<h2>Biblioteca de Sets</h2>";
    
    if (Object.keys(savedSets).length === 0) {
        container.innerHTML += "<p>No hay sets guardados.</p>";
        return;
    }

    for (let name in savedSets) {

        container.innerHTML += `
            <div class="saved-set">
                <strong>${name}</strong>
                <button onclick="loadSet('${name}')">Cargar</button>
                <button onclick="deleteSet('${name}')">Eliminar</button>
                <button onclick="exportSet('${name}')">Exportar</button>

            </div>
        `;
    }
    
}


    // cargar sets

function loadSet(name) {

    let savedSets =
        JSON.parse(localStorage.getItem("jeopardySets")) || {};

    let categories = savedSets[name];

    if (!categories) return;

    gameData.categories = categories;

    closeLibrary(); 

    startGameFromLoadedSet();
}


    //Iniciar juego desde cargando set

    function startGameFromLoadedSet() {

    gameData.categories.forEach(cat => {
        cat.questions.forEach(q => q.used = false);
    });

    hideAllScreens();
    document.getElementById("game").style.display = "block";

    renderBoard();
    renderScore();
    updateTurn();
    showTurnModal();
}


    //sobrescribir editor

function preloadEditor(categories) {

    const editor = document.getElementById("editor");
    editor.innerHTML = "<h2>Editor de Preguntas</h2>";

    const container = document.createElement("div");
    container.className = "categories-container";
    editor.appendChild(container);

    categories.forEach((cat, c) => {

        const column = document.createElement("div");
        column.className = "category-column";

        column.innerHTML += `
            <input type="text"
                   id="catName${c}"
                   class="category-title"
                   value="${cat.name}">
        `;

        cat.questions.forEach((q, i) => {

            column.innerHTML += `
                <div class="value-box">${q.value}</div>
                <div class="qa-row">
                    <input type="text"
                           id="q${c}_${i}"
                           value="${q.question}">
                    <input type="text"
                           id="a${c}_${i}"
                           value="${q.answer}">
                </div>
            `;
        });

        container.appendChild(column);
    });

    editor.innerHTML += `
        <br>
        <button onclick="saveQuestionSet()">Guardar Set</button>
        <button onclick="startGame()">Iniciar Juego</button>
        <button onclick="openLibrary()">Cargar Juego</button>
    `;
}



    //eliminar set 

function deleteSet(name) {

    let savedSets =
        JSON.parse(localStorage.getItem("jeopardySets")) || {};

    delete savedSets[name];

    localStorage.setItem("jeopardySets", JSON.stringify(savedSets));

    renderSavedSets();
}
    // Control de Pantallas
    // Ocultar pantallas
    function hideAllScreens() {
        document.getElementById("home").style.display = "none";
        document.getElementById("setup").style.display = "none";
        document.getElementById("editor").style.display = "none";
        document.getElementById("game").style.display = "none";
        document.getElementById("modeSelection").style.display = "none";
    }

    function goToSetup() {
        hideAllScreens();
        document.getElementById("setup").style.display = "block";
    }

    function goToEditor() {
        hideAllScreens();
        document.getElementById("editor").style.display = "block";
        createEditor();
    }

    // Biblioteca
function openLibrary() {
    renderSavedSets();
    document.getElementById("libraryModal").style.display = "flex";
}

function closeLibrary() {
    document.getElementById("libraryModal").style.display = "none";
}

    //Agregar jugadores
function setupPlayers() {

    gameData.players = [];
    gameData.currentPlayer = 0;

    let nPlayers = parseInt(document.getElementById("numPlayers").value);

    for (let i = 0; i < nPlayers; i++) {

        let name =
            document.getElementById(`player${i}`).value ||
            `Jugador ${i+1}`;

        gameData.players.push({
            name: name,
            score: 0
        });
    }

    hideAllScreens();
    document.getElementById("modeSelection").style.display = "block";

    // Ocultar sección importar por defecto
    document.getElementById("importSection").style.display = "none";
}

    // Exportar json
function exportSet(name) {

    let savedSets =
        JSON.parse(localStorage.getItem("jeopardySets")) || {};

    let data = savedSets[name];
    if (!data) return;

    let blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    );

    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name + ".json";
    link.click();
}
    //Importar json
function importSet() {

    const fileInput = document.getElementById("importFile");
    const file = fileInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        let categories = JSON.parse(e.target.result);

        let setName = file.name.replace(".json","");

        let savedSets =
            JSON.parse(localStorage.getItem("jeopardySets")) || {};

        savedSets[setName] = categories;

        localStorage.setItem("jeopardySets", JSON.stringify(savedSets));

        alert("Set importado correctamente ✅");
        renderSavedSets();
    };

    reader.readAsText(file);
}
    //mostrar seccion de imports
    function showImportSection() {

    const section = document.getElementById("importSection");

    if (section.style.display === "none") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}
    //Mostrar Turno
function showTurnModal() {

    const modal = document.getElementById("turnModal");
    const name = document.getElementById("turnPlayerName");

    name.innerText =
        gameData.players[gameData.currentPlayer].name;

    modal.style.display = "flex";

    setTimeout(() => {
        modal.style.display = "none";
    }, 1500);
}

renderSavedSets();

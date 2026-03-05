 const buttons = document.querySelectorAll('.nav-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Quitar active de todos
      buttons.forEach(b => b.classList.remove('active'));

      // Agregar active al presionado
      btn.classList.add('active');
    });
  });


const components = document.getElementById('components');
const title = document.getElementById('title');

// ===============================
// DATOS POR FACULTAD
// ===============================
const FACULTADES = {
  sistemas: {
    titulo: 'Facultad de Sistemas',
    cards: [
      {
        titulo: 'Sistemas',
        descripcion: 'Área de tecnología, software y computación.'
      },
      {
        titulo: 'Juego Online',
        descripcion: 'escanea el QR'
      }
    ]
  },

  industrial: {
    titulo: 'Facultad de Industrial',
    cards: [
      {
        titulo: 'Industrial',
        descripcion: 'Procesos, logística y optimización.'
      },
      {
        titulo: 'Juego Online',
        descripcion: 'escanea el QR'
      }
    ]
  },

  mecanica: {
    titulo: 'Facultad de Mecánica',
    cards: [
      {
        titulo: 'Mecánica',
        descripcion: 'Fuerzas, máquinas y movimiento.'
      },
      {
        titulo: 'Juego Online',
        descripcion: 'escanea el QR'
      }
    ]
  },

  civil: {
    titulo: 'Facultad de Civil',
    cards: [
      {
        titulo: 'Civil',
        descripcion: 'Jeopardy Game - Trivia de conocimiento de Ingeniería civil'
      },
      {
        titulo: 'juego online',
        descripcion: 'escanea el Qr'
      }
    ]
  },

  electrica: {
    titulo: 'Facultad de Eléctrica',
    cards: [
      {
        titulo: 'Eléctrica',
        descripcion: 'Energía y sistemas eléctricos.'
      },
      {
        titulo: 'Juego Online',
        descripcion: 'escanea el QR'
      }
    ]
  }
};

// ===============================
// EVENTOS SIDEBAR
// ===============================
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Estado activo
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // La segunda clase indica la facultad
    const facultad = btn.classList[1];
    cargarCards(facultad);
  });
});

// ===============================
// REFERENCIAS MODAL
// ===============================
const modal = document.getElementById('game-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const startGameBtn = document.getElementById('start-game');
const closeModalBtn = document.getElementById('close-modal');

let currentModule = null;

// ===============================
// CARGAR CARDS
// ===============================
function cargarCards(facultad) {
  const data = FACULTADES[facultad];
  if (!data) return;

  title.textContent = data.titulo;
  components.innerHTML = '';

  data.cards.forEach(cardData => {
    const card = document.createElement('div');
    card.className = `card glass ${facultad}`;

    card.innerHTML = `
      <h3>${cardData.titulo}</h3>
      <p>${cardData.descripcion}</p>
      <button class="play-btn">Jugar Ya</button>
    `;

    card.querySelector('.play-btn').addEventListener('click', () => {
      // 👉 NAVEGACIÓN POR FACULTAD
      navegarAFacultad(facultad);
    });

    components.appendChild(card);
  });
}

// ===============================
// ABRIR MODAL
// ===============================
function abrirModal(cardData, facultad) {
  currentModule = cardData;

  modalTitle.textContent = cardData.titulo;
  modalDescription.textContent = cardData.descripcion;

  // Heredar color de la facultad
  modal.querySelector('.modal-content').className =
    `modal-content glass ${facultad}`;

  modal.classList.remove('hidden');
}

function navegarAFacultad(facultad) {
  const rutas = {
    sistemas: 'pages/sistemas.html',
    industrial: 'pages/industrial.html',
    mecanica: 'pages/mecanica.html',
<<<<<<< HEAD
    civil: '../JuegoIngenieriaCivil/JeopardyGame/jeopardygame.html',
=======
    civil: '../IngenieriaCivil/JeopardyGame/jeopardygame.html',
>>>>>>> 77c3bd7c4cbd2817bc6eec4b41c154f58686a540
    electrica: 'pages/electrica.html'
  };

  const page = rutas[facultad];
  if (!page) return;

  window.location.href = page;
}
// ===============================
// CERRAR MODAL
// ===============================
closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});
document.addEventListener('DOMContentLoaded', () => {

  const buttons = document.querySelectorAll('.nav-btn');
  const components = document.getElementById('components');
  const title = document.getElementById('title');

  const modal = document.getElementById('game-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const startGameBtn = document.getElementById('start-game');
  const closeModalBtn = document.getElementById('close-modal');

  let currentModule = null;
  let currentPlayer = null;

  // ===============================
  // BOTÓN INICIAR JUEGO
  // ===============================
  startGameBtn.addEventListener('click', () => {
    if (!currentModule) return;

    let playerName = prompt('Ingresa tu nombre:', 'Jugador');


    if (!playerName) return;

    playerName = playerName.trim().substring(0, 12);

    if (!playerName) {
      alert('Nombre inválido');
      return;
    }

    currentPlayer = {
      name: playerName,
      facultad: title.textContent,
      modulo: currentModule.titulo,
      startedAt: Date.now()
    };

    console.log('Jugador activo:', currentPlayer);

    if (window.electronAPI?.startGame) {
      window.electronAPI.startGame(currentPlayer);
    }

    modal.classList.add('hidden');
    iniciarJuego(currentPlayer);
  });

  // ===============================
  // INICIAR JUEGO
  // ===============================
  function iniciarJuego(player) {
    document.querySelector('.app').style.display = 'none';

    if (window.startGame) {
      window.startGame(player);
      return;
    }

    const script = document.createElement('script');
    script.src = 'game.js';

    script.onload = () => {
      window.startGame(player);
    };

    document.body.appendChild(script);
  }

});
cargarCards('sistemas');

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  backgroundColor: '#1e1e1e',
  scene: {
    preload,
    create,
    update
  }
};

let score = 0;
let timeLeft = 30;
let scoreText;
let timeText;
let truckZone;

let totalBoxes = 6;
let boxesPlaced = 0;
let playerName = 'Jugador';

new Phaser.Game(config);

function preload() {
  this.load.image('box', 'assets/caja.png');
  this.load.image('camion', 'assets/camion.png');
}

function create() {
  // ===== PEDIR NOMBRE DEL JUGADOR =====
  playerName = prompt('Ingresa tu nombre:', 'Jugador') || 'Jugador';
  playerName = playerName.substring(0, 12);

  // ===== RESET VARIABLES =====
  score = 0;
  timeLeft = 30;
  boxesPlaced = 0;

  // ===== CAMIÓN =====
  const camion = this.add.image(620, 340, 'camion');
  camion.setScale(0.40);

  // ===== ZONA DE CARGA =====
  truckZone = this.add.zone(670, 320, 360, 150);

  // ===== DEBUG (puedes borrar luego) =====
  const debug = this.add.graphics();
  debug.lineStyle(2, 0x00ff00);
  debug.strokeRect(
    truckZone.x - truckZone.width / 2,
    truckZone.y - truckZone.height / 2,
    truckZone.width,
    truckZone.height
  );

  // ===== TEXTO =====
  scoreText = this.add.text(20, 20, 'Puntaje: 0', {
    fontSize: '20px',
    color: '#ffffff'
  });

  timeText = this.add.text(20, 50, 'Tiempo: 30', {
    fontSize: '20px',
    color: '#ffffff'
  });

  // ===== CREAR CAJAS =====
  for (let i = 0; i < totalBoxes; i++) {
    let box = this.add.image(150, 120 + i * 70, 'box')
      .setInteractive({ draggable: true })
      .setScale(0.1);

    box.startX = box.x;
    box.startY = box.y;

    this.input.setDraggable(box);
  }

  // ===== DRAG =====
  this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    gameObject.x = dragX;
    gameObject.y = dragY;
  });

  // ===== DROP =====
  this.input.on('dragend', (pointer, gameObject) => {
    if (
      Phaser.Geom.Rectangle.Contains(
        truckZone.getBounds(),
        gameObject.x,
        gameObject.y
      )
    ) {
      gameObject.disableInteractive();

      const basePoints = 100;
      const speedBonus = timeLeft * 5;
      score += basePoints + speedBonus;

      scoreText.setText('Puntaje: ' + score);

      boxesPlaced++;

      if (boxesPlaced === totalBoxes) {
        endGame.call(this);
      }
    } else {
      gameObject.x = gameObject.startX;
      gameObject.y = gameObject.startY;
    }
  });

  // ===== TEMPORIZADOR =====
  this.time.addEvent({
    delay: 1000,
    callback: () => {
      timeLeft--;
      timeText.setText('Tiempo: ' + timeLeft);

      if (timeLeft <= 0) {
        endGame.call(this);
      }
    },
    loop: true
  });
}

function update() {}

function endGame() {
  // ===== DESACTIVAR DRAG DE CAJAS =====
  this.children.list.forEach(obj => {
    if (obj.input && obj.input.draggable) {
      obj.disableInteractive();
    }
  });

  // ===== GUARDAR EN SQLITE (ELECTRON) =====
  if (window.electronAPI) {
    window.electronAPI.saveScore({
      player: playerName,
      score: score
    });
  } else {
    console.log('Electron API no disponible');
  }

  // ===== FONDO =====
  this.add.rectangle(450, 300, 520, 240, 0x000000, 0.85);

  // ===== TEXTO =====
  this.add.text(300, 250, 'FIN DEL JUEGO', {
    fontSize: '32px',
    color: '#ffffff'
  });

  this.add.text(260, 300, 'Puntaje final: ' + score, {
    fontSize: '24px',
    color: '#00ff00'
  });

  // ===== BOTÓN JUGAR DE NUEVO =====
  const btnBg = this.add.rectangle(450, 360, 220, 50, 0x1abc9c)
    .setInteractive({ useHandCursor: true });

  this.add.text(450, 360, 'JUGAR DE NUEVO', {
    fontSize: '20px',
    color: '#000000'
  }).setOrigin(0.5);

  btnBg.on('pointerdown', () => {
    this.scene.restart();
  });

  btnBg.on('pointerover', () => btnBg.setFillStyle(0x16a085));
  btnBg.on('pointerout', () => btnBg.setFillStyle(0x1abc9c));
}

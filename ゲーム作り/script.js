const player = document.getElementById("player");
const item = document.getElementById("item");
const scoreLabel = document.getElementById("score");
const message = document.getElementById("message");
const container = document.getElementById("game-container");
const enemiesContainer = document.getElementById("enemies-container");
const attacksContainer = document.getElementById("attacks-container");

const state = {
  x: 220,
  y: 160,
  speed: 6,
  score: 0,
  gameOver: false,
  keys: {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  },
};

const enemies = [];
const attacks = [];
let gameFrameCount = 0;
const ENEMY_SPAWN_INTERVAL = 120;
const ATTACK_SPAWN_INTERVAL = 60;

function placeItem() {
  const maxX = container.clientWidth - 40;
  const maxY = container.clientHeight - 40;
  item.style.left = `${Math.floor(Math.random() * maxX)}px`;
  item.style.top = `${Math.floor(Math.random() * maxY)}px`;
}

function updatePlayer() {
  if (state.keys.ArrowUp) state.y -= state.speed;
  if (state.keys.ArrowDown) state.y += state.speed;
  if (state.keys.ArrowLeft) state.x -= state.speed;
  if (state.keys.ArrowRight) state.x += state.speed;

  state.x = Math.max(0, Math.min(container.clientWidth - 40, state.x));
  state.y = Math.max(0, Math.min(container.clientHeight - 40, state.y));

  player.style.left = `${state.x}px`;
  player.style.top = `${state.y}px`;
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();

  if (
    playerRect.left < itemRect.right &&
    playerRect.right > itemRect.left &&
    playerRect.top < itemRect.bottom &&
    playerRect.bottom > itemRect.top
  ) {
    state.score += 1;
    scoreLabel.textContent = state.score;
    placeItem();
    showMessage("アイテムをゲット！");
  }
}

function spawnEnemy() {
  const side = Math.floor(Math.random() * 4);
  let x, y;
  const speed = 1.5 + Math.random() * 1;

  if (side === 0) {
    x = Math.random() * container.clientWidth;
    y = -35;
  } else if (side === 1) {
    x = container.clientWidth;
    y = Math.random() * container.clientHeight;
  } else if (side === 2) {
    x = Math.random() * container.clientWidth;
    y = container.clientHeight;
  } else {
    x = -35;
    y = Math.random() * container.clientHeight;
  }

  const enemyElement = document.createElement("div");
  enemyElement.className = "enemy";
  enemyElement.style.left = `${x}px`;
  enemyElement.style.top = `${y}px`;
  enemiesContainer.appendChild(enemyElement);

  const enemy = {
    x,
    y,
    speed,
    element: enemyElement,
    attackCounter: Math.random() * ATTACK_SPAWN_INTERVAL,
  };
  enemies.push(enemy);
}

function updateEnemies() {
  enemies.forEach((enemy, index) => {
    const dx = state.x + 20 - (enemy.x + 17.5);
    const dy = state.y + 20 - (enemy.y + 17.5);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      enemy.x += (dx / distance) * enemy.speed;
      enemy.y += (dy / distance) * enemy.speed;
    }

    enemy.element.style.left = `${enemy.x}px`;
    enemy.element.style.top = `${enemy.y}px`;

    // 敵が画面外に出たら削除
    if (
      enemy.x > container.clientWidth ||
      enemy.x < -35 ||
      enemy.y > container.clientHeight ||
      enemy.y < -35
    ) {
      enemy.element.remove();
      enemies.splice(index, 1);
      return;
    }

    // 敵がプレイヤーに攻撃
    enemy.attackCounter++;
    if (enemy.attackCounter >= ATTACK_SPAWN_INTERVAL) {
      spawnAttack(enemy.x + 17.5, enemy.y + 17.5);
      enemy.attackCounter = 0;
    }

    // 敵とプレイヤーの衝突判定
    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.element.getBoundingClientRect();
    if (
      playerRect.left < enemyRect.right &&
      playerRect.right > enemyRect.left &&
      playerRect.top < enemyRect.bottom &&
      playerRect.bottom > enemyRect.top
    ) {
      endGame();
    }
  });
}

function spawnAttack(x, y) {
  const dx = state.x + 20 - x;
  const dy = state.y + 20 - y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const attackElement = document.createElement("div");
  attackElement.className = "attack";
  attackElement.style.left = `${x}px`;
  attackElement.style.top = `${y}px`;
  attacksContainer.appendChild(attackElement);

  const attack = {
    x,
    y,
    vx: (dx / distance) * 3,
    vy: (dy / distance) * 3,
    element: attackElement,
  };
  attacks.push(attack);
}

function updateAttacks() {
  attacks.forEach((attack, index) => {
    attack.x += attack.vx;
    attack.y += attack.vy;

    attack.element.style.left = `${attack.x}px`;
    attack.element.style.top = `${attack.y}px`;

    // 画面外に出たら削除
    if (
      attack.x > container.clientWidth ||
      attack.x < 0 ||
      attack.y > container.clientHeight ||
      attack.y < 0
    ) {
      attack.element.remove();
      attacks.splice(index, 1);
      return;
    }

    // プレイヤーとの衝突判定
    const playerRect = player.getBoundingClientRect();
    const attackRect = attack.element.getBoundingClientRect();
    if (
      playerRect.left < attackRect.right &&
      playerRect.right > attackRect.left &&
      playerRect.top < attackRect.bottom &&
      playerRect.bottom > attackRect.top
    ) {
      endGame();
    }
  });
}

function endGame() {
  if (state.gameOver) return;
  state.gameOver = true;
  showMessage(`ゲームオーバー！スコア: ${state.score}`);
  setTimeout(() => {
    location.reload();
  }, 2000);
}

function showMessage(text) {
  message.textContent = text;
  setTimeout(() => {
    if (message.textContent === text) {
      message.textContent = "";
    }
  }, 900);
}

function gameLoop() {
  if (state.gameOver) return;

  gameFrameCount++;

  // 定期的に敵を生成
  if (gameFrameCount % ENEMY_SPAWN_INTERVAL === 0) {
    spawnEnemy();
  }

  updatePlayer();
  checkCollision();
  updateEnemies();
  updateAttacks();
  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (event) => {
  if (event.key in state.keys) {
    state.keys[event.key] = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key in state.keys) {
    state.keys[event.key] = false;
  }
});

placeItem();
requestAnimationFrame(gameLoop);

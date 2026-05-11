# Vibe Coding 超入門 4回目ゲーム制作

## 概要

このドキュメントは、安野たかひろ氏の「Vibe Coding 超入門」シリーズ第4回で作成されたゲームの制作メモです。HTML/CSS/JavaScript を使ったシンプルなブラウザゲームを作る流れを整理します。

## ゲームのコンセプト

- プレイヤーはキーボード操作でキャラクターを動かす
- 画面上のアイテムを集める
- 障害物や敵を避けながらスコアを稼ぐ
- シンプルなステージ構成とクリア判定

## 必要なファイル

- `index.html`
- `style.css`
- `script.js`

## 1. HTML の構成

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vibe Coding 4回目ゲーム</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="game-container">
    <div id="player"></div>
    <div id="item"></div>
    <div id="score-board">スコア: <span id="score">0</span></div>
    <div id="message"></div>
  </div>
  <script src="script.js"></script>
</body>
</html>
```

## 2. CSS のレイアウト

```css
body {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #0f172a;
  color: #f8fafc;
  font-family: "Segoe UI", sans-serif;
}

#game-container {
  position: relative;
  width: 480px;
  height: 360px;
  background: #111827;
  border: 4px solid #3b82f6;
  border-radius: 16px;
  overflow: hidden;
}

#player,
#item {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

#player {
  background: #38bdf8;
}

#item {
  background: #fbbf24;
}

#score-board {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 18px;
}

#message {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  font-size: 16px;
  text-align: center;
}
```

## 3. JavaScript の基本ロジック

```js
const player = document.getElementById("player");
const item = document.getElementById("item");
const scoreLabel = document.getElementById("score");
const message = document.getElementById("message");
const container = document.getElementById("game-container");

const state = {
  x: 220,
  y: 160,
  speed: 6,
  score: 0,
  keys: {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  },
};

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

function showMessage(text) {
  message.textContent = text;
  setTimeout(() => {
    if (message.textContent === text) {
      message.textContent = "";
    }
  }, 900);
}

function gameLoop() {
  updatePlayer();
  checkCollision();
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
```

## 4. 発展アイデア

- 障害物を追加して接触判定をつける
- タイマーを設けて制限時間内に何個集められるかを競う
- レベルやステージを分けて徐々に難易度を上げる
- キャラクターにアニメーションや見た目を追加する
- 音声や効果音を入れてゲーム性を高める

## 5. メモ

- 4回目の学習では、ゲームの「動き」「当たり判定」「インタラクション」を中心に理解すると良い。
- `Vibe Coding` の超入門シリーズは、シンプルな実装から段階的に拡張するのが特徴。
- このドキュメントは、学習しながら自分のゲームを組み立てるための基本構成として使う。

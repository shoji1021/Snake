const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const cols = canvas.width / gridSize;
const rows = canvas.height / gridSize;

let snake, food;
let started = false;
let gameLoop;
let score = 0; // 食べた餌の数を記録

document.getElementById('startBtn').onclick = () => startGame();
document.getElementById('continueBtn').onclick = () => backToStart();

function startGame() {
  started = true;
  score = 0; // スコア初期化
  snake = new Snake();
  food = createFood();
  gameLoop = setInterval(draw, 100);

  document.getElementById('startBtn').style.display = 'none';
  document.getElementById('continueBtn').style.display = 'none';
}

function backToStart() {
  started = false;
  clearInterval(gameLoop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById('continueBtn').style.display = 'none';
  document.getElementById('startBtn').style.display = 'inline-block';
}

function createFood() {
  return {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
  };
}

document.addEventListener('keydown', (e) => {
  if (!started) return;
  const k = e.key.toLowerCase();
  if (k === 'w' && snake.ydir !== 1) snake.setDir(0, -1);
  if (k === 's' && snake.ydir !== -1) snake.setDir(0, 1);
  if (k === 'a' && snake.xdir !== 1) snake.setDir(-1, 0);
  if (k === 'd' && snake.xdir !== -1) snake.setDir(1, 0);
});

function draw() {
  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  snake.update();
  snake.show();

  // 食べ物の描画
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  if (snake.eat(food)) {
    score++; // スコア加算
    food = createFood();
  }

  // スコアを左上にリアルタイム表示
  ctx.fillStyle = 'white';
  ctx.font = '16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${score}`, 10, 20);

  if (snake.dead()) {
    clearInterval(gameLoop);
    ctx.fillStyle = 'white';
    ctx.font = '40px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);

    ctx.font = '20px monospace';
    ctx.fillText(`SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 40);

    document.getElementById('continueBtn').style.display = 'inline-block';
  }
}

class Snake {
  constructor() {
    this.body = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
    this.xdir = 1;
    this.ydir = 0;
    this.growNext = false;
  }

  setDir(x, y) {
    this.xdir = x;
    this.ydir = y;
  }

  update() {
    const head = { ...this.body[this.body.length - 1] };
    head.x += this.xdir;
    head.y += this.ydir;
    this.body.push(head);

    if (!this.growNext) {
      this.body.shift();
    } else {
      this.growNext = false;
    }
  }

  show() {
    for (const part of this.body) {
      ctx.fillStyle = 'blue';
      ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    }
  }

  grow() {
    this.growNext = true;
  }

  eat(pos) {
    const head = this.body[this.body.length - 1];
    if (head.x === pos.x && head.y === pos.y) {
      this.grow();
      return true;
    }
    return false;
  }

  dead() {
    const head = this.body[this.body.length - 1];
    if (
      head.x < 0 || head.y < 0 ||
      head.x >= cols || head.y >= rows
    ) return true;

    for (let i = 0; i < this.body.length - 1; i++) {
      const part = this.body[i];
      if (part.x === head.x && part.y === head.y) return true;
    }
    return false;
  }
}
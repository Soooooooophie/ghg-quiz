/**
 * GHG Quiz Game — 溫室氣體盤查搶答系統
 * 後端伺服器：Express + Socket.io
 *
 * 啟動方式：
 *   npm install
 *   node server.js
 *
 * 預設 Port：3000
 * Host 端：http://localhost:3000/host
 * Player 端：http://localhost:3000  （或掃描 QR Code）
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 3000;
const TIMER_SECONDS = 15;   // 每題作答秒數
const BASE_SCORE = 10;      // 答對基礎分
const SPEED_BONUS_MAX = 7;  // 最快答對的速度加成上限

// ─────────────────────────────────────────────
// 題庫（前 10 題，可替換為完整 156 題）
// ─────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    question: '一台柴油發電機於盤查期間內使用了 8 公升的柴油，已知柴油 CO₂ 係數為 2.6，GWP 為 1；CH₄ 係數為 0.00011，GWP 為 27；N₂O 係數為 0.00002，GWP 為 273，其產生多少 KgCO₂e',
    options: { A: '20.8000', B: '0.0238', C: '0.0437', D: '20.8674' },
    answer: 'D'
  },
  {
    id: 2,
    question: '依據 IPCC 發布的 AR6 報告，地球溫度每上升 0.5 度，將對融冰、海平面上升、物種減少造成 10 的多少次方倍影響？',
    options: { A: '2', B: '3', C: '4', D: '5' },
    answer: 'C'
  },
  {
    id: 3,
    question: '政府間氣候變化專門委員會 (IPCC) 在 1988 年由世界氣象組織、聯合國環境署合作成立，英文縮寫為何？',
    options: { A: 'CDP', B: 'WEF', C: 'WHO', D: 'IPCC' },
    answer: 'D'
  },
  {
    id: 4,
    question: '《聯合國氣候變遷綱要公約》締約國每年一次的首腦峰會，討論氣候變化應對方案，英文縮寫為何？',
    options: { A: 'IPCC', B: 'COP', C: 'WEF', D: 'WHO' },
    answer: 'B'
  },
  {
    id: 5,
    question: '全球暖化潛勢以二氧化碳為基準，比較各種溫室氣體在 100 年內對地表增溫的效果，以何種單位共同表示？',
    options: { A: 'CO₂e', B: 'CO₂', C: 'ppm', D: '莫耳' },
    answer: 'A'
  },
  {
    id: 6,
    question: '在全球前七大溫室氣體中，何種方式產生之主要溫室氣體對地球威脅最大且多？',
    options: { A: '燃燒化石燃料', B: '反芻動物與垃圾填埋場排放', C: '冷氣及製冷設備排放', D: '農作物肥料使用排放' },
    answer: 'A'
  },
  {
    id: 7,
    question: '巴黎協議要求 2100 年前，全球溫度上升不超過攝氏幾度（最好控制在 1.5 度內）？',
    options: { A: '5 度', B: '3 度', C: '4 度', D: '2 度' },
    answer: 'D'
  },
  {
    id: 8,
    question: '巴黎協議要求在本世紀末（西元幾年前），將全球平均溫度上升控制在工業革命前水準攝氏 2 度內？',
    options: { A: '2030', B: '2050', C: '2060', D: '2100' },
    answer: 'D'
  },
  {
    id: 9,
    question: '溫度上升是不可逆的變化，除非進行什麼方法，減少大氣中的二氧化碳濃度，才有可能減緩？',
    options: { A: '碳捕捉封存', B: '燃燒氫氣', C: '增加降雨', D: '減少排碳' },
    answer: 'A'
  },
  {
    id: 10,
    question: '何謂「國家自定貢獻 (NDC)」？',
    options: {
      A: '各國發布給國內人民經濟所得的貢獻比例',
      B: '各國要求他國進口商品時須繳交自定碳關稅',
      C: '各國衡量自身能力與經濟發展狀況下訂定合理減碳目標',
      D: '歐盟為各國訂定之合理減碳目標'
    },
    answer: 'C'
  }
];

// ─────────────────────────────────────────────
// 工具函式
// ─────────────────────────────────────────────

/**
 * 生成 4 碼英數混合驗證碼（排除易混淆字元 O/0/I/1）
 */
function generateCode() {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += charset[Math.floor(Math.random() * charset.length)];
  }
  return code;
}

/**
 * 計算速度加成：剩餘時間越多，加分越高
 * timeLeft: 0 ~ TIMER_SECONDS
 */
function calcSpeedBonus(timeLeft) {
  return Math.round((timeLeft / TIMER_SECONDS) * SPEED_BONUS_MAX);
}

// ─────────────────────────────────────────────
// 遊戲狀態
// ─────────────────────────────────────────────
let gameState = {
  status: 'lobby',          // 'lobby' | 'question' | 'revealing' | 'gameover'
  currentQuestionIndex: -1,
  questionStartTime: null,
  timerHandle: null,
};

/**
 * players Map: socketId → playerObj
 * {
 *   id: socketId,
 *   name: string,
 *   score: number,
 *   answered: boolean,
 *   answerChoice: 'A'|'B'|'C'|'D'|null,
 *   answerTime: number|null,   (ms from question start)
 * }
 */
const players = new Map();

/** host socket id（只允許一個 host） */
let hostSocketId = null;

// ─────────────────────────────────────────────
// 靜態檔案（React build 輸出至 public/）
// ─────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback：所有路由（含 /host）一律回傳 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─────────────────────────────────────────────
// Socket.io 事件處理
// ─────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[+] 連線：${socket.id}`);

  // ── HOST 連線 ─────────────────────────────
  socket.on('host:join', () => {
    hostSocketId = socket.id;
    socket.join('host');
    console.log(`[HOST] ${socket.id} 成為主機`);

    // 同步當前狀態給 host
    socket.emit('host:state', {
      status: gameState.status,
      players: serializePlayers(),
      questionIndex: gameState.currentQuestionIndex,
      question: currentQuestion(),
    });
  });

  // ── PLAYER 加入 ───────────────────────────
  socket.on('player:join', ({ name }) => {
    if (!name || typeof name !== 'string') return;
    const trimmed = name.trim().slice(0, 20);
    if (!trimmed) return;

    const player = {
      id: socket.id,
      name: trimmed,
      score: 0,
      answered: false,
      answerChoice: null,
      answerTime: null,
    };
    players.set(socket.id, player);
    socket.join('players');

    console.log(`[JOIN] ${trimmed} (${socket.id})`);

    // 回應玩家：成功加入
    socket.emit('player:joined', {
      name: trimmed,
      status: gameState.status,
      playerCount: players.size,
    });

    // 通知 host 有新玩家
    io.to('host').emit('host:playerList', serializePlayers());
    // 通知所有人玩家數更新
    io.to('players').emit('players:count', players.size);
  });

  // ── HOST：開始遊戲 ────────────────────────
  socket.on('host:startGame', () => {
    if (socket.id !== hostSocketId) return;
    if (players.size === 0) {
      socket.emit('host:error', '至少需要一名玩家才能開始');
      return;
    }
    gameState.currentQuestionIndex = 0;
    gameState.status = 'question';
    broadcastQuestion();
  });

  // ── HOST：下一題 ──────────────────────────
  socket.on('host:nextQuestion', () => {
    if (socket.id !== hostSocketId) return;
    if (gameState.status !== 'revealing') return;

    if (gameState.currentQuestionIndex >= QUESTIONS.length - 1) {
      endGame();
      return;
    }

    gameState.currentQuestionIndex++;
    gameState.status = 'question';
    resetPlayersForNewQuestion();
    broadcastQuestion();
  });

  // ── HOST：公布答案（提前） ─────────────────
  socket.on('host:revealAnswer', () => {
    if (socket.id !== hostSocketId) return;
    if (gameState.status !== 'question') return;
    clearTimeout(gameState.timerHandle);
    revealCurrentAnswer();
  });

  // ── HOST：強制結束遊戲 ────────────────────
  socket.on('host:endGame', () => {
    if (socket.id !== hostSocketId) return;
    clearTimeout(gameState.timerHandle);
    endGame();
  });

  // ── PLAYER：送出答案 ──────────────────────
  socket.on('player:answer', ({ choice }) => {
    if (gameState.status !== 'question') return;
    if (!['A', 'B', 'C', 'D'].includes(choice)) return;

    const player = players.get(socket.id);
    if (!player || player.answered) return;

    const now = Date.now();
    const elapsed = now - gameState.questionStartTime;
    const timeLeft = Math.max(0, TIMER_SECONDS - elapsed / 1000);
    const q = currentQuestion();
    const correct = choice === q.answer;
    const earned = correct ? BASE_SCORE + calcSpeedBonus(timeLeft) : 0;

    player.answered = true;
    player.answerChoice = choice;
    player.answerTime = elapsed;
    player.score += earned;

    console.log(`[ANS] ${player.name}: ${choice} (${correct ? '✓' : '✗'} +${earned})`);

    // 只回應給該玩家
    socket.emit('player:answerResult', {
      choice,
      correct,
      earned,
      totalScore: player.score,
      correctAnswer: q.answer,
    });

    // 更新 host 排行榜
    io.to('host').emit('host:playerList', serializePlayers());

    // 若所有人都已作答，提早公布答案
    const allAnswered = [...players.values()].every(p => p.answered);
    if (allAnswered) {
      clearTimeout(gameState.timerHandle);
      revealCurrentAnswer();
    }
  });

  // ── 斷線處理 ──────────────────────────────
  socket.on('disconnect', () => {
    console.log(`[-] 斷線：${socket.id}`);
    if (socket.id === hostSocketId) {
      hostSocketId = null;
      console.log('[HOST] 主機斷線');
    }
    if (players.has(socket.id)) {
      const p = players.get(socket.id);
      players.delete(socket.id);
      console.log(`[LEAVE] ${p.name} 離開`);
      io.to('host').emit('host:playerList', serializePlayers());
      io.to('players').emit('players:count', players.size);
    }
  });
});

// ─────────────────────────────────────────────
// 遊戲邏輯函式
// ─────────────────────────────────────────────

function currentQuestion() {
  return QUESTIONS[gameState.currentQuestionIndex] ?? null;
}

/** 序列化玩家列表（不含 socketId 細節），依分數排序 */
function serializePlayers() {
  return [...players.values()]
    .map(({ id, name, score, answered, answerChoice }) => ({ id, name, score, answered, answerChoice }))
    .sort((a, b) => b.score - a.score);
}

/** 重置所有玩家的本題作答狀態 */
function resetPlayersForNewQuestion() {
  for (const p of players.values()) {
    p.answered = false;
    p.answerChoice = null;
    p.answerTime = null;
  }
}

/** 廣播題目給所有人，啟動倒數 */
function broadcastQuestion() {
  const q = currentQuestion();
  if (!q) return;

  gameState.questionStartTime = Date.now();

  // 題目資料（不含答案）
  const payload = {
    index: gameState.currentQuestionIndex,
    total: QUESTIONS.length,
    question: q.question,
    options: q.options,
    timer: TIMER_SECONDS,
  };

  io.to('host').emit('host:question', payload);
  io.to('players').emit('player:question', payload);

  console.log(`[Q${gameState.currentQuestionIndex + 1}] 出題：${q.question.slice(0, 30)}...`);

  // 自動計時到期
  gameState.timerHandle = setTimeout(() => {
    revealCurrentAnswer();
  }, TIMER_SECONDS * 1000);
}

/** 公布當題答案，廣播結果與排行榜 */
function revealCurrentAnswer() {
  if (gameState.status !== 'question') return;
  gameState.status = 'revealing';

  const q = currentQuestion();
  const leaderboard = serializePlayers();

  // 統計各選項作答分布
  const distribution = { A: 0, B: 0, C: 0, D: 0 };
  for (const p of players.values()) {
    if (p.answerChoice) distribution[p.answerChoice]++;
  }

  const revealPayload = {
    correctAnswer: q.answer,
    distribution,
    leaderboard,
    isLastQuestion: gameState.currentQuestionIndex >= QUESTIONS.length - 1,
  };

  io.to('host').emit('host:reveal', revealPayload);
  io.to('players').emit('player:reveal', {
    correctAnswer: q.answer,
    leaderboard,
  });

  console.log(`[REVEAL] 答案：${q.answer}`);
}

/** 結算遊戲，發送驗證碼給前三名 */
function endGame() {
  gameState.status = 'gameover';
  clearTimeout(gameState.timerHandle);

  const sorted = serializePlayers(); // 已依分數排序
  const top3 = sorted.slice(0, 3);

  // 為前三名生成驗證碼
  const winnerCodes = top3.map((p, i) => ({
    rank: i + 1,
    id: p.id,
    name: p.name,
    score: p.score,
    code: generateCode(),
  }));

  console.log('[GAME OVER] 最終排名：');
  winnerCodes.forEach(w => console.log(`  #${w.rank} ${w.name} — ${w.score} 分 — 驗證碼：${w.code}`));

  // 廣播給 host：完整排名（含驗證碼）
  io.to('host').emit('host:gameOver', {
    leaderboard: sorted,
    winners: winnerCodes,
  });

  // 分別通知每位玩家結算結果
  for (const [socketId, player] of players.entries()) {
    const rankIndex = sorted.findIndex(p => p.id === player.id);
    const rank = rankIndex + 1;
    const winnerInfo = winnerCodes.find(w => w.id === socketId);

    if (winnerInfo) {
      // 前三名：點對點發送驗證碼
      io.to(socketId).emit('player:gameOver', {
        rank,
        score: player.score,
        isWinner: true,
        code: winnerInfo.code,
        message: `🎉 恭喜獲得第 ${rank} 名！請憑此專屬驗證碼【${winnerInfo.code}】至台前向老師領取獎勵！`,
      });
    } else {
      // 第四名以後：只顯示分數與名次
      io.to(socketId).emit('player:gameOver', {
        rank,
        score: player.score,
        isWinner: false,
        code: null,
        message: '遊戲結束，感謝參與！',
      });
    }
  }
}

// ─────────────────────────────────────────────
// 啟動伺服器
// ─────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   🌍 GHG Quiz Game 伺服器已啟動         ║
║                                          ║
║   主機端（老師）：                       ║
║   http://localhost:${PORT}/host              ║
║                                          ║
║   玩家端（學生）：                       ║
║   http://localhost:${PORT}                   ║
║   或掃描 QR Code 加入                    ║
╚══════════════════════════════════════════╝
  `);
});

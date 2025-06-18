<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Chessboard with AI</title>
  <script src="chess.js"></script>
  <script src="chess_ai.js"></script>
  <style>
     body {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      font-family: sans-serif;
      background-image: url('assets/newcycles.png');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
    }

    .main-container{
      margin-left: -390px;
      margin-top: 60px;   
      display: flex;
      gap: 60px;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }



    .board {
      display: grid;
      grid-template-columns: repeat(8, 60px);
      grid-template-rows: repeat(8, 60px);
      border: 5px solid #222;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      background-color: #1c1c1c;
    }

    .square {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      transition: background-color 0.3s, transform 0.3s;
    }

    .white {
      background-color: #dbc6a5;
    }

    .black {
      background-color: #654166;
    }

    .selected {
      outline: 3px solid #98b808;
      z-index: 1;
    }

     @font-face {
      font-family: 'FunnelDisplay';
      src: url('assets/fonts/FunnelDisplay-Bold.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    .info {
      text-align: center;
      font-size: 20px;
      font-family: 'FunnelDisplay',sans-serif;
      color: #feffff;
    }

    .history {
      margin-top: 20px;
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #ccc;
      padding: 10px;
      width: 300px;
      background: #242222;
      color: #fff9f9;
    }

    .controls {
      margin: 20px 0;
      display: flex;
      gap: 10px;
    }

    button {
      padding: 8px 16px;
      cursor: pointer;
      background: #000000;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
    }

    button:hover {
      background: #4d7eb6;
    }

    .promotion-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border: 2px solid #333;
      border-radius: 5px;
      z-index: 100;
      display: none;
    }

    .promotion-options {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    .promotion-option {
      cursor: pointer;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 3px;
      background: white;
    }

    .promotion-option:hover {
      background-color: #f0f0f0;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 99;
      display: none;
    }

    .square img {
      max-width: 100%;
      max-height: 100%;
      user-select: none;
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div class="main-container">
  <div class="sidebar">
    <div class="controls">
      <button id="undoBtn">Undo</button>
      <button id="redoBtn">Redo</button>
      <button id="resetBtn">Reset Game</button>
    </div>
  
    <div class="history">
      <h4>Move History</h4>
      <ol id="moveHistoryList"></ol>
    </div>
  </div>

   <div>
  <div class="info">
    <span id="status">Status: Ongoing</span>
    <span style="margin-left: 40px;">Current Player: <span id="player">White</span></p>
  </div>
  <div id="chessboard" class="board"></div>
</div>

<div class="overlay" id="promotionOverlay"></div>
<div class="promotion-modal" id="promotionModal">
  <h3>Promote Pawn to:</h3>
  <div class="promotion-options" id="promotionOptions"></div>
</div>

  <script>
    const game = new ChessGame();
    const ai = new ChessAI('b'); // AI is black

    const boardEl = document.getElementById('chessboard');
    const statusEl = document.getElementById('status');
    const playerEl = document.getElementById('player');
    const moveHistoryList = document.getElementById('moveHistoryList');
    const promotionModal = document.getElementById('promotionModal');
    const promotionOverlay = document.getElementById('promotionOverlay');
    const promotionOptions = document.getElementById('promotionOptions');

    let selected = null;

    const getColor = (row, col) => (row + col) % 2 === 0 ? 'white' : 'black';

    const parseBoardState = (state) => {
      const board = [];
      for (let i = 0; i < 8; i++) {
        board.push(state.slice(i * 8, i * 8 + 8).split(''));
      }
      return board;
    };

    const makeAIMove = () => {
      if (game.getCurrentPlayer() === ai.color && !game.isGameOver()) {
        const aiMove = ai.getBestMove(game, 3);
        if (aiMove) {
          game.makeMove(aiMove.fromR, aiMove.fromC, aiMove.toR, aiMove.toC);
          const moveNotation = `${String.fromCharCode(97 + aiMove.fromC)}${8 - aiMove.fromR} → ${String.fromCharCode(97 + aiMove.toC)}${8 - aiMove.toR}`;
          const li = document.createElement('li');
          li.textContent = moveNotation;
          moveHistoryList.appendChild(li);
          renderBoard();
        }
      }
    };

    const showPromotionModal = () => {
      const isWhite = game.getCurrentPlayer() === 'w';
      const pieces = isWhite ? ['Q', 'R', 'B', 'N'] : ['q', 'r', 'b', 'n'];

      promotionOptions.innerHTML = '';
      pieces.forEach(piece => {
        const option = document.createElement('div');
        option.className = 'promotion-option';

        const img = document.createElement('img');
        const color = piece === piece.toUpperCase() ? 'w' : 'b';
        const type = piece.toUpperCase();
        img.src = `assets/pieces/${color}${type}.png`;
        img.alt = piece;
        img.className = 'w-12 h-12 object-contain';
        option.appendChild(img);

        option.onclick = () => {
          game.promotePawn(piece);
          promotionModal.style.display = 'none';
          promotionOverlay.style.display = 'none';
          renderBoard();
          if (game.getCurrentPlayer() === ai.color) {
            setTimeout(makeAIMove, 300);
          }
        };
        promotionOptions.appendChild(option);
      });

      promotionModal.style.display = 'block';
      promotionOverlay.style.display = 'block';
    };

    const renderBoard = () => {
      if (game.pendingPromotion) {
        showPromotionModal();
        return;
      }

      const state = game.getBoardState();
      const board = parseBoardState(state);
      boardEl.innerHTML = '';

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const square = document.createElement('div');
          square.className = `square ${getColor(row, col)}`;
          const piece = board[row][col];

          if (piece !== ' ') {
            const img = document.createElement('img');
            const color = piece === piece.toUpperCase() ? 'w' : 'b';
            const type = piece.toUpperCase();
            img.src = `assets/pieces/${color}${type}.png`;
            img.alt = piece;
            img.className = 'w-full h-full object-contain';
            square.appendChild(img);
          }

          if (selected && selected.row === row && selected.col === col) {
            square.classList.add('selected');
          }

          square.onclick = () => handleSquareClick(row, col);
          boardEl.appendChild(square);
        }
      }

      statusEl.textContent = "Status: " + game.getGameStatus();
      playerEl.textContent = game.getCurrentPlayer() === 'w' ? "White" : "Black";
    };

    const handleSquareClick = (row, col) => {
      if (game.isGameOver() || game.pendingPromotion) return;

      const board = parseBoardState(game.getBoardState());
      const piece = board[row][col];

      if (selected) {
        if (game.makeMove(selected.row, selected.col, row, col)) {
          const moveNotation = `${String.fromCharCode(97 + selected.col)}${8 - selected.row} → ${String.fromCharCode(97 + col)}${8 - row}`;
          const li = document.createElement('li');
          li.textContent = moveNotation;
          moveHistoryList.appendChild(li);

          if (!game.pendingPromotion) {
            selected = null;
            if (game.getCurrentPlayer() === ai.color) {
              setTimeout(makeAIMove, 300);
            }
          }
        } else if (piece !== ' ') {
          selected = { row, col };
        } else {
          selected = null;
        }
      } else if (piece !== ' ') {
        selected = { row, col };
      }

      renderBoard();
    };

    document.getElementById('undoBtn').addEventListener('click', () => {
      if (game.undoMove()) {
        moveHistoryList.removeChild(moveHistoryList.lastChild);
        renderBoard();
      }
    });

    document.getElementById('redoBtn').addEventListener('click', () => {
      if (game.redoMove()) {
        const lastMove = game.undoStack[game.undoStack.length - 1];
        const moveNotation = `${String.fromCharCode(97 + lastMove.fromC)}${8 - lastMove.fromR} → ${String.fromCharCode(97 + lastMove.toC)}${8 - lastMove.toR}`;
        const li = document.createElement('li');
        li.textContent = moveNotation;
        moveHistoryList.appendChild(li);
        renderBoard();
      }
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      game.initialize();
      selected = null;
      moveHistoryList.innerHTML = '';
      renderBoard();
    });

    renderBoard();
  </script>
</body>
</html>

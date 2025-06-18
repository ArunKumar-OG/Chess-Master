class ChessAI {
  constructor(color) {
    this.color = color; // 'w' or 'b'
    this.pieceValues = {
      'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000,
      'p': -100, 'n': -320, 'b': -330, 'r': -500, 'q': -900, 'k': -20000
    };
    this.moveHistory = []; // Track move history to avoid repetition
    this.positionCounts = new Map(); // Track position occurrences
  }

  evaluateBoard(game) {
    let score = 0;
    
    // Material evaluation
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = game.board[row][col];
        if (piece in this.pieceValues) {
          score += this.pieceValues[piece];
        }
      }
    }
    
    // Positional evaluation - add bonuses for good piece placement
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = game.board[row][col];
        if (piece === ' ') continue;
        
        // Center control bonus
        const centerDist = Math.max(Math.abs(3.5 - row), Math.abs(3.5 - col));
        const centerBonus = (4 - centerDist) * 5;
        
        if (piece === piece.toUpperCase()) { // White pieces
          score += centerBonus;
          
          // Pawn structure bonus
          if (piece === 'P') {
            // Bonus for advanced pawns
            score += (6 - row) * 5;
            
            // Bonus for connected pawns
            if (col > 0 && game.board[row][col-1] === 'P') score += 10;
            if (col < 7 && game.board[row][col+1] === 'P') score += 10;
          }
        } else { // Black pieces
          score -= centerBonus;
          
          if (piece === 'p') {
            // Bonus for advanced pawns
            score -= (row - 1) * 5;
            
            // Bonus for connected pawns
            if (col > 0 && game.board[row][col-1] === 'p') score -= 10;
            if (col < 7 && game.board[row][col+1] === 'p') score -= 10;
          }
        }
      }
    }
    
    return this.color === 'w' ? score : -score;
  }

  getBestMove(game, depth) {
    try {
      const legalMoves = game.getLegalMoves();
      if (legalMoves.length === 0) return null;

      // Update position count
      const boardState = game.getBoardState();
      const currentCount = this.positionCounts.get(boardState) || 0;
      this.positionCounts.set(boardState, currentCount + 1);

      // MiniMax with alpha-beta pruning
      const miniMax = (game, depth, isMaximizing, alpha, beta, moveHistory = []) => {
        if (depth === 0 || game.isGameOver()) {
          return this.evaluateBoard(game);
        }

        const currentMoves = game.getLegalMoves();
        
        // Sort moves to improve alpha-beta pruning efficiency
        currentMoves.sort((a, b) => {
          // Try captures first
          const aCapture = game.board[b.toR][b.toC] !== ' ' ? 1 : 0;
          const bCapture = game.board[a.toR][a.toC] !== ' ' ? 1 : 0;
          return bCapture - aCapture;
        });

        if (isMaximizing) {
          let maxEval = -Infinity;
          for (const move of currentMoves) {
            const gameCopy = this.makeMoveCopy(game, move);
            
            // Avoid repeating positions
            const newBoardState = gameCopy.getBoardState();
            if ((this.positionCounts.get(newBoardState) || 0) >= 2) {
              continue; // Skip moves that lead to repeated positions
            }
            
            const evaluation = miniMax(gameCopy, depth - 1, false, alpha, beta, [...moveHistory, move]);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
          }
          return maxEval;
        } else {
          let minEval = Infinity;
          for (const move of currentMoves) {
            const gameCopy = this.makeMoveCopy(game, move);
            
            // Avoid repeating positions
            const newBoardState = gameCopy.getBoardState();
            if ((this.positionCounts.get(newBoardState) || 0) >= 2) {
              continue; // Skip moves that lead to repeated positions
            }
            
            const evaluation = miniMax(gameCopy, depth - 1, true, alpha, beta, [...moveHistory, move]);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
          }
          return minEval;
        }
      };

      // Find best move with additional criteria
      let bestMove = null;
      let bestValue = this.color === 'w' ? -Infinity : Infinity;
      let candidateMoves = [];

      for (const move of legalMoves) {
        const gameCopy = this.makeMoveCopy(game, move);
        
        // Skip moves that lead to repeated positions
        const newBoardState = gameCopy.getBoardState();
        if ((this.positionCounts.get(newBoardState) || 0) >= 2) {
          continue;
        }
        
        const moveValue = miniMax(gameCopy, depth - 1, this.color === 'b', -Infinity, Infinity);
        
        // Collect all candidate moves with their values
        candidateMoves.push({ move, value: moveValue });
      }

      if (candidateMoves.length === 0) {
        // If all moves lead to repetition, pick one randomly
        return legalMoves[Math.floor(Math.random() * legalMoves.length)];
      }

      // Sort candidate moves by value
      candidateMoves.sort((a, b) => 
        this.color === 'w' ? b.value - a.value : a.value - b.value
      );

      // Pick from top 3 moves to add variety
      const topMoves = candidateMoves.slice(0, 3);
      bestMove = topMoves[Math.floor(Math.random() * topMoves.length)].move;

      if (bestMove) {
        // Handle pawn promotion - don't always promote to queen
        const piece = game.board[bestMove.fromR][bestMove.fromC];
        const isPawn = piece.toUpperCase() === 'P';
        const isPromotion = isPawn && (bestMove.toR === 0 || bestMove.toR === 7);
        
        let promotedTo = null;
        if (isPromotion) {
          // 80% chance to promote to queen, 20% to other pieces
          const rand = Math.random();
          if (this.color === 'w') {
            promotedTo = rand < 0.8 ? 'Q' : ['R', 'B', 'N'][Math.floor((rand - 0.8) * 3 / 0.2)];
          } else {
            promotedTo = rand < 0.8 ? 'q' : ['r', 'b', 'n'][Math.floor((rand - 0.8) * 3 / 0.2)];
          }
        }

        return {
          fromR: bestMove.fromR,
          fromC: bestMove.fromC,
          toR: bestMove.toR,
          toC: bestMove.toC,
          promotedTo: promotedTo
        };
      }
      return null;
    } catch (error) {
      console.error("AI error:", error);
      return null;
    }
  }

  makeMoveCopy(game, move) {
    const gameCopy = new ChessGame();
    gameCopy.board = JSON.parse(JSON.stringify(game.board));
    gameCopy.currentPlayer = game.currentPlayer;
    gameCopy.moveHistory = [...game.moveHistory];
    gameCopy.undoStack = [...game.undoStack];
    gameCopy.redoStack = [...game.redoStack];
    
    // Handle promotion in the copy if needed
    const piece = gameCopy.board[move.fromR][move.fromC];
    const isPawn = piece.toUpperCase() === 'P';
    const isPromotion = isPawn && (move.toR === 0 || move.toR === 7);
    
    let promotionPiece = null;
    if (isPromotion) {
      promotionPiece = piece === piece.toUpperCase() ? 'Q' : 'q';
    }
    
    gameCopy.executeMove(move.fromR, move.fromC, move.toR, move.toC, promotionPiece);
    return gameCopy;
  }
}

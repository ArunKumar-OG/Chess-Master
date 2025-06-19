class ChessAI {
  constructor(color) {
    this.color = color; 
    this.pieceValues = {
      'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000,
      'p': -100, 'n': -320, 'b': -330, 'r': -500, 'q': -900, 'k': -20000
    };
    this.moveHistory = [];
    this.positionCounts = new Map(); 
  }

  evaluateBoard(game) {
    let score = 0;
    
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = game.board[row][col];
        if (piece in this.pieceValues) {
          score += this.pieceValues[piece];
        }
      }
    }
    
 
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = game.board[row][col];
        if (piece === ' ') continue;
        
        
        const centerDist = Math.max(Math.abs(3.5 - row), Math.abs(3.5 - col));
        const centerBonus = (4 - centerDist) * 5;
        
        if (piece === piece.toUpperCase()) { 
          score += centerBonus;
          
         
          if (piece === 'P') {
            
            score += (6 - row) * 5;
            
           
            if (col > 0 && game.board[row][col-1] === 'P') score += 10;
            if (col < 7 && game.board[row][col+1] === 'P') score += 10;
          }
        } else { 
          score -= centerBonus;
          
          if (piece === 'p') {
            
            score -= (row - 1) * 5;
            
            
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
        
       
        currentMoves.sort((a, b) => {
        
          const aCapture = game.board[b.toR][b.toC] !== ' ' ? 1 : 0;
          const bCapture = game.board[a.toR][a.toC] !== ' ' ? 1 : 0;
          return bCapture - aCapture;
        });

        if (isMaximizing) {
          let maxEval = -Infinity;
          for (const move of currentMoves) {
            const gameCopy = this.makeMoveCopy(game, move);
            
            
            const newBoardState = gameCopy.getBoardState();
            if ((this.positionCounts.get(newBoardState) || 0) >= 2) {
              continue; 
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
            
            
            const newBoardState = gameCopy.getBoardState();
            if ((this.positionCounts.get(newBoardState) || 0) >= 2) {
              continue; 
            }
            
            const evaluation = miniMax(gameCopy, depth - 1, true, alpha, beta, [...moveHistory, move]);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
          }
          return minEval;
        }
      };

      
      let bestMove = null;
      let bestValue = this.color === 'w' ? -Infinity : Infinity;
      let candidateMoves = [];

      for (const move of legalMoves) {
        const gameCopy = this.makeMoveCopy(game, move);
        
       
        const newBoardState = gameCopy.getBoardState();
        if ((this.positionCounts.get(newBoardState) || 0) >= 2) {
          continue;
        }
        
        const moveValue = miniMax(gameCopy, depth - 1, this.color === 'b', -Infinity, Infinity);
        
       
        candidateMoves.push({ move, value: moveValue });
      }

      if (candidateMoves.length === 0) {
        
        return legalMoves[Math.floor(Math.random() * legalMoves.length)];
      }

    
      candidateMoves.sort((a, b) => 
        this.color === 'w' ? b.value - a.value : a.value - b.value
      );

      
      const topMoves = candidateMoves.slice(0, 3);
      bestMove = topMoves[Math.floor(Math.random() * topMoves.length)].move;

      if (bestMove) {
       
        const piece = game.board[bestMove.fromR][bestMove.fromC];
        const isPawn = piece.toUpperCase() === 'P';
        const isPromotion = isPawn && (bestMove.toR === 0 || bestMove.toR === 7);
        
        let promotedTo = null;
        if (isPromotion) {
       
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

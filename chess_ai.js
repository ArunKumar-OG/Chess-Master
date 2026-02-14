class ChessAI {
  constructor(color) {
<<<<<<< HEAD
    this.color = color; 
    this.pieceValues = {
      'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000,
      'p': -100, 'n': -320, 'b': -330, 'r': -500, 'q': -900, 'k': -20000
    };
    this.moveHistory = [];
    this.positionCounts = new Map(); 
=======
    this.color = color; // 'w' or 'b'
    this.pieceValues = {
      'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 200,
      'p': -100, 'n': -320, 'b': -330, 'r': -500, 'q': -900, 'k': -200
      };
    this.moveHistory = []; // Track move history to avoid repetition
    this.positionCounts = new Map(); // Track position occurrences
>>>>>>> 5082604 (Initial commit)
  }

  evaluateBoard(game) {
    let score = 0;
    
<<<<<<< HEAD
    
=======
    // Material evaluation
>>>>>>> 5082604 (Initial commit)
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = game.board[row][col];
        if (piece in this.pieceValues) {
          score += this.pieceValues[piece];
        }
      }
    }
    
<<<<<<< HEAD
 
=======
    // Positional evaluation - add bonuses for good piece placement
>>>>>>> 5082604 (Initial commit)
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = game.board[row][col];
        if (piece === ' ') continue;
        
<<<<<<< HEAD
        
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
            
            
=======
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
>>>>>>> 5082604 (Initial commit)
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
        
<<<<<<< HEAD
       
        currentMoves.sort((a, b) => {
        
=======
        // Sort moves to improve alpha-beta pruning efficiency
        currentMoves.sort((a, b) => {
          // Try captures first
>>>>>>> 5082604 (Initial commit)
          const aCapture = game.board[b.toR][b.toC] !== ' ' ? 1 : 0;
          const bCapture = game.board[a.toR][a.toC] !== ' ' ? 1 : 0;
          return bCapture - aCapture;
        });

        if (isMaximizing) {
          let maxEval = -Infinity;
          for (const move of currentMoves) {
            const gameCopy = this.makeMoveCopy(game, move);
            
<<<<<<< HEAD
            
            const newBoardState = gameCopy.getBoardState();
            if ((this.positionCounts.get(newBoardState) || 0) >= 2) {
              continue; 
=======
            // Avoid repeating positions
            const newBoardState = gameCopy.getBoardState();
            if ((this.positionCounts.get(newBoardState) || 0) >= 2) {
              continue; // Skip moves that lead to repeated positions
>>>>>>> 5082604 (Initial commit)
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
            
<<<<<<< HEAD
            
            const newBoardState = gameCopy.getBoardState();
            if ((this.positionCounts.get(newBoardState) || 0) >= 2) {
              continue; 
=======
            // Avoid repeating positions
            const newBoardState = gameCopy.getBoardState();
            if ((this.positionCounts.get(newBoardState) || 0) >= 2) {
              continue; // Skip moves that lead to repeated positions
>>>>>>> 5082604 (Initial commit)
            }
            
            const evaluation = miniMax(gameCopy, depth - 1, true, alpha, beta, [...moveHistory, move]);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
          }
          return minEval;
        }
      };

<<<<<<< HEAD
      
=======
      // Find best move with additional criteria
>>>>>>> 5082604 (Initial commit)
      let bestMove = null;
      let bestValue = this.color === 'w' ? -Infinity : Infinity;
      let candidateMoves = [];

      for (const move of legalMoves) {
        const gameCopy = this.makeMoveCopy(game, move);
        
<<<<<<< HEAD
       
=======
        // Skip moves that lead to repeated positions
>>>>>>> 5082604 (Initial commit)
        const newBoardState = gameCopy.getBoardState();
        if ((this.positionCounts.get(newBoardState) || 0) >= 2) {
          continue;
        }
        
        const moveValue = miniMax(gameCopy, depth - 1, this.color === 'b', -Infinity, Infinity);
        
<<<<<<< HEAD
       
=======
        // Collect all candidate moves with their values
>>>>>>> 5082604 (Initial commit)
        candidateMoves.push({ move, value: moveValue });
      }

      if (candidateMoves.length === 0) {
<<<<<<< HEAD
        
        return legalMoves[Math.floor(Math.random() * legalMoves.length)];
      }

    
=======
        // If all moves lead to repetition, pick one randomly
        return legalMoves[Math.floor(Math.random() * legalMoves.length)];
      }

      // Sort candidate moves by value
>>>>>>> 5082604 (Initial commit)
      candidateMoves.sort((a, b) => 
        this.color === 'w' ? b.value - a.value : a.value - b.value
      );

<<<<<<< HEAD
      
=======
      // Pick from top 3 moves to add variety
>>>>>>> 5082604 (Initial commit)
      const topMoves = candidateMoves.slice(0, 3);
      bestMove = topMoves[Math.floor(Math.random() * topMoves.length)].move;

      if (bestMove) {
<<<<<<< HEAD
       
=======
        // Handle pawn promotion - don't always promote to queen
>>>>>>> 5082604 (Initial commit)
        const piece = game.board[bestMove.fromR][bestMove.fromC];
        const isPawn = piece.toUpperCase() === 'P';
        const isPromotion = isPawn && (bestMove.toR === 0 || bestMove.toR === 7);
        
        let promotedTo = null;
        if (isPromotion) {
<<<<<<< HEAD
       
=======
          // 80% chance to promote to queen, 20% to other pieces
>>>>>>> 5082604 (Initial commit)
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
    
<<<<<<< HEAD
   
=======
    // Handle promotion in the copy if needed
>>>>>>> 5082604 (Initial commit)
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 5082604 (Initial commit)

class ChessGame {
  constructor() {
    this.SIZE = 8;
    this.board = Array.from({ length: this.SIZE }, () => Array(this.SIZE).fill(' '));
    this.currentPlayer = 'w';
    this.moveHistory = [];
    this.undoStack = [];
    this.redoStack = [];
    this.pendingPromotion = null;
    this.initialize();
  }

  initialize() {
    this.board[0] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    this.board[1] = Array(this.SIZE).fill('p');
    this.board[6] = Array(this.SIZE).fill('P');
    this.board[7] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
    for (let i = 2; i <= 5; i++) this.board[i] = Array(this.SIZE).fill(' ');
    this.moveHistory = [];
    this.undoStack = [];
    this.redoStack = [];
    this.currentPlayer = 'w';
    this.pendingPromotion = null;
  }

  getBoardState() {
    return this.board.flat().join('');
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  isGameOver() {
    return this.getGameStatus() === "Checkmate" || this.getGameStatus() === "Stalemate";
  }

  isPathClear(fromR, fromC, toR, toC) {
    const rowStep = toR > fromR ? 1 : (toR < fromR ? -1 : 0);
    const colStep = toC > fromC ? 1 : (toC < fromC ? -1 : 0);
    let r = fromR + rowStep;
    let c = fromC + colStep;
    while (r !== toR || c !== toC) {
      if (this.board[r][c] !== ' ') return false;
      r += rowStep;
      c += colStep;
    }
    return true;
  }

  isSameColorPiece(r, c, player) {
    const piece = this.board[r][c];
    if (piece === ' ') return false;
    return (player === 'w') ? piece === piece.toUpperCase() : piece === piece.toLowerCase();
  }

  moveCheck(fromR, fromC, toR, toC, player) {
    const piece = this.board[fromR][fromC];
    if (piece === ' ' ||
        (player === 'w' && piece !== piece.toUpperCase()) ||
        (player === 'b' && piece !== piece.toLowerCase()) ||
        this.isSameColorPiece(toR, toC, player)) return false;
    const type = piece.toUpperCase();
    if (type === 'R' && (fromR === toR || fromC === toC)) return this.isPathClear(fromR, fromC, toR, toC);
    if (type === 'N' && ((Math.abs(fromR - toR) === 2 && Math.abs(fromC - toC) === 1) ||
                         (Math.abs(fromR - toR) === 1 && Math.abs(fromC - toC) === 2))) return true;
    if (type === 'B' && Math.abs(fromR - toR) === Math.abs(fromC - toC)) return this.isPathClear(fromR, fromC, toR, toC);
    if (type === 'Q' && ((fromR === toR || fromC === toC) ||
                         Math.abs(fromR - toR) === Math.abs(fromC - toC))) return this.isPathClear(fromR, fromC, toR, toC);
    if (type === 'K' && Math.abs(fromR - toR) <= 1 && Math.abs(fromC - toC) <= 1) return true;
    if (type === 'P') {
      const dir = piece === piece.toUpperCase() ? -1 : 1;
      if (fromC === toC && this.board[toR][toC] === ' ') {
        if (toR === fromR + dir) return true;
        if ((piece === piece.toUpperCase() && fromR === 6 && toR === 4) ||
            (piece === piece.toLowerCase() && fromR === 1 && toR === 3))
          return this.board[fromR + dir][fromC] === ' ';
      }
      if (Math.abs(fromC - toC) === 1 && toR === fromR + dir)
        return this.board[toR][toC] !== ' ' &&
               ((piece === piece.toUpperCase() && this.board[toR][toC] === this.board[toR][toC].toLowerCase()) ||
                (piece === piece.toLowerCase() && this.board[toR][toC] === this.board[toR][toC].toUpperCase()));
    }
    return false;
  }

  makeMove(fromR, fromC, toR, toC) {
    if (!this.moveCheck(fromR, fromC, toR, toC, this.currentPlayer)) return false;
    
    const piece = this.board[fromR][fromC];
    const isPawn = piece.toUpperCase() === 'P';
    const isPromotionMove = isPawn && (toR === 0 || toR === 7);
    
    if (isPromotionMove) {
      this.pendingPromotion = {
        fromR, fromC, toR, toC,
        movedPiece: piece,
        capturedPiece: this.board[toR][toC],
        previousState: JSON.parse(JSON.stringify(this.board)),
        previousPlayer: this.currentPlayer
      };
      return true;
    }
    
    return this.executeMove(fromR, fromC, toR, toC);
  }

  executeMove(fromR, fromC, toR, toC, promotionPiece = null) {
    const boardCopy = JSON.parse(JSON.stringify(this.board));
    const playerCopy = this.currentPlayer;
    
    const move = { 
      fromR, fromC, toR, toC, 
      movedPiece: this.board[fromR][fromC], 
      capturedPiece: this.board[toR][toC],
      previousState: boardCopy,
      previousPlayer: playerCopy,
      promotion: promotionPiece
    };
    
    this.board[toR][toC] = promotionPiece || this.board[fromR][fromC];
    this.board[fromR][fromC] = ' ';
    this.currentPlayer = this.currentPlayer === 'w' ? 'b' : 'w';
    
    if (this.isInCheck(this.currentPlayer === 'w' ? 'b' : 'w')) {
      this.board = boardCopy;
      this.currentPlayer = playerCopy;
      return false;
    }
    
    this.moveHistory.push(move);
    this.undoStack.push(move);
    this.redoStack = [];
    return true;
  }

  promotePawn(pieceType) {
    if (!this.pendingPromotion) return false;
    
    const validPieces = this.pendingPromotion.previousPlayer === 'w' 
      ? ['Q', 'R', 'B', 'N'] 
      : ['q', 'r', 'b', 'n'];
    
    if (!validPieces.includes(pieceType)) return false;
    
    const { fromR, fromC, toR, toC } = this.pendingPromotion;
    const success = this.executeMove(fromR, fromC, toR, toC, pieceType);
    
    if (success) {
      this.pendingPromotion = null;
      return true;
    }
    return false;
  }

  undoMove() {
    if (this.undoStack.length === 0) return false;
    
    const move = this.undoStack.pop();
    this.redoStack.push({
      fromR: move.fromR,
      fromC: move.fromC,
      toR: move.toR,
      toC: move.toC,
      movedPiece: move.movedPiece,
      capturedPiece: move.capturedPiece,
      previousState: JSON.parse(JSON.stringify(this.board)),
      previousPlayer: this.currentPlayer,
      promotion: move.promotion
    });
    
    this.board = move.previousState;
    this.currentPlayer = move.previousPlayer;
    this.pendingPromotion = null;
    return true;
  }

  redoMove() {
    if (this.redoStack.length === 0) return false;
    
    const move = this.redoStack.pop();
    this.undoStack.push({
      fromR: move.fromR,
      fromC: move.fromC,
      toR: move.toR,
      toC: move.toC,
      movedPiece: move.movedPiece,
      capturedPiece: move.capturedPiece,
      previousState: JSON.parse(JSON.stringify(this.board)),
      previousPlayer: this.currentPlayer,
      promotion: move.promotion
    });
    
    this.board[move.toR][move.toC] = move.promotion || move.movedPiece;
    this.board[move.fromR][move.fromC] = ' ';
    this.currentPlayer = this.currentPlayer === 'w' ? 'b' : 'w';
    return true;
  }

  isInCheck(player) {
    let kingR = -1, kingC = -1;
    const king = player === 'w' ? 'K' : 'k';
    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        if (this.board[r][c] === king) {
          kingR = r;
          kingC = c;
          break;
        }
      }
      if (kingR !== -1) break;
    }
    
    const opp = player === 'w' ? 'b' : 'w';
    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        const piece = this.board[r][c];
        if ((opp === 'w' && piece === piece.toUpperCase()) ||
            (opp === 'b' && piece === piece.toLowerCase())) {
          if (this.moveCheck(r, c, kingR, kingC, opp)) return true;
        }
      }
    }
    return false;
  }

  hasLegalMoves(player) {
    for (let fromR = 0; fromR < this.SIZE; fromR++) {
      for (let fromC = 0; fromC < this.SIZE; fromC++) {
        const piece = this.board[fromR][fromC];
        if ((player === 'w' && piece === piece.toUpperCase()) ||
            (player === 'b' && piece === piece.toLowerCase())) {
          for (let toR = 0; toR < this.SIZE; toR++) {
            for (let toC = 0; toC < this.SIZE; toC++) {
              if (this.moveCheck(fromR, fromC, toR, toC, player)) {
                const backupFrom = this.board[fromR][fromC];
                const backupTo = this.board[toR][toC];
                this.board[toR][toC] = backupFrom;
                this.board[fromR][fromC] = ' ';
                const inCheck = this.isInCheck(player);
                this.board[fromR][fromC] = backupFrom;
                this.board[toR][toC] = backupTo;
                if (!inCheck) return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  getGameStatus() {
    const inCheck = this.isInCheck(this.currentPlayer);
    const hasMoves = this.hasLegalMoves(this.currentPlayer);
    
    if (!hasMoves) {
      return inCheck ? "Checkmate" : "Stalemate";
    }
    return inCheck ? "Check" : "Ongoing";
  }
  
}
class ChessGame {
  constructor() {
    this.SIZE = 8;
    this.board = Array.from({ length: this.SIZE }, () => Array(this.SIZE).fill(' '));
    this.currentPlayer = 'w';
    this.moveHistory = [];
    this.undoStack = [];
    this.redoStack = [];
    this.pendingPromotion = null;
<<<<<<< HEAD
    this.initialize();
  }

  initialize() {
=======
    this.enPassantTarget = null;
    this.castlingRights = {
      w: { kingside: true, queenside: true },
      b: { kingside: true, queenside: true }
    };
    this.initialize();
  }

initialize() {
>>>>>>> 5082604 (Initial commit)
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
<<<<<<< HEAD
=======
    this.enPassantTarget = null;
    this.castlingRights = {
      w: { kingside: true, queenside: true },
      b: { kingside: true, queenside: true }
    };
>>>>>>> 5082604 (Initial commit)
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
<<<<<<< HEAD
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
=======
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

  if (type === 'K') {
    if (Math.abs(fromR - toR) <= 1 && Math.abs(fromC - toC) <= 1) return true;
    if (Math.abs(fromC - toC) === 2 && fromR === toR) {
      return this.canCastle(fromR, fromC, toR, toC, player);
    }
  }

  if (type === 'P') {
    const dir = piece === piece.toUpperCase() ? -1 : 1;
    const startRow = piece === piece.toUpperCase() ? 6 : 1;

    // Forward move
    if (fromC === toC && this.board[toR][toC] === ' ') {
      if (toR === fromR + dir) return true;
      if (fromR === startRow && toR === fromR + 2 * dir) {
        return this.board[fromR + dir][fromC] === ' ' && this.board[toR][toC] === ' ';
      }
    }

    // En Passant
    if (
      Math.abs(fromC - toC) === 1 &&
      toR === fromR + dir &&
      this.board[toR][toC] === ' ' &&
      this.enPassantTarget &&
      this.enPassantTarget.row === toR &&
      this.enPassantTarget.col === toC
    ) {
      return true;
    }

    // Diagonal capture
    if (Math.abs(fromC - toC) === 1 && toR === fromR + dir) {
      if (this.board[toR][toC] !== ' ') {
        return (
          (piece === piece.toUpperCase() && this.board[toR][toC] === this.board[toR][toC].toLowerCase()) ||
          (piece === piece.toLowerCase() && this.board[toR][toC] === this.board[toR][toC].toUpperCase())
        );
      }
    }
  }

  return false;
}

      

  canCastle(fromR, fromC, toR, toC, player) {
    const isKingside = toC > fromC;
    if (!this.castlingRights[player][isKingside ? 'kingside' : 'queenside']) {
      return false;
    }

    const step = isKingside ? 1 : -1;
    let c = fromC + step;
    const targetC = isKingside ? 7 : 0;

    while (c !== targetC) {
      if (this.board[fromR][c] !== ' ') return false;
      c += step;
    }

    if (this.board[fromR][targetC].toUpperCase() !== 'R') return false;

    const opponent = player === 'w' ? 'b' : 'w';
    c = fromC;
    const stepsToCheck = isKingside ? 3 : 2;

    for (let i = 0; i < stepsToCheck; i++) {
      if (this.isSquareUnderAttack(fromR, c, opponent)) return false;
      c += step;
    }

    return true;
  }

  isSquareUnderAttack(row, col, byPlayer) {
    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        const piece = this.board[r][c];
        if (piece !== ' ' &&
          ((byPlayer === 'w' && piece === piece.toUpperCase()) ||
            (byPlayer === 'b' && piece === piece.toLowerCase()))) {
          if (this.moveCheck(r, c, row, col, byPlayer)) {
            return true;
          }
        }
      }
>>>>>>> 5082604 (Initial commit)
    }
    return false;
  }

  makeMove(fromR, fromC, toR, toC) {
    if (!this.moveCheck(fromR, fromC, toR, toC, this.currentPlayer)) return false;
<<<<<<< HEAD
    
    const piece = this.board[fromR][fromC];
    const isPawn = piece.toUpperCase() === 'P';
    const isPromotionMove = isPawn && (toR === 0 || toR === 7);
    
=======

    const piece = this.board[fromR][fromC];
    this.enPassantTarget = null;
if (piece.toUpperCase() === 'P' && Math.abs(toR - fromR) === 2) {
  this.enPassantTarget = {
    row: (fromR + toR) / 2,
    col: fromC
  };
}


    const isPawn = piece.toUpperCase() === 'P';
    const isKing = piece.toUpperCase() === 'K';
    const isRook = piece.toUpperCase() === 'R';
    const isPromotionMove = isPawn && (toR === 0 || toR === 7);

    if (isKing && Math.abs(fromC - toC) === 2) {
      return this.executeCastle(fromR, fromC, toR, toC);
    }

>>>>>>> 5082604 (Initial commit)
    if (isPromotionMove) {
      this.pendingPromotion = {
        fromR, fromC, toR, toC,
        movedPiece: piece,
        capturedPiece: this.board[toR][toC],
        previousState: JSON.parse(JSON.stringify(this.board)),
<<<<<<< HEAD
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
    
=======
        previousPlayer: this.currentPlayer,
        previousCastling: JSON.parse(JSON.stringify(this.castlingRights))
      };
      return true;
    }

    if (isKing) {
      this.castlingRights[this.currentPlayer].kingside = false;
      this.castlingRights[this.currentPlayer].queenside = false;
    }
    if (isRook) {
      if (fromC === 0) this.castlingRights[this.currentPlayer].queenside = false;
      if (fromC === 7) this.castlingRights[this.currentPlayer].kingside = false;
    }

    return this.executeMove(fromR, fromC, toR, toC);
  }

  executeCastle(fromR, fromC, toR, toC) {
    const isKingside = toC > fromC;
    const rookFromC = isKingside ? 7 : 0;
    const rookToC = isKingside ? 5 : 3;

    const boardCopy = JSON.parse(JSON.stringify(this.board));
    const playerCopy = this.currentPlayer;
    const castlingCopy = JSON.parse(JSON.stringify(this.castlingRights));

    this.board[toR][toC] = this.board[fromR][fromC];
    this.board[fromR][fromC] = ' ';

    this.board[toR][rookToC] = this.board[toR][rookFromC];
    this.board[toR][rookFromC] = ' ';

    this.castlingRights[this.currentPlayer].kingside = false;
    this.castlingRights[this.currentPlayer].queenside = false;

    this.currentPlayer = this.currentPlayer === 'w' ? 'b' : 'w';

    if (this.isInCheck(this.currentPlayer === 'w' ? 'b' : 'w')) {
      this.board = boardCopy;
      this.currentPlayer = playerCopy;
      this.castlingRights = castlingCopy;
      return false;
    }

    const move = {
      fromR, fromC, toR, toC,
      movedPiece: boardCopy[fromR][fromC],
      capturedPiece: ' ',
      previousState: boardCopy,
      previousPlayer: playerCopy,
      previousCastling: castlingCopy,
      isCastle: true,
      rookFromR: fromR,
      rookFromC,
      rookToR: fromR,
      rookToC
    };

>>>>>>> 5082604 (Initial commit)
    this.moveHistory.push(move);
    this.undoStack.push(move);
    this.redoStack = [];
    return true;
  }

<<<<<<< HEAD
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
    
=======




executeMove(fromR, fromC, toR, toC) {
  const boardCopy = JSON.parse(JSON.stringify(this.board));
  const playerCopy = this.currentPlayer;
  const castlingCopy = JSON.parse(JSON.stringify(this.castlingRights));

  let movedPiece = this.board[fromR][fromC];
  let capturedPiece = this.board[toR][toC];
  let isEnPassantCapture = false;

  // 🟨 En Passant Check
  if (
    movedPiece.toUpperCase() === 'P' &&
    this.enPassantTarget &&
    toR === this.enPassantTarget.row &&
    toC === this.enPassantTarget.col &&
    this.board[toR][toC] === ' '
  ) {
    isEnPassantCapture = true;
    capturedPiece = this.board[fromR][toC]; // the pawn being captured
    this.board[fromR][toC] = ' '; // remove it
  }

  this.board[toR][toC] = movedPiece;
  this.board[fromR][fromC] = ' ';

  this.enPassantTarget = null;
  this.currentPlayer = this.currentPlayer === 'w' ? 'b' : 'w';

  if (this.isInCheck(playerCopy)) {
    this.board = boardCopy;
    this.currentPlayer = playerCopy;
    this.castlingRights = castlingCopy;
    return false;
  }

  const move = {
    fromR, fromC, toR, toC,
    movedPiece,
    capturedPiece,
    enPassant: isEnPassantCapture,
    previousState: boardCopy,
    previousPlayer: playerCopy,
    previousCastling: castlingCopy
  };

  this.moveHistory.push(move);
  this.undoStack.push(move);
  this.redoStack = [];
  return true;
}


  undoMove() {
    if (this.undoStack.length === 0) return false;

>>>>>>> 5082604 (Initial commit)
    const move = this.undoStack.pop();
    this.redoStack.push({
      fromR: move.fromR,
      fromC: move.fromC,
      toR: move.toR,
      toC: move.toC,
<<<<<<< HEAD
      movedPiece: move.movedPiece,
      capturedPiece: move.capturedPiece,
      previousState: JSON.parse(JSON.stringify(this.board)),
      previousPlayer: this.currentPlayer,
      promotion: move.promotion
    });
    
    this.board = move.previousState;
    this.currentPlayer = move.previousPlayer;
    this.pendingPromotion = null;
=======
      movedPiece: this.board[move.toR][move.toC],
      capturedPiece: move.capturedPiece,
      previousState: JSON.parse(JSON.stringify(this.board)),
      previousPlayer: this.currentPlayer,
      previousCastling: JSON.parse(JSON.stringify(this.castlingRights))
    });

    // Restore the board state
    this.board = JSON.parse(JSON.stringify(move.previousState));
    this.currentPlayer = move.previousPlayer;
    this.castlingRights = JSON.parse(JSON.stringify(move.previousCastling));

>>>>>>> 5082604 (Initial commit)
    return true;
  }

  redoMove() {
    if (this.redoStack.length === 0) return false;
<<<<<<< HEAD
    
=======

>>>>>>> 5082604 (Initial commit)
    const move = this.redoStack.pop();
    this.undoStack.push({
      fromR: move.fromR,
      fromC: move.fromC,
      toR: move.toR,
      toC: move.toC,
<<<<<<< HEAD
      movedPiece: move.movedPiece,
      capturedPiece: move.capturedPiece,
      previousState: JSON.parse(JSON.stringify(this.board)),
      previousPlayer: this.currentPlayer,
      promotion: move.promotion
    });
    
    this.board[move.toR][move.toC] = move.promotion || move.movedPiece;
    this.board[move.fromR][move.fromC] = ' ';
    this.currentPlayer = this.currentPlayer === 'w' ? 'b' : 'w';
=======
      movedPiece: this.board[move.toR][move.toC],
      capturedPiece: move.capturedPiece,
      previousState: JSON.parse(JSON.stringify(this.board)),
      previousPlayer: this.currentPlayer,
      previousCastling: JSON.parse(JSON.stringify(this.castlingRights))
    });

    // Execute the move again
    this.board[move.toR][move.toC] = move.movedPiece;
    this.board[move.fromR][move.fromC] = ' ';
    this.currentPlayer = this.currentPlayer === 'w' ? 'b' : 'w';

>>>>>>> 5082604 (Initial commit)
    return true;
  }

  isInCheck(player) {
    let kingR = -1, kingC = -1;
<<<<<<< HEAD
    const king = player === 'w' ? 'K' : 'k';
=======
    const king = player === 'w' ? 'K' : 'k'
>>>>>>> 5082604 (Initial commit)
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
<<<<<<< HEAD
    
=======

>>>>>>> 5082604 (Initial commit)
    const opp = player === 'w' ? 'b' : 'w';
    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        const piece = this.board[r][c];
        if ((opp === 'w' && piece === piece.toUpperCase()) ||
<<<<<<< HEAD
            (opp === 'b' && piece === piece.toLowerCase())) {
=======
          (opp === 'b' && piece === piece.toLowerCase())) {
>>>>>>> 5082604 (Initial commit)
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
<<<<<<< HEAD
            (player === 'b' && piece === piece.toLowerCase())) {
=======
          (player === 'b' && piece === piece.toLowerCase())) {
>>>>>>> 5082604 (Initial commit)
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

<<<<<<< HEAD
  getGameStatus() {
    const inCheck = this.isInCheck(this.currentPlayer);
    const hasMoves = this.hasLegalMoves(this.currentPlayer);
    
=======
  getLegalMoves() {
    const moves = [];
    const player = this.currentPlayer;
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

                if (!inCheck) {
                  moves.push({ fromR, fromC, toR, toC });
                }
              }
            }
          }
        }
      }
    }
    return moves;
  }

  getGameStatus() {
    const inCheck = this.isInCheck(this.currentPlayer);
    const hasMoves = this.hasLegalMoves(this.currentPlayer);

>>>>>>> 5082604 (Initial commit)
    if (!hasMoves) {
      return inCheck ? "Checkmate" : "Stalemate";
    }
    return inCheck ? "Check" : "Ongoing";
  }
<<<<<<< HEAD
  
=======

  promotePawn(choice) {
  const promotion = this.pendingPromotion;
  if (!promotion) return false;

  const isWhite = promotion.movedPiece === 'P';
  const promoted = isWhite ? choice.toUpperCase() : choice.toLowerCase();

  this.board = promotion.previousState;
  this.currentPlayer = promotion.previousPlayer;
  this.castlingRights = promotion.previousCastling;

  this.board[promotion.toR][promotion.toC] = promoted;
  this.board[promotion.fromR][promotion.fromC] = ' ';

  const move = {
    fromR: promotion.fromR,
    fromC: promotion.fromC,
    toR: promotion.toR,
    toC: promotion.toC,
    movedPiece: promotion.movedPiece,
    capturedPiece: promotion.capturedPiece,
    promotion: promoted,
    previousState: promotion.previousState,
    previousPlayer: promotion.previousPlayer,
    previousCastling: promotion.previousCastling
  };

  this.moveHistory.push(move);
  this.undoStack.push(move);
  this.redoStack = [];
  this.pendingPromotion = null;
  this.currentPlayer = this.currentPlayer === 'w' ? 'b' : 'w';
  return true;
}

>>>>>>> 5082604 (Initial commit)
}
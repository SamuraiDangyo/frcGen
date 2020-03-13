/**
* frcGen, a Chess960 starting position generator
* Copyright (C) 2020 Toni Helminen
* GPLv3
**/

/*jshint esversion: 6 */

// https://en.wikipedia.org/wiki/Fischer_random_chess_numbering_scheme#Direct_derivation
function frcGen(idPositionNumber) {
  function num2Piece(num) {
    return {2: "N", 3: "B", 4: "R", 5: "Q", 6: "K"}[num];
  }

  function castlingRights(nums) {
    let rookLeft  = 0;
    let rookRight = 0;

    for (let i = 0; i <= 7; i++) if (nums[i] == 4){rookLeft  = i; break;}
    for (let i = 7; i >= 0; i--) if (nums[i] == 4){rookRight = i; break;}

    let rights = String.fromCharCode(65 + rookLeft) + String.fromCharCode(65 + rookRight);

    return `${rights}${rights.toLowerCase()}`;
  }

  function makeFen(nums) {
    let str = "";

    for (let i = 0; i <= 7; i++) str += num2Piece(nums[i]).toLowerCase();
    str += "/pppppppp/8/8/8/8/PPPPPPPP/";
    for (let i = 0; i <= 7; i++) str += num2Piece(nums[i]);

    return `${str} w ${castlingRights(nums)} - 0 1`;
  }

  function genBoard() {
    let N     = Math.min(959, Math.max(0, parseInt(idPositionNumber, 10)));
    let board = [0, 0, 0, 0, 0, 0, 0, 0];

    // Step a
    let N2 = parseInt(N / 4, 10);
    let B1 = N % 4;

    board[[1, 3, 5, 7][B1]] = 3;

    // Step b
    let N3 = parseInt(N2 / 4, 10);
    let B2 = N2 % 4;

    board[[0, 2, 4, 6][B2]] = 3;

    // Step c
    let N4 = parseInt(N3 / 6, 10);
    let Q  = N3 % 6;

    let freeSquares = 0;
    for (let i = 0; i <= 7; i++) {if ( ! board[i]) {freeSquares++; if (freeSquares == Q + 1) {board[i] = 5; break;}}}

    // Step d
    const knights   = [[0,1], [0,2], [0,3], [0,4], [1,2], [1,3], [1,4], [2,3], [2,4], [3,4]];
    const knightPos = knights[N4];

    freeSquares     = 0;
    let knightLeft  = 0;
    let knightRight = 0;
    for (let i = 0; i <= 7; i++) {if ( ! board[i]) {freeSquares++; if (freeSquares == knightPos[0] + 1) {knightLeft  = i; break;}}}

    freeSquares = 0;
    for (let i = 0; i <= 7; i++) {if ( ! board[i]) {freeSquares++; if (freeSquares == knightPos[1] + 1) {knightRight = i; break;}}}

    board[knightLeft]  = 2;
    board[knightRight] = 2;

    // Step e
    for (let i = 0; i <= 7; i++) if ( ! board[i]) {board[i] = 4; break;}
    for (let i = 7; i >= 0; i--) if ( ! board[i]) {board[i] = 4; break;}

    for (let i = 0; i <= 7; i++) if ( ! board[i]) {board[i] = 6; break;}

    return board;
  }

  return makeFen(genBoard());
}
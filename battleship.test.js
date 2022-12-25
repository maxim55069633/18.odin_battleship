const exp = require("constants");
const battleship = require("./scripts");

test("Ship can get hit", () => {
  const Ship_A = battleship.Ship(2, 0);
  expect(Ship_A.is_sunk()).toBeFalsy();
  Ship_A.hit();
  Ship_A.hit();
  expect(Ship_A.is_sunk()).toBeTruthy();
});

test("Place all the ships on the game board successfully", () => {
  const Gameboard_A = battleship.Gameboard();
  const A_all_ship_squares = [
    battleship.Square(1, 1),
    battleship.Square(2, 1),
    battleship.Square(6, 1),
    battleship.Square(7, 1),
    battleship.Square(8, 1),
    battleship.Square(9, 1),
    battleship.Square(1, 3),
    battleship.Square(5, 3),
    battleship.Square(9, 4),
    battleship.Square(10, 4),
    battleship.Square(1, 5),
    battleship.Square(1, 6),
    battleship.Square(10, 6),
    battleship.Square(1, 8),
    battleship.Square(1, 9),
    battleship.Square(1, 10),
    battleship.Square(9, 8),
    battleship.Square(6, 10),
    battleship.Square(7, 10),
    battleship.Square(8, 10),
  ];
  Gameboard_A.place_ships(A_all_ship_squares);
  A_all_ship_squares.forEach((element) => {
    expect(
      Gameboard_A.board_condition[(element.x - 1) * 10 + element.y - 1]
    ).toBe(2);
  });

  Gameboard_A.receiveAttack(battleship.Square(1, 1));
  expect(Gameboard_A.board_condition[(1 - 1) * 10 + 1 - 1]).toBe(3);
  Gameboard_A.receiveAttack(battleship.Square(10, 10));
  expect(Gameboard_A.board_condition[(10 - 1) * 10 + 10 - 1]).toBe(1);
});

test("Player and Computer can attack successfully", () => {
  const Gameboard_A = battleship.Gameboard();
  const A_all_ship_squares = [
    battleship.Square(1, 1),
    battleship.Square(2, 1),
    battleship.Square(6, 1),
    battleship.Square(7, 1),
    battleship.Square(8, 1),
    battleship.Square(9, 1),
    battleship.Square(1, 3),
    battleship.Square(5, 3),
    battleship.Square(9, 4),
    battleship.Square(10, 4),
    battleship.Square(1, 5),
    battleship.Square(1, 6),
    battleship.Square(10, 6),
    battleship.Square(1, 8),
    battleship.Square(1, 9),
    battleship.Square(1, 10),
    battleship.Square(9, 8),
    battleship.Square(6, 10),
    battleship.Square(7, 10),
    battleship.Square(8, 10),
  ];
  Gameboard_A.place_ships(A_all_ship_squares);

  const Gameboard_B = battleship.Gameboard();
  const B_all_ship_squares = [
    battleship.Square(5, 1),
    battleship.Square(6, 1),
    battleship.Square(9, 1),
    battleship.Square(10, 1),
    battleship.Square(3, 3),
    battleship.Square(4, 3),
    battleship.Square(5, 3),
    battleship.Square(6, 3),
    battleship.Square(10, 3),
    battleship.Square(8, 4),
    battleship.Square(1, 6),
    battleship.Square(2, 6),
    battleship.Square(3, 6),
    battleship.Square(6, 8),
    battleship.Square(7, 8),
    battleship.Square(2, 9),
    battleship.Square(5, 10),
    battleship.Square(7, 10),
    battleship.Square(8, 10),
    battleship.Square(9, 10),
  ];
  Gameboard_B.place_ships(B_all_ship_squares);

  const player_human = battleship.Player("Kai");
  const player_computer = battleship.Player();
  // Attack a hidden ship
  player_human.attack_rival(Gameboard_A, battleship.Square(1, 1));
  expect(Gameboard_A.board_condition[(1 - 1) * 10 + 1 - 1]).toBe(3);
  // Attack a blank square
  player_human.attack_rival(Gameboard_A, battleship.Square(3, 1));
  expect(Gameboard_A.board_condition[(3 - 1) * 10 + 1 - 1]).toBe(1);
  // Attack a random square * 3
  let attacked_square_for_AI = player_computer.random_attack(Gameboard_B);
  expect(
    Gameboard_B.board_condition[
      (attacked_square_for_AI.x - 1) * 10 + attacked_square_for_AI.y - 1
    ] == 1 ||
      Gameboard_B.board_condition[
        (attacked_square_for_AI.x - 1) * 10 + attacked_square_for_AI.y - 1
      ] == 3
  ).toBeTruthy();

  attacked_square_for_AI = player_computer.random_attack(Gameboard_B);
  expect(
    Gameboard_B.board_condition[
      (attacked_square_for_AI.x - 1) * 10 + attacked_square_for_AI.y - 1
    ] == 1 ||
      Gameboard_B.board_condition[
        (attacked_square_for_AI.x - 1) * 10 + attacked_square_for_AI.y - 1
      ] == 3
  ).toBeTruthy();

  attacked_square_for_AI = player_computer.random_attack(Gameboard_B);
  expect(
    Gameboard_B.board_condition[
      (attacked_square_for_AI.x - 1) * 10 + attacked_square_for_AI.y - 1
    ] == 1 ||
      Gameboard_B.board_condition[
        (attacked_square_for_AI.x - 1) * 10 + attacked_square_for_AI.y - 1
      ] == 3
  ).toBeTruthy();
});

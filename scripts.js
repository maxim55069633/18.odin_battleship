const Square = (x, y) => {
  return { x, y };
};

const Ship = (length = 1, number_of_hits = 0) => {
  const hit = () => {
    if (number_of_hits < length) number_of_hits++;
  };
  const is_sunk = () => {
    if (length <= number_of_hits) return true;
    else return false;
  };
  const get_number_of_hits = () => {
    return number_of_hits;
  };
  const get_length = () => {
    return length;
  };
  return { is_sunk, hit };
};

const Gameboard = () => {
  // 0 represents blank.
  // 1 represents missed.
  // 2 represents hidden.
  // 3 represents shot.

  const board_condition = new Array(100).fill(0);

  let remaining_ships = 20;

  const place_ships = (start_squares) => {
    for (let i = 0; i < start_squares.length; i++) {
      board_condition[
        (start_squares[i].x - 1) * 10 + (start_squares[i].y - 1)
      ] = 2;
    }
  };

  const game_over = () => {
    if (remaining_ships == 0) return true;
    else return false;
  };

  const receiveAttack = (attack_square) => {
    if (
      board_condition[(attack_square.x - 1) * 10 + attack_square.y - 1] == 2
    ) {
      board_condition[(attack_square.x - 1) * 10 + attack_square.y - 1] = 3;
      remaining_ships--;
    } else
      board_condition[(attack_square.x - 1) * 10 + attack_square.y - 1] = 1;
  };

  return { board_condition, place_ships, receiveAttack };
};

const Player = (name = "Computer") => {
  const attack_rival = (rival_board, target_square) => {
    rival_board.receiveAttack(target_square);
  };

  const random_attack = (rival_board) => {
    let mock_x;
    let mock_y;
    while (true) {
      mock_x = parseInt(Math.random() * 10 + 1);
      mock_y = parseInt(Math.random() * 10 + 1);
      if (
        // The mock_square has already been attacked
        rival_board.board_condition[(mock_x - 1) * 10 + mock_y - 1] == 1 ||
        rival_board.board_condition[(mock_x - 1) * 10 + mock_y - 1] == 3
      )
        continue;
      else {
        rival_board.receiveAttack(Square(mock_x, mock_y));
        break;
      }
    }
    return Square(mock_x, mock_y);
  };

  return { name, attack_rival, random_attack };
};

// Check whether the scripts are run on Node or Browser.
if (typeof module === "object") {
  module.exports = { Square, Ship, Gameboard, Player };
} else {
  const Game = (() => {
    // Create two Gameboards with predetermined coordinates and two Players(Humans and Computer)
    const Gameboard_A = Gameboard();
    const A_all_ship_squares = [
      Square(1, 1),
      Square(2, 1),
      Square(6, 1),
      Square(7, 1),
      Square(8, 1),
      Square(9, 1),
      Square(1, 3),
      Square(5, 3),
      Square(9, 4),
      Square(10, 4),
      Square(1, 5),
      Square(1, 6),
      Square(10, 6),
      Square(1, 8),
      Square(1, 9),
      Square(1, 10),
      Square(9, 8),
      Square(6, 10),
      Square(7, 10),
      Square(8, 10),
    ];
    Gameboard_A.place_ships(A_all_ship_squares);

    const Gameboard_B = Gameboard();
    const B_all_ship_squares = [
      Square(5, 1),
      Square(6, 1),
      Square(9, 1),
      Square(10, 1),
      Square(3, 3),
      Square(4, 3),
      Square(5, 3),
      Square(6, 3),
      Square(10, 3),
      Square(8, 4),
      Square(1, 6),
      Square(2, 6),
      Square(3, 6),
      Square(6, 8),
      Square(7, 8),
      Square(2, 9),
      Square(5, 10),
      Square(7, 10),
      Square(8, 10),
      Square(9, 10),
    ];
    Gameboard_B.place_ships(B_all_ship_squares);

    const player_human = Player("Kai");
    const player_computer = Player();
    // player_human's gameboard is A, computer (or another player)'s gameboard is B.

    // gameboard
    const display_your_board = () => {
      const board_div = document.querySelector(".your_grid");
      for (let i = 1; i <= 10; i++) {
        const board_row = document.createElement("div");
        for (let j = 1; j <= 10; j++) {
          const board_square = document.createElement("div");
          board_square.classList.add("board_square");
          if (i == 1) {
            board_square.classList.add(`board_column${j}`);
          }
          board_row.appendChild(board_square);
        }
        board_row.classList.add("board_row");
        board_row.classList.add(`board_row${i}`);

        board_div.appendChild(board_row);
      }
    };

    const display_oppo_board = () => {
      const board_div = document.querySelector(".oppo_grid");
      for (let i = 1; i <= 10; i++) {
        const board_row = document.createElement("div");
        for (let j = 1; j <= 10; j++) {
          const board_square = document.createElement("div");
          board_square.classList.add("board_square");
          if (i == 1) {
            board_square.classList.add(`board_column${j}`);
          }
          board_row.appendChild(board_square);
        }
        board_row.classList.add("board_row");
        board_row.classList.add(`board_row${i}`);

        board_div.appendChild(board_row);
      }
    };

    return { display_your_board, display_oppo_board };
  })();

  Game.display_your_board();
  Game.display_oppo_board();
}

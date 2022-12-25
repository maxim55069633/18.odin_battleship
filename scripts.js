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
    } else if (
      board_condition[(attack_square.x - 1) * 10 + attack_square.y - 1] == 0
    )
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
    // turn_record can determine who should shoot on the current turn.
    let turn_record = 0;

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

    // gameboard
    const display_your_board = (your_grid) => {
      const board_div = document.querySelector(".your_grid");
      board_div.innerHTML = "";
      for (let i = 1; i <= 10; i++) {
        const board_row = document.createElement("div");
        for (let j = 1; j <= 10; j++) {
          const board_square = document.createElement("div");
          board_square.setAttribute("id", `${i}your${j}`);
          board_square.classList.add("board_square");
          board_square.classList.add("your_square");
          if (i == 1) {
            board_square.classList.add(`board_column${j}`);
          }

          if (your_grid.board_condition[(i - 1) * 10 + j - 1] == 1) {
            board_square.textContent = "ꞏ";
            board_square.classList.add("ship_square_missed");
          } else if (your_grid.board_condition[(i - 1) * 10 + j - 1] == 2)
            board_square.classList.add("ship_square_hidden");
          else if (your_grid.board_condition[(i - 1) * 10 + j - 1] == 3) {
            board_square.textContent = "X";
            board_square.classList.remove("ship_square_hidden");
            board_square.classList.add("ship_square_shot");
          }

          board_row.appendChild(board_square);
        }
        board_row.classList.add("board_row");
        board_row.classList.add(`board_row${i}`);

        board_div.appendChild(board_row);
      }
    };

    const display_oppo_board = (oppo_grid) => {
      const board_div = document.querySelector(".oppo_grid");
      board_div.innerHTML = "";
      for (let i = 1; i <= 10; i++) {
        const board_row = document.createElement("div");
        for (let j = 1; j <= 10; j++) {
          const board_square = document.createElement("div");
          board_square.setAttribute("id", `${i}oppo${j}`);
          board_square.classList.add("board_square");
          board_square.classList.add("oppo_square");
          if (i == 1) {
            board_square.classList.add(`board_column${j}`);
          }

          if (oppo_grid.board_condition[(i - 1) * 10 + j - 1] == 1) {
            board_square.textContent = "ꞏ";
            board_square.classList.add("ship_square_missed");
          } else if (oppo_grid.board_condition[(i - 1) * 10 + j - 1] == 3) {
            board_square.textContent = "X";
            board_square.classList.remove("ship_square_hidden");
            board_square.classList.add("ship_square_shot");
          }

          board_row.appendChild(board_square);
        }
        board_row.classList.add("board_row");
        board_row.classList.add(`board_row${i}`);

        board_div.appendChild(board_row);
      }
    };

    const player_your = Player("Your");
    const player_oppo = Player();
    // player_human's gameboard is A, computer (or another player)'s gameboard is B.

    function log_your_square(e) {
      console.log(turn_record);
      const prompt = document.querySelector(".prompt");

      const clicked_square = Square(
        parseInt(e.target.id.split("your")[0]),
        parseInt(e.target.id.split("your")[1])
      );

      // 0 - blank, 1 - missed, 2 - hidden, 3 - shot
      const original_condition =
        Gameboard_A.board_condition[
          (clicked_square.x - 1) * 10 + clicked_square.y - 1
        ];
      Gameboard_A.receiveAttack(clicked_square);
      display_your_board(Gameboard_A);

      //After one click, cancel all the listener, wait for the other player's next move.
      const all_your_squares = document.querySelectorAll(".your_square");
      all_your_squares.forEach((element) => {
        element.removeEventListener("click", log_your_square);
      });

      // if the clicked square has already been clicked, try another one.
      if (original_condition == 1 || original_condition == 3) {
        prompt.textContent = `It's ${player_oppo.name} turn`;
        your_board_listener();
      } else {
        prompt.textContent = `It's ${player_your.name} turn`;
        oppo_board_listener();
      }
    }

    const your_board_listener = () => {
      const all_your_squares = document.querySelectorAll(".your_square");
      all_your_squares.forEach((element) => {
        element.addEventListener("click", log_your_square);
      });
    };

    function log_oppo_square(e) {
      console.log(turn_record);
      const prompt = document.querySelector(".prompt");

      const clicked_square = Square(
        parseInt(e.target.id.split("oppo")[0]),
        parseInt(e.target.id.split("oppo")[1])
      );

      // 0 - blank, 1 - missed, 2 - hidden, 3 - shot
      const original_condition =
        Gameboard_B.board_condition[
          (clicked_square.x - 1) * 10 + clicked_square.y - 1
        ];
      Gameboard_B.receiveAttack(clicked_square);
      display_oppo_board(Gameboard_B);

      const all_oppo_squares = document.querySelectorAll(".oppo_square");
      all_oppo_squares.forEach((element) => {
        element.removeEventListener("click", log_oppo_square);
      });

      // if the clicked square has already been clicked, try another one.

      if (original_condition == 1 || original_condition == 3) {
        prompt.textContent = `It's ${player_your.name} turn`;
        oppo_board_listener();
      } else {
        prompt.textContent = `It's ${player_oppo.name} turn`;
        your_board_listener();
      }
    }

    const oppo_board_listener = () => {
      const all_oppo_squares = document.querySelectorAll(".oppo_square");
      all_oppo_squares.forEach((element) => {
        element.addEventListener("click", log_oppo_square);
      });
    };

    const turn_controller = () => {
      your_board_listener();
    };

    return {
      display_your_board,
      display_oppo_board,
      Gameboard_A,
      Gameboard_B,
      turn_controller,
    };
  })();

  Game.display_your_board(Game.Gameboard_A);
  Game.display_oppo_board(Game.Gameboard_B);
  Game.Gameboard_A.receiveAttack(Square(1, 1));
  Game.Gameboard_A.receiveAttack(Square(1, 10));
  Game.Gameboard_A.receiveAttack(Square(10, 10));
  Game.display_your_board(Game.Gameboard_A);

  Game.Gameboard_B.receiveAttack(Square(1, 1));
  Game.Gameboard_B.receiveAttack(Square(5, 1));
  Game.display_oppo_board(Game.Gameboard_B);

  Game.turn_controller();
}

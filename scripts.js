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

  return { is_sunk, hit };
};

function eliminate_duplication(a, b) {
  if (a.length == 0) return b;

  // add the first element of array a to array b
  for (let i = 0, j = 0; i < a.length; i++) {
    for (; j < b.length; j++) if (a[i].x == b[j].x && a[i].y == b[j].y) break;
    if (j == b.length) {
      b.push(a[i]);
      a.splice(i, 1);
      break;
    } else {
      a.splice(i, 1);
      break;
    }
  }

  return eliminate_duplication(a, b);
}

function reduce_difference_and_duplication(a, b) {
  const difference_array = [];
  for (let i = 0, j = 0; i < a.length; i++) {
    for (; j < b.length; j++) {
      if (a[i].x == b[j].x && a[i].y == b[j].y) break;
    }
    if (j == b.length) difference_array.push(a[i]);
    j = 0;
  }

  const modified_array = eliminate_duplication(difference_array, []);

  return modified_array;
}

const Gameboard = () => {
  // 0 represents blank.
  // 1 represents missed.
  // 2 represents hidden.
  // 3 represents shot.

  const board_condition = new Array(100).fill(0);

  // the starting square of every ship
  const potential_ship_squares = [[], [], [], [], [], [], [], [], [], []];

  // This variable is used to check whether the drop event succeeds.
  const place_ship_status = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  const adjacent_squares = [[], [], [], [], [], [], [], [], [], []];

  const identify_adjacent_squares = (ship_square, ship_number) => {
    // Array's index starts from 0
    const ship_number_array = ship_number - 1;
    //  (1,1)
    if (ship_square.x == 1 && ship_square.y == 1) {
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x, ship_square.y + 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x + 1, ship_square.y)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x + 1, ship_square.y + 1)
      );
      // (10,1)
    } else if (ship_square.x == 10 && ship_square.y == 1) {
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x - 1, ship_square.y)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x - 1, ship_square.y + 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x, ship_square.y + 1)
      );
      // (1,10)
    } else if (ship_square.x == 1 && ship_square.y == 10) {
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x, ship_square.y - 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x + 1, ship_square.y - 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x + 1, ship_square.y)
      );
      // (10,10)
    } else if (ship_square.x == 10 && ship_square.y == 10) {
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x - 1, ship_square.y - 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x - 1, ship_square.y)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x, ship_square.y - 1)
      );
    }
    //  (x,1) (1<x<10)
    else if (ship_square.y == 1) {
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x - 1, ship_square.y)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x - 1, ship_square.y + 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x, ship_square.y + 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x + 1, ship_square.y)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x + 1, ship_square.y + 1)
      );
      // (10,x) (1<x<10)
    } else if (ship_square.x == 10) {
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x - 1, ship_square.y - 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x, ship_square.y - 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x - 1, ship_square.y)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x - 1, ship_square.y + 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x, ship_square.y + 1)
      );
    }
    // (1,x)  (1<x<10)
    else if (ship_square.x == 1) {
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x, ship_square.y - 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x, ship_square.y + 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x + 1, ship_square.y - 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x + 1, ship_square.y)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x + 1, ship_square.y + 1)
      );
    }
    // (x,10) (1<x<10)
    else if (ship_square.y == 10) {
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x - 1, ship_square.y - 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x - 1, ship_square.y)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x, ship_square.y - 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x + 1, ship_square.y - 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x + 1, ship_square.y)
      );
    }
    // (x,y) ( 1<x<10  , 1<y<10)
    else {
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x - 1, ship_square.y - 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x - 1, ship_square.y)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x - 1, ship_square.y + 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x, ship_square.y - 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x, ship_square.y + 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x + 1, ship_square.y - 1)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x + 1, ship_square.y)
      );
      adjacent_squares[ship_number_array].push(
        Square(ship_square.x + 1, ship_square.y + 1)
      );
    }
  };

  const delete_repeated_squares_in_adjacent_squares = (ship_number) => {
    const ship_number_array = ship_number - 1;
    const array_1 = structuredClone(adjacent_squares[ship_number_array]);
    const array_2 = structuredClone(potential_ship_squares[ship_number_array]);

    adjacent_squares[ship_number_array] = reduce_difference_and_duplication(
      array_1,
      array_2
    );
  };

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

  const get_remaining_ships = () => {
    return remaining_ships;
  };

  return {
    board_condition,
    potential_ship_squares,
    adjacent_squares,
    place_ship_status,
    identify_adjacent_squares,
    delete_repeated_squares_in_adjacent_squares,

    place_ships,
    receiveAttack,
    game_over,
    get_remaining_ships,
  };
};

const Player = (name = "Computer") => {
  const attack_record = [];

  const attack_rival = (rival_board, target_square) => {
    rival_board.receiveAttack(target_square);
  };

  const choose_random_square = (rival_board) => {
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
      else break;
    }
    return Square(mock_x, mock_y);
  };

  const random_attack = (rival_board) => {
    const random_square = choose_random_square(rival_board);
    rival_board.receiveAttack(random_square);
  };

  return {
    name,
    attack_record,
    attack_rival,
    random_attack,
    choose_random_square,
  };
};

// Check whether the scripts are run on Node or Browser.
if (typeof module === "object") {
  module.exports = { Square, Ship, Gameboard, Player };
} else {
  const Game = (() => {
    // Create two Gameboards with predetermined coordinates and two Players(Humans and Computer)
    const Gameboard_A = Gameboard();

    const initialize_Gameboard_A = () => {
      Gameboard_A.place_ships(Gameboard_A.potential_ship_squares.flat(2));
    };

    const Gameboard_B = Gameboard();
    Gameboard_B.potential_ship_squares[0] = [Square(5, 1), Square(6, 1)];
    Gameboard_B.adjacent_squares[0] = [
      Square(4, 1),
      Square(4, 2),
      Square(5, 2),
      Square(6, 2),
      Square(7, 1),
      Square(7, 2),
    ];

    Gameboard_B.potential_ship_squares[1] = [Square(9, 1), Square(10, 1)];
    Gameboard_B.adjacent_squares[1] = [
      Square(8, 1),
      Square(8, 2),
      Square(9, 2),
      Square(10, 2),
    ];
    Gameboard_B.potential_ship_squares[2] = [
      Square(3, 3),
      Square(4, 3),
      Square(5, 3),
      Square(6, 3),
    ];
    Gameboard_B.adjacent_squares[2] = [
      Square(2, 2),
      Square(2, 3),
      Square(2, 4),
      Square(3, 2),
      Square(3, 4),
      Square(4, 2),
      Square(4, 4),
      Square(5, 2),
      Square(5, 4),
      Square(6, 2),
      Square(6, 4),
      Square(7, 2),
      Square(7, 3),
      Square(7, 4),
    ];
    Gameboard_B.potential_ship_squares[3] = [Square(10, 3)];
    Gameboard_B.adjacent_squares[3] = [
      Square(9, 2),
      Square(9, 3),
      Square(9, 4),
      Square(10, 2),
      Square(10, 4),
    ];
    Gameboard_B.potential_ship_squares[4] = [Square(8, 4)];
    Gameboard_B.adjacent_squares[4] = [
      Square(7, 3),
      Square(7, 4),
      Square(7, 5),
      Square(8, 3),
      Square(8, 5),
      Square(9, 3),
      Square(9, 4),
      Square(9, 5),
    ];
    Gameboard_B.potential_ship_squares[5] = [
      Square(1, 6),
      Square(2, 6),
      Square(3, 6),
    ];
    Gameboard_B.adjacent_squares[5] = [
      Square(1, 5),
      Square(1, 7),
      Square(2, 5),
      Square(2, 7),
      Square(3, 5),
      Square(3, 7),
      Square(4, 5),
      Square(4, 6),
      Square(4, 7),
    ];
    Gameboard_B.potential_ship_squares[6] = [Square(6, 8), Square(7, 8)];
    Gameboard_B.adjacent_squares[6] = [
      Square(5, 7),
      Square(5, 8),
      Square(5, 9),
      Square(6, 7),
      Square(6, 9),
      Square(7, 7),
      Square(7, 9),
      Square(8, 7),
      Square(8, 8),
      Square(8, 9),
    ];
    Gameboard_B.potential_ship_squares[7] = [Square(2, 9)];
    Gameboard_B.adjacent_squares[7] = [
      Square(1, 8),
      Square(1, 9),
      Square(1, 10),
      Square(2, 8),
      Square(2, 10),
      Square(3, 8),
      Square(3, 9),
      Square(3, 10),
    ];
    Gameboard_B.potential_ship_squares[8] = [Square(5, 10)];
    Gameboard_B.adjacent_squares[8] = [
      Square(4, 9),
      Square(4, 10),
      Square(5, 9),
      Square(6, 9),
      Square(6, 10),
    ];
    Gameboard_B.potential_ship_squares[9] = [
      Square(7, 10),
      Square(8, 10),
      Square(9, 10),
    ];
    Gameboard_B.adjacent_squares[9] = [
      Square(6, 9),
      Square(6, 10),
      Square(7, 9),
      Square(8, 9),
      Square(9, 9),
      Square(10, 9),
      Square(10, 10),
    ];
    Gameboard_B.place_ships(Gameboard_B.potential_ship_squares.flat(2));

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

    const find_a_nearby_square = () => {
      console.log("find_a_nearby_square");
      let index_of_record = 0;
      let previous_shot = player_oppo.attack_record[index_of_record];
      let target_square;

      let record_direction = "vertical";
      if (player_oppo.attack_record.length >= 2) {
        if (player_oppo.attack_record[0].x == player_oppo.attack_record[1].x)
          record_direction = "horizontal";

        // if we can identify the direction of the hidden ship, no need to try another direction

        if (record_direction == "vertical")
          while (index_of_record < player_oppo.attack_record.length) {
            if (previous_shot.x < 10) {
              if (
                Gameboard_A.board_condition[
                  (previous_shot.x + 1 - 1) * 10 + previous_shot.y - 1
                ] == 2
              ) {
                // if the hidden ship will be shot, record this move

                target_square = Square(previous_shot.x + 1, previous_shot.y);

                player_oppo.attack_record.push(target_square);
                console.log("try square beneath");
                return target_square;
              } else if (
                Gameboard_A.board_condition[
                  (previous_shot.x + 1 - 1) * 10 + previous_shot.y - 1
                ] == 0
              ) {
                target_square = Square(previous_shot.x + 1, previous_shot.y);

                console.log("try square beneath");
                return target_square;
              }
            }
            if (previous_shot.x > 1) {
              if (
                Gameboard_A.board_condition[
                  (previous_shot.x - 1 - 1) * 10 + previous_shot.y - 1
                ] == 2
              ) {
                // if the hidden ship will be shot, record this move
                target_square = Square(previous_shot.x - 1, previous_shot.y);

                player_oppo.attack_record.push(target_square);
                console.log("try square above");
                return target_square;
              } else if (
                Gameboard_A.board_condition[
                  (previous_shot.x - 1 - 1) * 10 + previous_shot.y - 1
                ] == 0
              ) {
                target_square = Square(previous_shot.x - 1, previous_shot.y);

                console.log("try square above");
                return target_square;
              }
            }

            console.log("before shift: player_oppo.attack_record");
            player_oppo.attack_record.forEach((element) => {
              console.log(`${element.x}, ${element.y}`);
            });
            player_oppo.attack_record.shift();

            console.log("after shift: player_oppo.attack_record");
            player_oppo.attack_record.forEach((element) => {
              console.log(`${element.x}, ${element.y}`);
            });
            previous_shot = player_oppo.attack_record[index_of_record];
          }
        else {
          // try horizontal direction
          while (index_of_record < player_oppo.attack_record.length) {
            if (previous_shot.y < 10) {
              if (
                Gameboard_A.board_condition[
                  (previous_shot.x - 1) * 10 + previous_shot.y + 1 - 1
                ] == 2
              ) {
                // if the hidden ship will be shot, record this move

                target_square = Square(previous_shot.x, previous_shot.y + 1);

                player_oppo.attack_record.push(target_square);
                console.log("try right square");
                return target_square;
              } else if (
                Gameboard_A.board_condition[
                  (previous_shot.x - 1) * 10 + previous_shot.y + 1 - 1
                ] == 0
              ) {
                // if the blank square will be shot, don't record this move

                target_square = Square(previous_shot.x, previous_shot.y + 1);
                console.log("try right square");
                return target_square;
              }
            }

            if (previous_shot.y > 1) {
              if (
                Gameboard_A.board_condition[
                  (previous_shot.x - 1) * 10 + previous_shot.y - 1 - 1
                ] == 2
              ) {
                // if the hidden ship will be shot, record this move
                target_square = Square(previous_shot.x, previous_shot.y - 1);

                player_oppo.attack_record.push(target_square);
                console.log("try left square");
                return target_square;
              } else if (
                Gameboard_A.board_condition[
                  (previous_shot.x - 1) * 10 + previous_shot.y - 1 - 1
                ] == 0
              ) {
                target_square = Square(previous_shot.x, previous_shot.y - 1);

                console.log("try left square");
                return target_square;
              }
            }

            console.log("before shift: player_oppo.attack_record");
            player_oppo.attack_record.forEach((element) => {
              console.log(`${element.x}, ${element.y}`);
            });
            player_oppo.attack_record.shift();

            console.log("after shift: player_oppo.attack_record");
            player_oppo.attack_record.forEach((element) => {
              console.log(`${element.x}, ${element.y}`);
            });
            previous_shot = player_oppo.attack_record[index_of_record];
          }
        }
      }

      while (index_of_record < player_oppo.attack_record.length) {
        if (previous_shot.y < 10) {
          if (
            Gameboard_A.board_condition[
              (previous_shot.x - 1) * 10 + previous_shot.y + 1 - 1
            ] == 2
          ) {
            // if the hidden ship will be shot, record this move

            target_square = Square(previous_shot.x, previous_shot.y + 1);

            player_oppo.attack_record.push(target_square);
            console.log("try right square");
            return target_square;
          } else if (
            Gameboard_A.board_condition[
              (previous_shot.x - 1) * 10 + previous_shot.y + 1 - 1
            ] == 0
          ) {
            // if the blank square will be shot, don't record this move

            target_square = Square(previous_shot.x, previous_shot.y + 1);
            console.log("try right square");
            return target_square;
          }
        }
        if (previous_shot.x < 10) {
          if (
            Gameboard_A.board_condition[
              (previous_shot.x + 1 - 1) * 10 + previous_shot.y - 1
            ] == 2
          ) {
            // if the hidden ship will be shot, record this move

            target_square = Square(previous_shot.x + 1, previous_shot.y);

            player_oppo.attack_record.push(target_square);
            console.log("try square beneath");
            return target_square;
          } else if (
            Gameboard_A.board_condition[
              (previous_shot.x + 1 - 1) * 10 + previous_shot.y - 1
            ] == 0
          ) {
            target_square = Square(previous_shot.x + 1, previous_shot.y);

            console.log("try square beneath");
            return target_square;
          }
        }
        if (previous_shot.y > 1) {
          if (
            Gameboard_A.board_condition[
              (previous_shot.x - 1) * 10 + previous_shot.y - 1 - 1
            ] == 2
          ) {
            // if the hidden ship will be shot, record this move
            target_square = Square(previous_shot.x, previous_shot.y - 1);

            player_oppo.attack_record.push(target_square);
            console.log("try left square");
            return target_square;
          } else if (
            Gameboard_A.board_condition[
              (previous_shot.x - 1) * 10 + previous_shot.y - 1 - 1
            ] == 0
          ) {
            target_square = Square(previous_shot.x, previous_shot.y - 1);

            console.log("try left square");
            return target_square;
          }
        }
        if (previous_shot.x > 1) {
          if (
            Gameboard_A.board_condition[
              (previous_shot.x - 1 - 1) * 10 + previous_shot.y - 1
            ] == 2
          ) {
            // if the hidden ship will be shot, record this move
            target_square = Square(previous_shot.x - 1, previous_shot.y);

            player_oppo.attack_record.push(target_square);
            console.log("try square above");
            return target_square;
          } else if (
            Gameboard_A.board_condition[
              (previous_shot.x - 1 - 1) * 10 + previous_shot.y - 1
            ] == 0
          ) {
            target_square = Square(previous_shot.x - 1, previous_shot.y);

            console.log("try square above");
            return target_square;
          }
        }

        console.log("before shift: player_oppo.attack_record");
        player_oppo.attack_record.forEach((element) => {
          console.log(`${element.x}, ${element.y}`);
        });
        player_oppo.attack_record.shift();

        console.log("after shift: player_oppo.attack_record");
        player_oppo.attack_record.forEach((element) => {
          console.log(`${element.x}, ${element.y}`);
        });
        previous_shot = player_oppo.attack_record[index_of_record];
      }
      // Fail to find a possible shot position
      player_oppo.attack_record.length = 0;

      // record the random shot
      target_square = player_oppo.choose_random_square(Gameboard_A);
      return target_square;
    };

    const computer_move = () => {
      let target_square;
      if (player_oppo.attack_record.length != 0) {
        // If we shot a hidden ship square in the previous turn, find next shoot next to it
        target_square = find_a_nearby_square();
      } else target_square = player_oppo.choose_random_square(Gameboard_A);

      console.log(`current move is ${target_square.x}, ${target_square.y}`);

      const prompt_line2 = document.createElement("p");

      // 0 - blank, 1 - missed, 2 - hidden, 3 - shot
      const original_condition =
        Gameboard_A.board_condition[
          (target_square.x - 1) * 10 + target_square.y - 1
        ];

      if (original_condition == 2 && player_oppo.attack_record.length == 0)
        player_oppo.attack_record.push(target_square);

      Gameboard_A.receiveAttack(target_square);

      const prompt = document.querySelector(".prompt");
      prompt.innerHTML = "";
      const prompt_line1 = document.createElement("p");
      prompt_line1.textContent = `Opponent's remaining ship squares are ${Gameboard_B.get_remaining_ships()}`;
      prompt.appendChild(prompt_line1);

      // detect if there is a ship sunk
      for (
        let i = 0, j = 0;
        i < Gameboard_A.potential_ship_squares.length;
        i++
      ) {
        for (; j < Gameboard_A.potential_ship_squares[i].length; j++)
          if (
            Gameboard_A.board_condition[
              (Gameboard_A.potential_ship_squares[i][j].x - 1) * 10 +
                Gameboard_A.potential_ship_squares[i][j].y -
                1
            ] != 3
          )
            break;
        if (j == Gameboard_A.potential_ship_squares[i].length) {
          // if the player sinks a ship, he will make a random shot
          Gameboard_A.adjacent_squares[i].forEach((element) => {
            Gameboard_A.board_condition[
              (element.x - 1) * 10 + element.y - 1
            ] = 1;
          });
        }
        j = 0;
      }

      display_your_board(Gameboard_A);

      if (Gameboard_A.game_over()) {
        prompt.innerHTML = "";
        const outcome_line1 = document.createElement("p");
        outcome_line1.textContent = "Congratulations!";
        const outcome_line2 = document.createElement("p");
        outcome_line2.textContent = "The winner is";
        const outcome_line3 = document.createElement("p");
        outcome_line3.textContent = "Opponent";

        prompt.appendChild(outcome_line1);
        prompt.appendChild(outcome_line2);
        prompt.appendChild(outcome_line3);
      } else {
        if (
          original_condition == 1 ||
          original_condition == 3 ||
          original_condition == 2
        ) {
          // if the clicked square has already been clicked (original_condition is 1 or 3), try another one.
          // when you do shoot a hidden ship square, shoot again. (original_condition is 2)

          prompt_line2.textContent = `It's ${player_oppo.name} turn`;

          prompt.appendChild(prompt_line2);
          computer_move();
        } else {
          prompt_line2.textContent = `It's ${player_your.name} turn`;
          prompt.appendChild(prompt_line2);
          oppo_board_listener();
        }
      }
    };

    function log_oppo_square(e) {
      const prompt_line2 = document.createElement("p");

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

      const prompt = document.querySelector(".prompt");
      prompt.innerHTML = "";
      const prompt_line1 = document.createElement("p");
      prompt_line1.textContent = `Opponent's remaining ship squares are ${Gameboard_B.get_remaining_ships()}`;
      prompt.appendChild(prompt_line1);

      // detect if there is a ship sunk
      for (
        let i = 0, j = 0;
        i < Gameboard_B.potential_ship_squares.length;
        i++
      ) {
        for (; j < Gameboard_B.potential_ship_squares[i].length; j++)
          if (
            Gameboard_B.board_condition[
              (Gameboard_B.potential_ship_squares[i][j].x - 1) * 10 +
                Gameboard_B.potential_ship_squares[i][j].y -
                1
            ] != 3
          )
            break;
        if (j == Gameboard_B.potential_ship_squares[i].length) {
          Gameboard_B.adjacent_squares[i].forEach((element) => {
            Gameboard_B.board_condition[
              (element.x - 1) * 10 + element.y - 1
            ] = 1;
          });
        }
        j = 0;
      }
      display_oppo_board(Gameboard_B);

      const all_oppo_squares = document.querySelectorAll(".oppo_square");
      all_oppo_squares.forEach((element) => {
        element.removeEventListener("click", log_oppo_square);
      });

      if (Gameboard_B.game_over()) {
        prompt.innerHTML = "";
        const outcome_line1 = document.createElement("p");
        outcome_line1.textContent = "Congratulations!";
        const outcome_line2 = document.createElement("p");
        outcome_line2.textContent = "The winner is";
        const outcome_line3 = document.createElement("p");
        outcome_line3.textContent = "You";

        prompt.appendChild(outcome_line1);
        prompt.appendChild(outcome_line2);
        prompt.appendChild(outcome_line3);
      } else {
        if (
          original_condition == 1 ||
          original_condition == 3 ||
          original_condition == 2
        ) {
          // if the clicked square has already been clicked (original_condition is 1 or 3), try another one.
          // when you do shoot a hidden ship square, shoot again.

          prompt_line2.textContent = `It's ${player_your.name} turn`;
          prompt.appendChild(prompt_line2);

          oppo_board_listener();
        } else {
          prompt_line2.textContent = `It's ${player_oppo.name} turn`;
          prompt.appendChild(prompt_line2);
          computer_move();
        }
      }
    }

    const oppo_board_listener = () => {
      const all_oppo_squares = document.querySelectorAll(".oppo_square");
      all_oppo_squares.forEach((element) => {
        element.addEventListener("click", log_oppo_square);
      });
    };

    function dragstart_handler(ev) {
      ev.dataTransfer.setData("text", ev.target.id);
      ev.effectAllowed = "move";
    }
    function dragover_handler(ev) {
      ev.preventDefault();
    }

    function dragend_handler(ev) {
      ev.dataTransfer.clearData();
    }

    function drop_handler(ev) {
      ev.preventDefault();
      var id = ev.dataTransfer.getData("text");
      const target_square = Square(
        parseInt(this.id.split("your")[0]),
        parseInt(this.id.split("your")[1])
        // difference between event.target and this
        // Because only square behind the ship block has drop listener. “this” can capture the drop event.

        // parseInt(ev.target.id.split("your")[0]),
        // parseInt(ev.target.id.split("your")[1])
      );

      if (id == "src_move_1") {
        // First push squares in ship_1
        if (Gameboard_A.potential_ship_squares[0].length != 0)
          Gameboard_A.potential_ship_squares[0].length = 0;
        Gameboard_A.potential_ship_squares[0].push(target_square);
        Gameboard_A.potential_ship_squares[0].push(
          Square(target_square.x + 1, target_square.y)
        );
        Gameboard_A.potential_ship_squares[0].push(
          Square(target_square.x + 2, target_square.y)
        );
        Gameboard_A.potential_ship_squares[0].push(
          Square(target_square.x + 3, target_square.y)
        );
        // Second, identify adjacent squares
        if (Gameboard_A.adjacent_squares[0].length != 0)
          Gameboard_A.adjacent_squares[0].length = 0;
        Gameboard_A.potential_ship_squares[0].forEach((element) => {
          Gameboard_A.identify_adjacent_squares(element, 1);
        });
        Gameboard_A.delete_repeated_squares_in_adjacent_squares(1);
      } else if (id == "src_move_2") {
        if (Gameboard_A.potential_ship_squares[1].length != 0)
          Gameboard_A.potential_ship_squares[1].length = 0;
        Gameboard_A.potential_ship_squares[1].push(target_square);
        Gameboard_A.potential_ship_squares[1].push(
          Square(target_square.x + 1, target_square.y)
        );
        Gameboard_A.potential_ship_squares[1].push(
          Square(target_square.x + 2, target_square.y)
        );

        if (Gameboard_A.adjacent_squares[1].length != 0)
          Gameboard_A.adjacent_squares[1].length = 0;
        Gameboard_A.potential_ship_squares[1].forEach((element) => {
          Gameboard_A.identify_adjacent_squares(element, 2);
        });
        Gameboard_A.delete_repeated_squares_in_adjacent_squares(2);
      } else if (id == "src_move_3") {
        if (Gameboard_A.potential_ship_squares[2].length != 0)
          Gameboard_A.potential_ship_squares[2].length = 0;
        Gameboard_A.potential_ship_squares[2].push(target_square);
        Gameboard_A.potential_ship_squares[2].push(
          Square(target_square.x, target_square.y + 1)
        );
        Gameboard_A.potential_ship_squares[2].push(
          Square(target_square.x, target_square.y + 2)
        );

        if (Gameboard_A.adjacent_squares[2].length != 0)
          Gameboard_A.adjacent_squares[2].length = 0;
        Gameboard_A.potential_ship_squares[2].forEach((element) => {
          Gameboard_A.identify_adjacent_squares(element, 3);
        });
        Gameboard_A.delete_repeated_squares_in_adjacent_squares(3);
      } else if (id == "src_move_4") {
        if (Gameboard_A.potential_ship_squares[3].length != 0)
          Gameboard_A.potential_ship_squares[3].length = 0;
        Gameboard_A.potential_ship_squares[3].push(target_square);
        Gameboard_A.potential_ship_squares[3].push(
          Square(target_square.x + 1, target_square.y)
        );

        if (Gameboard_A.adjacent_squares[3].length != 0)
          Gameboard_A.adjacent_squares[3].length = 0;
        Gameboard_A.potential_ship_squares[3].forEach((element) => {
          Gameboard_A.identify_adjacent_squares(element, 4);
        });
        Gameboard_A.delete_repeated_squares_in_adjacent_squares(4);
      } else if (id == "src_move_5") {
        if (Gameboard_A.potential_ship_squares[4].length != 0)
          Gameboard_A.potential_ship_squares[4].length = 0;
        Gameboard_A.potential_ship_squares[4].push(target_square);
        Gameboard_A.potential_ship_squares[4].push(
          Square(target_square.x + 1, target_square.y)
        );

        if (Gameboard_A.adjacent_squares[4].length != 0)
          Gameboard_A.adjacent_squares[4].length = 0;
        Gameboard_A.potential_ship_squares[4].forEach((element) => {
          Gameboard_A.identify_adjacent_squares(element, 5);
        });
        Gameboard_A.delete_repeated_squares_in_adjacent_squares(5);
      } else if (id == "src_move_6") {
        if (Gameboard_A.potential_ship_squares[5].length != 0)
          Gameboard_A.potential_ship_squares[5].length = 0;
        Gameboard_A.potential_ship_squares[5].push(target_square);
        Gameboard_A.potential_ship_squares[5].push(
          Square(target_square.x, target_square.y + 1)
        );

        if (Gameboard_A.adjacent_squares[5].length != 0)
          Gameboard_A.adjacent_squares[5].length = 0;
        Gameboard_A.potential_ship_squares[5].forEach((element) => {
          Gameboard_A.identify_adjacent_squares(element, 6);
        });
        Gameboard_A.delete_repeated_squares_in_adjacent_squares(6);
      } else if (id == "src_move_7") {
        if (Gameboard_A.potential_ship_squares[6].length != 0)
          Gameboard_A.potential_ship_squares[6].length = 0;

        Gameboard_A.potential_ship_squares[6].push(target_square);

        if (Gameboard_A.adjacent_squares[6].length != 0)
          Gameboard_A.adjacent_squares[6].length = 0;
        Gameboard_A.potential_ship_squares[6].forEach((element) => {
          Gameboard_A.identify_adjacent_squares(element, 7);
        });
        Gameboard_A.delete_repeated_squares_in_adjacent_squares(7);
      } else if (id == "src_move_8") {
        if (Gameboard_A.potential_ship_squares[7].length != 0)
          Gameboard_A.potential_ship_squares[7].length = 0;
        Gameboard_A.potential_ship_squares[7].push(target_square);

        if (Gameboard_A.adjacent_squares[7].length != 0)
          Gameboard_A.adjacent_squares[7].length = 0;
        Gameboard_A.potential_ship_squares[7].forEach((element) => {
          Gameboard_A.identify_adjacent_squares(element, 8);
        });
        Gameboard_A.delete_repeated_squares_in_adjacent_squares(8);
      } else if (id == "src_move_9") {
        if (Gameboard_A.potential_ship_squares[8].length != 0)
          Gameboard_A.potential_ship_squares[8].length = 0;
        Gameboard_A.potential_ship_squares[8].push(target_square);

        if (Gameboard_A.adjacent_squares[8].length != 0)
          Gameboard_A.adjacent_squares[8].length = 0;
        Gameboard_A.potential_ship_squares[8].forEach((element) => {
          Gameboard_A.identify_adjacent_squares(element, 9);
        });
        Gameboard_A.delete_repeated_squares_in_adjacent_squares(9);
      } else if (id == "src_move_10") {
        if (Gameboard_A.potential_ship_squares[9].length != 0)
          Gameboard_A.potential_ship_squares[9].length = 0;
        Gameboard_A.potential_ship_squares[9].push(target_square);

        if (Gameboard_A.adjacent_squares[9].length != 0)
          Gameboard_A.adjacent_squares[9].length = 0;
        Gameboard_A.potential_ship_squares[9].forEach((element) => {
          Gameboard_A.identify_adjacent_squares(element, 10);
        });
        Gameboard_A.delete_repeated_squares_in_adjacent_squares(10);
      }

      const ship_array_number = parseInt(id.split("_")[2]) - 1;

      const all_ships_squares = eliminate_duplication(
        [].concat(
          Gameboard_A.potential_ship_squares[0],
          Gameboard_A.potential_ship_squares[1],
          Gameboard_A.potential_ship_squares[2],
          Gameboard_A.potential_ship_squares[3],
          Gameboard_A.potential_ship_squares[4],
          Gameboard_A.potential_ship_squares[5],
          Gameboard_A.potential_ship_squares[6],
          Gameboard_A.potential_ship_squares[7],
          Gameboard_A.potential_ship_squares[8],
          Gameboard_A.potential_ship_squares[9]
        ),
        []
      );

      const are_adjacent_squares_in_ship_squares = (
        ship_array_number,
        all_ships_squares
      ) => {
        let existance = false;
        for (let i = 0; i < all_ships_squares.length; i++) {
          for (
            let j = 0;
            j < Gameboard_A.adjacent_squares[ship_array_number].length;
            j++
          )
            if (
              all_ships_squares[i].x ==
                Gameboard_A.adjacent_squares[ship_array_number][j].x &&
              all_ships_squares[i].y ==
                Gameboard_A.adjacent_squares[ship_array_number][j].y
            ) {
              existance = true;
            }
        }
        return existance;
      };

      if (
        !are_adjacent_squares_in_ship_squares(
          ship_array_number,
          all_ships_squares
        )
      )
        if (id == "src_move_1" && target_square.x > 7) {
          // make sure every ship is placed within the board
          alert("Please place the ship within the board");
        } else if (id == "src_move_2" && target_square.x > 8) {
          alert("Please place the ship within the board");
        } else if (id == "src_move_3" && target_square.y > 8) {
          alert("Please place the ship within the board");
        } else if (id == "src_move_4" && target_square.x > 9) {
          alert("Please place the ship within the board");
        } else if (id == "src_move_5" && target_square.x > 9) {
          alert("Please place the ship within the board");
        } else if (id == "src_move_6" && target_square.y > 9) {
          alert("Please place the ship within the board");
        } else ev.target.appendChild(document.getElementById(id));

      // check if the drop event succeeds
      Gameboard_A.place_ship_status[ship_array_number] =
        ev.target.hasChildNodes();
      if (!Gameboard_A.place_ship_status[ship_array_number]) {
        Gameboard_A.potential_ship_squares[ship_array_number].length = 0;
        Gameboard_A.adjacent_squares[ship_array_number].length = 0;
      }
    }

    const place_your_board = (your_grid) => {
      const board_div = document.querySelector(".your_grid");
      board_div.innerHTML = "";
      for (let i = 1; i <= 10; i++) {
        const board_row = document.createElement("div");
        for (let j = 1; j <= 10; j++) {
          const board_square = document.createElement("div");
          board_square.setAttribute("id", `${i}your${j}`);
          board_square.classList.add("board_square");

          board_square.addEventListener("drop", drop_handler);
          board_square.addEventListener("dragover", dragover_handler);

          board_square.classList.add("your_square");
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

    const game_on = () => {
      place_your_board(Gameboard_A);

      const all_ships = document.querySelectorAll(".ship");
      all_ships.forEach((element) => {
        element.addEventListener("dragstart", dragstart_handler);
        element.addEventListener("dragend", dragend_handler);
      });

      const start_game_listener = document.querySelector(".start_the_game");
      start_game_listener.addEventListener("click", () => {
        let are_all_ships_placed = true;
        let i = 0;
        for (; i < 10; i++)
          if (Gameboard_A.potential_ship_squares[i].length == 0) {
            are_all_ships_placed = false;
            i = 0;
            break;
          }
        if (i == 10 && !Gameboard_A.place_ship_status.includes(false)) {
          initialize_Gameboard_A();

          display_your_board(Gameboard_A);
          display_oppo_board(Gameboard_B);
          computer_move();
        } else alert("Please place all your ships.");
      });
    };

    return {
      display_your_board,
      display_oppo_board,
      Gameboard_A,
      Gameboard_B,
      game_on,
    };
  })();

  Game.game_on();
}

import { shallowMount } from "@vue/test-utils";
import Board from "@/components/Board.vue";
import { STATE, SIZE, TARGET } from "@/components/Board.vue";

describe("Board.vue", () => {
  describe("startGame", () => {
    let addRandomMockTile;
    beforeEach(() => {
      addRandomMockTile = jest.fn();
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 0,
          col: 2,
          value: 4
        });
    });

    it("randomTiles assigns two numbers to tiles", () => {
      const board = shallowMount(Board, {});
      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      expect(addRandomMockTile.mock.instances.length).toBe(2);
      expect(addRandomMockTile.mock.results[0].value).toEqual({
        row: 0,
        col: 1,
        value: 2
      });
      expect(addRandomMockTile.mock.results[1].value).toEqual({
        row: 0,
        col: 2,
        value: 4
      });

      expect(board.vm.tiles[0][1]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[0][2]).toEqual({
        value: 4,
        merged: false
      });
    });
  });

  describe("moveLeft", () => {
    let addRandomMockTile;
    let board;
    beforeEach(() => {
      addRandomMockTile = jest.fn();
      board = shallowMount(Board, {});
    });

    it("moveLeft moves tiles to empty tiles", () => {
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 1,
          value: 4
        })
        .mockReturnValueOnce({
          row: 1,
          col: 3,
          value: 2
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.moveLeft();

      expect(board.vm.tiles[0][0]).toEqual({
        value: 2,
        merged: false
      });

      expect(board.vm.tiles[1][0]).toEqual({
        value: 4,
        merged: false
      });

      board.vm.moveLeft();
      expect(board.vm.tiles[1][1]).toEqual({
        value: 2,
        merged: false
      });

      expect(board.vm.gameState).toEqual(STATE.running);
    });

    it("moveLeft merge two tiles with same value into one", () => {
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 1,
          value: 4
        })
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 1,
          value: 4
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.moveLeft();
      expect(board.vm.tiles[0][0]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[1][0]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[0][1]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[1][1]).toEqual({
        value: -1,
        merged: false
      });

      board.vm.moveLeft();
      expect(board.vm.tiles[0][0]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[1][0]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[1][1]).toEqual({
        value: 4,
        merged: false
      });

      board.vm.moveLeft();
      expect(board.vm.tiles[0][0]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[1][0]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[1][1]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.gameState).toEqual(STATE.running);
    });

    it("moveLeft does not merge tiles greedily", () => {
      // 1st row of grid is
      // [ [2, 2, 4, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      // move left
      // [ [4, 4, -1, -1], [-1, -1, -1, 2], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      // move left
      // [ [8, -1, -1, -1], [2, -1, -1, -1], [-1, -1, -1, 2], [-1, -1, -1, -1] ]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 0,
          value: 2
        })
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 3,
          value: 2
        })
        .mockReturnValueOnce({
          row: 2,
          col: 3,
          value: 2
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.tiles[0][2].value = 4;
      board.vm.tiles[0][2].merged = false;
      board.vm.moveLeft();
      expect(board.vm.tiles[0][0]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[0][1]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[1][3]).toEqual({
        value: 2,
        merged: false
      });

      board.vm.moveLeft();
      expect(board.vm.tiles[0][0]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[0][1]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[1][0]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[1][3]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[2][3]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.gameState).toEqual(STATE.running);
    });

    it("moveLeft merge several tiles non greedily", () => {
      // 1st row of grid is
      // [ [2, 2, 2, 2], [4, 4, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      // move left
      // [ [4, 4, -1, -1], [8, -1, -1, 2], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      // move left
      // [ [8, -1, -1, -1], [8, 2, -1, -1], [-1, -1, -1, 2], [-1, -1, -1, -1] ]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 0,
          value: 2
        })
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 3,
          value: 2
        })
        .mockReturnValueOnce({
          row: 2,
          col: 3,
          value: 2
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.tiles[0][2].value = 2;
      board.vm.tiles[0][2].merged = false;
      board.vm.tiles[0][3].value = 2;
      board.vm.tiles[0][3].merged = false;
      board.vm.tiles[1][0].value = 4;
      board.vm.tiles[1][0].merged = false;
      board.vm.tiles[1][1].value = 4;
      board.vm.tiles[1][1].merged = false;
      board.vm.moveLeft();
      expect(board.vm.tiles[0][0]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[0][1]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[0][2]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[0][3]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[1][0]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[1][1]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[1][2]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[1][3]).toEqual({
        value: 2,
        merged: false
      });
      for (let i = 2; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }

      board.vm.moveLeft();
      expect(board.vm.tiles[0][0]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[0][1]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[0][2]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[0][3]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[1][0]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[1][1]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[1][2]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[1][3]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[2][3]).toEqual({
        value: 2,
        merged: false
      });
      for (let i = 2; i < SIZE; i++) {
        for (let j = 0; j < SIZE - 1; j++) {
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }
      expect(board.vm.tiles[3][3]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.gameState).toEqual(STATE.running);
    });

    it("moveLeft can merge tiles and win game if 2048 is spotted", () => {
      // 1st row of grid is
      // [ [2, 1024, 1024, 2], [4, 4, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      // move left
      // [ [2, 2048, 2, -1], [8, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 0,
          value: 2
        })
        .mockReturnValueOnce({
          row: 0,
          col: 3,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 3,
          value: 2
        })
        .mockReturnValueOnce({
          row: 2,
          col: 3,
          value: 2
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.tiles[0][1].value = 1024;
      board.vm.tiles[0][1].merged = false;
      board.vm.tiles[0][2].value = 1024;
      board.vm.tiles[0][2].merged = false;
      board.vm.tiles[1][0].value = 4;
      board.vm.tiles[1][0].merged = false;
      board.vm.tiles[1][1].value = 4;
      board.vm.tiles[1][1].merged = false;
      board.vm.moveLeft();
      expect(board.vm.tiles[0][0]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[0][1]).toEqual({
        value: TARGET,
        merged: true
      });
      expect(board.vm.tiles[0][2]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[0][3]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[1][0]).toEqual({
        value: 8,
        merged: true
      });
      for (let i = 2; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i === 2 && j === 0) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }
      expect(board.vm.gameState).toEqual(STATE.won);
    });
  });

  describe("moveRight", () => {
    let addRandomMockTile;
    let board;
    beforeEach(() => {
      addRandomMockTile = jest.fn();
      board = shallowMount(Board, {});
    });

    it("moveRight moves tiles to empty tiles and combines tiles with same value", () => {
      // [[-1, 2, -1, -1], [-1, 2, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1]]
      // [[-1, -1, -1, 2], [2, -1, -1, 2], [-1, -1, -1, -1], [-1, -1, -1, -1]]
      // [[-1, -1, -1, 2], [-1, -1, -1, 4], [-1, -1, -1, -1], [-1, -1, 4, -1]]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 0,
          value: 2
        })
        .mockReturnValueOnce({
          row: 3,
          col: 2,
          value: 4
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.moveRight();
      expect(board.vm.tiles[0][3]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[1][3]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[1][0]).toEqual({
        value: 2,
        merged: false
      });

      board.vm.moveRight();
      expect(board.vm.tiles[0][3]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[1][3]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[3][2]).toEqual({
        value: 4,
        merged: false
      });

      for (let i = 0; i < SIZE - 1; i++) {
        for (let j = 0; j < SIZE - 1; j++) {
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }
      expect(board.vm.tiles[2][3]).toEqual({
        value: -1,
        merged: false
      });
      for (let j = 0; j < 3; j++) {
        if (j === 2) continue;
        expect(board.vm.tiles[3][j]).toEqual({
          value: -1,
          merged: false
        });
      }
    });

    it("moveRight does not merge tiles greedily", () => {
      // 1st row of grid is
      // [ [2, 2, 4, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      // move right
      // [ [-1, -1, 4, 4], [2, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      // move right
      // [ [-1, -1, -1, 8], [-1, -1, -1, 2], [2, -1, -1, -1], [-1, -1, -1, -1] ]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 0,
          value: 2
        })
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 0,
          value: 2
        })
        .mockReturnValueOnce({
          row: 2,
          col: 0,
          value: 2
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.tiles[0][2].value = 4;
      board.vm.tiles[0][2].merged = false;
      board.vm.moveRight();
      expect(board.vm.tiles[0][2]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[0][3]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[0][0]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[0][1]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[1][0]).toEqual({
        value: 2,
        merged: false
      });

      for (let i = 1; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i === 1 && j === 0) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }

      board.vm.moveRight();
      expect(board.vm.tiles[0][3]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[0][0]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[0][1]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[0][2]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[1][3]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[2][0]).toEqual({
        value: 2,
        merged: false
      });

      for (let i = 1; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i === 1 && j === 3) continue;
          if (i === 2 && j === 0) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }
      expect(board.vm.gameState).toEqual(STATE.running);
    });

    it("moveRight merge several tiles non greedily", () => {
      // 1st row of grid is
      // [ [2, 2, 2, 2], [4, 4, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      // move right
      // [ [-1, -1, 4, 4], [-1, -1, 2, 8], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      // move right
      // [ [-1, -1, -1, 8], [-1, -1, 2, 8], [-1, -1, -1, 2], [-1, -1, -1, -1] ]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 0,
          value: 2
        })
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 2,
          value: 2
        })
        .mockReturnValueOnce({
          row: 2,
          col: 3,
          value: 2
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.tiles[0][2].value = 2;
      board.vm.tiles[0][2].merged = false;
      board.vm.tiles[0][3].value = 2;
      board.vm.tiles[0][3].merged = false;
      board.vm.tiles[1][0].value = 4;
      board.vm.tiles[1][0].merged = false;
      board.vm.tiles[1][1].value = 4;
      board.vm.tiles[1][1].merged = false;
      board.vm.moveRight();
      expect(board.vm.tiles[0][2]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[0][3]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[1][3]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[1][2]).toEqual({
        value: 2,
        merged: false
      });
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i === 0 && (j === 2 || j === 3)) continue;
          if (i === 1 && (j === 2 || j === 3)) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }

      board.vm.moveRight();
      expect(board.vm.tiles[0][3]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[1][3]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[1][2]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[2][3]).toEqual({
        value: 2,
        merged: false
      });
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i === 0 && j === 3) continue;
          if (i === 1 && (j === 2 || j === 3)) continue;
          if (i === 2 && j === 3) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }
      expect(board.vm.gameState).toEqual(STATE.running);
    });

    it("moveRight can merge tiles and win game if 2048 is spotted", () => {
      // 1st row of grid is
      // [ [2, 1024, 1024, 2], [4, 4, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      // move right
      // [ [-1, 2, 2048, 2], [-1, -1, -1, 8], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 0,
          value: 2
        })
        .mockReturnValueOnce({
          row: 0,
          col: 3,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 3,
          value: 2
        })
        .mockReturnValueOnce({
          row: 2,
          col: 3,
          value: 2
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.tiles[0][1].value = 1024;
      board.vm.tiles[0][1].merged = false;
      board.vm.tiles[0][2].value = 1024;
      board.vm.tiles[0][2].merged = false;
      board.vm.tiles[1][0].value = 4;
      board.vm.tiles[1][0].merged = false;
      board.vm.tiles[1][1].value = 4;
      board.vm.tiles[1][1].merged = false;
      board.vm.moveRight();
      expect(board.vm.tiles[0][0]).toEqual({
        value: -1,
        merged: false
      });
      expect(board.vm.tiles[0][1]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[0][2]).toEqual({
        value: TARGET,
        merged: true
      });
      expect(board.vm.tiles[0][3]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[1][3]).toEqual({
        value: 8,
        merged: true
      });
      for (let i = 2; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i === 2 && j === 3) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }
      expect(board.vm.gameState).toEqual(STATE.won);
    });
  });

  describe("moveUp", () => {
    let addRandomMockTile;
    let board;
    beforeEach(() => {
      addRandomMockTile = jest.fn();
      board = shallowMount(Board, {});
    });

    it("moveUp moves tiles to empty tiles and combines tiles with same value", () => {
      // [[-1, 2, -1, -1], [-1, -1, -1, 2], [-1, -1, -1, -1], [-1, -1, -1, -1]]
      // [[-1, 2, -1, 2], [-1, -1, -1, -1], [-1, -1, 2, -1], [-1, -1, -1, -1]]
      // [[-1, 2, 2, 2], [-1, 2, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1]]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 3,
          value: 2
        })
        .mockReturnValueOnce({
          row: 2,
          col: 2,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 1,
          value: 2
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.moveUp();
      expect(board.vm.tiles[0][1]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[0][3]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[2][2]).toEqual({
        value: 2,
        merged: false
      });

      board.vm.moveUp();
      expect(board.vm.tiles[0][1]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[0][2]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[0][3]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[1][1]).toEqual({
        value: 2,
        merged: false
      });
      for (let i = 0; i < SIZE - 1; i++) {
        for (let j = 0; j < SIZE - 1; j++) {
          if (i == 0 && j !== 0) continue;
          if (i == 1 && j === 1) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }
      expect(board.vm.gameState).toEqual(STATE.running);
    });

    it("moveUp does not merge tiles greedily", () => {
      // 1st row of grid is
      // [ [-1, -1, 2, -1], [-1, -1, -1, -1], [-1, -1, 2, -1], [-1, -1, 2, -1] ]
      // move up
      // [ [-1, -1, 4, -1], [-1, -1, 2, -1], [-1, -1, -1, -1], [-1, -1, 2, -1] ]
      // move up
      // [ [-1, -1, 4, -1], [-1, -1, 4, -1], [-1, -1, -1, -1], [-1, -1, -1, 4] ]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 2,
          value: 2
        })
        .mockReturnValueOnce({
          row: 2,
          col: 2,
          value: 2
        })
        .mockReturnValueOnce({
          row: 3,
          col: 2,
          value: 2
        })
        .mockReturnValueOnce({
          row: 3,
          col: 3,
          value: 4
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.tiles[3][2].value = 2;
      board.vm.tiles[3][2].merged = false;
      board.vm.moveUp();
      expect(board.vm.tiles[0][2]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[1][2]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[3][2]).toEqual({
        value: 2,
        merged: false
      });
      for (let i = 1; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i !== 2 && j === 2) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }

      board.vm.moveUp();
      expect(board.vm.tiles[0][2]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[1][2]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[3][3]).toEqual({
        value: 4,
        merged: false
      });
      for (let i = 1; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if ((i === 0 || i === 1) && j === 2) continue;
          if (i === 3 && j === 3) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }
      expect(board.vm.gameState).toEqual(STATE.running);
    });

    it("moveUp merge several tiles non greedily", () => {
      // 1st row of grid is
      // [ [-1, 2, -1, -1], [-1, 2, -1, 4], [-1, 2, -1, -1], [-1, 2, -1, 4] ]
      // move up
      // [ [-1, 4, -1, 8], [-1, 4, -1, -1], [-1, -1, -1, -1], [-1, 2, -1, -1] ]
      // move up
      // [ [2, 8, -1, 8], [-1, 2, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 3,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 0,
          col: 0,
          value: 2
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.tiles[2][1].value = 2;
      board.vm.tiles[2][1].merged = false;
      board.vm.tiles[3][1].value = 2;
      board.vm.tiles[3][1].merged = false;
      board.vm.tiles[1][3].value = 4;
      board.vm.tiles[1][3].merged = false;
      board.vm.tiles[3][3].value = 4;
      board.vm.tiles[3][3].merged = false;
      board.vm.moveUp();
      expect(board.vm.tiles[0][1]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[1][1]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[0][3]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[3][1]).toEqual({
        value: 2,
        merged: false
      });
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i === 0 && (j === 1 || j === 3)) continue;
          if ((i === 1 || i === 3) && j === 1) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }

      // [ [2, 8, -1, 8], [-1, 2, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      board.vm.moveUp();
      expect(board.vm.tiles[0][1]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[1][1]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[0][3]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[0][0]).toEqual({
        value: 2,
        merged: false
      });
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i === 0 && j !== 2) continue;
          if (i === 1 && j === 1) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }
      expect(board.vm.gameState).toEqual(STATE.running);
    });

    it("moveUp can merge tiles and win game if 2048 is spotted", () => {
      // 1st row of grid is
      // [ [-1, -1, -1, -1], [-1, -1, -1, -1], [2, 1024, -1, 2], [4, 1024, -1, -1] ]
      // move down
      // [ [2, 2048, -1, 2], [4, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 2,
          col: 0,
          value: 2
        })
        .mockReturnValueOnce({
          row: 3,
          col: 0,
          value: 4
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.tiles[2][1].value = 1024;
      board.vm.tiles[2][1].merged = false;
      board.vm.tiles[3][1].value = 1024;
      board.vm.tiles[3][1].merged = false;
      board.vm.tiles[2][3].value = 2;
      board.vm.tiles[2][3].merged = false;
      board.vm.moveUp();
      expect(board.vm.tiles[0][0]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[1][0]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[0][1]).toEqual({
        value: TARGET,
        merged: true
      });
      expect(board.vm.tiles[0][3]).toEqual({
        value: 2,
        merged: false
      });
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i === 0 && j !== 2) continue;
          if (i === 1 && j === 0) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }
      expect(board.vm.gameState).toEqual(STATE.won);
    });
  });

  describe("moveDown", () => {
    let addRandomMockTile;
    let board;
    beforeEach(() => {
      addRandomMockTile = jest.fn();
      board = shallowMount(Board, {});
    });

    it("moveDown moves tiles to empty tiles and combines tiles with same value", () => {
      // [[-1, 2, -1, -1], [-1, -1, 2, -1], [-1, -1, -1, -1], [-1, -1, -1, -1]]
      // [[-1, 2, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, 2, 2, -1]]
      // [[-1, 2, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, 4, 2, -1]]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 2,
          value: 2
        })
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.moveDown();
      expect(board.vm.tiles[3][1]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[3][2]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[0][1]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[1][2]).toEqual({
        value: -1,
        merged: false
      });
      for (let i = 0; i < SIZE - 1; i++) {
        for (let j = 0; j < SIZE - 1; j++) {
          if (i == 3 && (j == 1 || j == 2)) continue;
          if (i == 0 && j == 1) continue;
          if (i == 1 && j == 2) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }

      board.vm.moveDown();
      expect(board.vm.tiles[3][1]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[3][2]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[0][1]).toEqual({
        value: 2,
        merged: false
      });

      for (let i = 0; i < SIZE - 1; i++) {
        for (let j = 0; j < SIZE - 1; j++) {
          if (i == 3 && (j == 1 || j == 2)) continue;
          if (i == 0 && j == 1) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }
      expect(board.vm.gameState).toEqual(STATE.running);
    });

    it("moveDown does not merge tiles greedily", () => {
      // 1st row of grid is
      // [ [-1, 4, -1, -1], [-1, 2, -1, 2], [-1, 2, -1, -1], [-1, -1, -1, 2] ]
      // move down
      // [ [-1, -1, -1, -1], [-1, -1, -1, 2], [-1, 4, -1, -1], [-1, 4, -1, 4] ]
      // move down
      // [ [-1, -1, -1, -1], [-1, -1, -1, 2], [-1, -1, -1, 2], [-1,  8, -1, 4] ]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 4
        })
        .mockReturnValueOnce({
          row: 1,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 3,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 3,
          value: 2
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.tiles[2][1].value = 2;
      board.vm.tiles[2][1].merged = false;
      board.vm.tiles[1][3].value = 2;
      board.vm.tiles[1][3].merged = false;
      board.vm.tiles[3][3].value = 2;
      board.vm.tiles[3][3].merged = false;
      board.vm.moveDown();

      expect(board.vm.tiles[2][1]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[3][1]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[3][3]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[1][3]).toEqual({
        value: 2,
        merged: false
      });
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i === 1 && j === 3) continue;
          if (i === 2 && j === 1) continue;
          if (i === 3 && (j === 1 || j === 3)) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }

      // move down
      // [ [-1, -1, -1, -1], [-1, -1, -1, 2], [-1, -1, -1, 2], [-1,  8, -1, 4] ]
      board.vm.moveDown();
      expect(board.vm.tiles[1][3]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[2][3]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[3][1]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[3][3]).toEqual({
        value: 4,
        merged: false
      });
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i === 1 && j === 3) continue;
          if (i === 2 && j === 3) continue;
          if (i === 3 && (j === 1 || j === 3)) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }
      expect(board.vm.gameState).toEqual(STATE.running);
    });

    it("moveDown merge several tiles non greedily", () => {
      // 1st row of grid is
      // [ [-1, 2, 2, -1], [-1, 2, 2, -1], [-1, 2, 2, -1], [-1, 2, -1, -1] ]
      // move down
      // [ [2, -1, -1, -1], [-1, -1, -1, -1], [-1, 4, 2, -1], [-1, 4, 4, -1] ]
      // move down
      // [ [-1, -1, -1, -1], [-1, -1, -1, -1], [2, -1, 2, -1], [2, 8, 4, -1] ]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 1,
          value: 2
        })
        .mockReturnValueOnce({
          row: 0,
          col: 2,
          value: 2
        })
        .mockReturnValueOnce({
          row: 0,
          col: 0,
          value: 2
        })
        .mockReturnValueOnce({
          row: 2,
          col: 0,
          value: 2
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.tiles[1][1].value = 2;
      board.vm.tiles[1][1].merged = false;
      board.vm.tiles[2][1].value = 2;
      board.vm.tiles[2][1].merged = false;
      board.vm.tiles[3][1].value = 2;
      board.vm.tiles[3][1].merged = false;
      board.vm.tiles[1][2].value = 2;
      board.vm.tiles[1][2].merged = false;
      board.vm.tiles[2][2].value = 2;
      board.vm.tiles[2][2].merged = false;

      board.vm.moveDown();
      expect(board.vm.tiles[2][1]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[2][2]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[3][1]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[3][2]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[0][0]).toEqual({
        value: 2,
        merged: false
      });
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i === 0 && j === 0) continue;
          if (i === 2 && (j === 1 || j === 2)) continue;
          if (i === 3 && (j === 1 || j === 2)) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }

      board.vm.moveDown();
      expect(board.vm.tiles[2][0]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[2][2]).toEqual({
        value: 2,
        merged: false
      });

      expect(board.vm.tiles[3][0]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[3][1]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[3][2]).toEqual({
        value: 4,
        merged: false
      });
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i === 2 && (j === 0 || j === 2)) continue;
          if (i === 3 && j < SIZE - 1) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }
      expect(board.vm.gameState).toEqual(STATE.running);
    });

    it("moveDown can merge tiles and win game if 2048 is spotted", () => {
      // 1st row of grid is
      // [ [2, 1024, -1, 2], [4, 1024, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
      // move down
      // [ [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [4, 2048, -1, 2] ]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 0,
          value: 2
        })
        .mockReturnValueOnce({
          row: 1,
          col: 0,
          value: 4
        });

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.tiles[0][1].value = 1024;
      board.vm.tiles[0][1].merged = false;
      board.vm.tiles[1][1].value = 1024;
      board.vm.tiles[1][1].merged = false;
      board.vm.tiles[0][3].value = 2;
      board.vm.tiles[0][3].merged = false;
      board.vm.moveDown();
      expect(board.vm.tiles[2][0]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[3][0]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[3][1]).toEqual({
        value: TARGET,
        merged: true
      });
      expect(board.vm.tiles[3][3]).toEqual({
        value: 2,
        merged: false
      });
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (i === 2 && j === 0) continue;
          if (i === 3 && (j === 0 || j === 1 || j === 3)) continue;
          expect(board.vm.tiles[i][j]).toEqual({
            value: -1,
            merged: false
          });
        }
      }
      expect(board.vm.gameState).toEqual(STATE.won);
    });
  });

  describe("Lose game", () => {
    let addRandomMockTile;
    let board;
    beforeEach(() => {
      addRandomMockTile = jest.fn();
      board = shallowMount(Board, {});
    });

    it("moveRight merges tiles and no move is available", () => {
      // 1st row of grid is
      // [ [2, 2, 8, 2], [4, 8, 128, 4], [8, 32, 64, 32], [2, 4, 8, 4] ]
      // move right
      // [ [2, 4, 8, 2], [4, 8, 128, 4], [8, 32, 64, 32], [2, 4, 8, 4] ]
      addRandomMockTile
        .mockReturnValueOnce({
          row: 0,
          col: 0,
          value: 2
        })
        .mockReturnValueOnce({
          row: 0,
          col: 3,
          value: 2
        })
        .mockReturnValueOnce({
          row: 0,
          col: 0,
          value: 2
        });

      const tiles = [
        [2, 2, 8, 2],
        [4, 8, 128, 4],
        [8, 32, 64, 32],
        [2, 4, 8, 4]
      ];

      board.vm.addRandomTile = addRandomMockTile;
      board.vm.startGame();
      board.vm.clone(tiles);
      board.vm.moveRight();
      expect(board.vm.tiles[0][0]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[0][1]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[0][2]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[0][3]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[1][0]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[1][1]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[1][2]).toEqual({
        value: 128,
        merged: false
      });
      expect(board.vm.tiles[1][3]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[2][0]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[2][1]).toEqual({
        value: 32,
        merged: false
      });
      expect(board.vm.tiles[2][2]).toEqual({
        value: 64,
        merged: false
      });
      expect(board.vm.tiles[2][3]).toEqual({
        value: 32,
        merged: false
      });
      expect(board.vm.tiles[3][0]).toEqual({
        value: 2,
        merged: false
      });
      expect(board.vm.tiles[3][1]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.tiles[3][2]).toEqual({
        value: 8,
        merged: false
      });
      expect(board.vm.tiles[3][3]).toEqual({
        value: 4,
        merged: false
      });
      expect(board.vm.gameState).toEqual(STATE.over);
    });
  });

  describe("addRandomTile", () => {
    let board;
    beforeEach(() => {
      board = shallowMount(Board);
    });

    it("assign to empty board", () => {
      const { row, col, value } = board.vm.addRandomTile();
      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(SIZE);
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(SIZE);
      expect([2, 4]).toContainEqual(value);
    });

    it("occupied tiles are not occupied", () => {
      // [ [8, 16, 16, 32], [-1, 32, -1, -1], [-1, 64, -1, -1], [-1, 128, -1, -1] ]
      board.vm.tiles[0][0].value = 8;
      board.vm.tiles[0][0].merged = false;
      board.vm.tiles[0][1].value = 16;
      board.vm.tiles[0][1].merged = false;
      board.vm.tiles[0][2].value = 16;
      board.vm.tiles[0][2].merged = false;
      board.vm.tiles[0][3].value = 32;
      board.vm.tiles[0][3].merged = false;
      board.vm.tiles[1][1].value = 32;
      board.vm.tiles[1][1].merged = false;
      board.vm.tiles[2][1].value = 64;
      board.vm.tiles[2][1].merged = false;
      board.vm.tiles[3][1].value = 128;
      board.vm.tiles[3][1].merged = false;

      const { row, col, value } = board.vm.addRandomTile();
      expect([1, 2, 3]).toContainEqual(row);
      expect([0, 2, 3]).toContainEqual(col);
      expect([2, 4]).toContainEqual(value);
    });
  });
});

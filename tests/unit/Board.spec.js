import { shallowMount } from "@vue/test-utils";
import Board from "@/components/Board.vue";
import { STATE, SIZE, TARGET, KEYCODE } from "@/components/Board.vue";

describe("Board.vue", () => {
    describe("startGame", () => {
        let addRandomMockTile;
        beforeEach(() => {
            addRandomMockTile = jest.fn();
            addRandomMockTile
                .mockReturnValueOnce({
                    row: 0,
                    col: 1,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 2,
                    value: 4,
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
                value: 2,
            });
            expect(addRandomMockTile.mock.results[1].value).toEqual({
                row: 0,
                col: 2,
                value: 4,
            });

            expect(board.find(".tile-1-2 > span").text()).toBe("2");
            expect(board.find(".tile-1-3 > span").text()).toBe("4");

            expect(board.findAll(".tile-new").exists()).toBe(false);
            expect(board.findAll(".tile-merged").exists()).toBe(false);

            expect(board.vm.tiles[0][1]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });

            expect(board.vm.tiles[0][2]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
        });
    });

    describe("moveLeft", () => {
        let addRandomMockTile;
        let board;
        beforeEach(() => {
            jest.useFakeTimers();
            addRandomMockTile = jest.fn();
            board = shallowMount(Board, {});
        });

        it("moveLeft moves tiles to empty tiles", () => {
            addRandomMockTile
                .mockReturnValueOnce({
                    row: 0,
                    col: 1,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 1,
                    value: 4,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 3,
                    value: 2,
                });

            board.vm.addRandomTile = addRandomMockTile;
            board.vm.startGame();
            board.vm.moveLeft();

            // Fast-forward until all timers have been executed
            jest.runAllTimers();

            expect(board.find(".tile-1-1 > span").text()).toBe("2");
            expect(board.find(".tile-2-1 > span").text()).toBe("4");
            expect(board.find(".tile-2-4 > span").text()).toBe("2");

            expect(board.findAll(".tile-new").exists()).toBe(true);
            expect(board.findAll(".tile-merged").exists()).toBe(false);

            expect(board.vm.tiles[0][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });

            expect(board.vm.tiles[1][0]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });

            board.vm.moveLeft();
            jest.runAllTimers();

            expect(board.find(".tile-1-1 > span").text()).toBe("2");
            expect(board.find(".tile-2-1 > span").text()).toBe("4");
            expect(board.find(".tile-2-2 > span").text()).toBe("2");

            expect(board.findAll(".tile-new").exists()).toBe(false);
            expect(board.findAll(".tile-merged").exists()).toBe(false);

            expect(board.vm.tiles[1][1]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.numMoves).toEqual(2);
            expect(board.vm.highest).toEqual(0);
            expect(board.vm.score).toEqual(0);
            expect(board.vm.gameState).toEqual(STATE.running);
        });

        it("moveLeft merge two tiles with same value into one", () => {
            // 1st row of grid is
            // [ [-1, 2, -1, -1], [-1, 4, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
            // move left
            // [ [2, 2, -1, -1], [4, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
            // move left
            // [ [4, -1, -1, -1], [4, 4, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
            // move left
            // [ [4, -1, -1, -1], [8, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
            addRandomMockTile
                .mockReturnValueOnce({
                    row: 0,
                    col: 1,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 1,
                    value: 4,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 1,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 1,
                    value: 4,
                });

            board.vm.addRandomTile = addRandomMockTile;
            board.vm.startGame();
            board.vm.moveLeft();
            jest.runAllTimers();

            expect(board.find(".tile-1-1 > span").text()).toBe("2");
            expect(board.find(".tile-2-1 > span").text()).toBe("4");
            expect(board.find(".tile-1-2 > span").text()).toBe("2");
            expect(board.find(".tile-2-2 > span").exists()).toBe(false);

            expect(board.findAll(".tile-new").exists()).toBe(true);
            expect(board.findAll(".tile-merged").exists()).toBe(false);
            expect(board.find("div.stats > .score:first-child").text()).toBe("Num Moves: 1");
            expect(board.find("div.stats > .score:nth-of-type(2)").text()).toBe("Current highest tile: 0");
            expect(board.find("div.stats > .score:last-child").text()).toBe("Score: 0");

            expect(board.vm.tiles[0][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][0]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][1]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            expect(board.vm.tiles[1][1]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.score).toEqual(0);

            board.vm.moveLeft();

            expect(board.findAll(".tile-merged").exists()).toBe(true);

            jest.runAllTimers();

            expect(board.find(".tile-1-1 > span").text()).toBe("4");
            expect(board.find(".tile-2-1 > span").text()).toBe("4");
            expect(board.find(".tile-2-2 > span").text()).toBe("4");

            expect(board.findAll(".tile-new").exists()).toBe(true);
            expect(board.findAll(".tile-merged").exists()).toBe(false);
            expect(board.find("div.stats > .score:first-child").text()).toBe("Num Moves: 2");
            expect(board.find("div.stats > .score:nth-of-type(2)").text()).toBe("Current highest tile: 4");
            expect(board.find("div.stats > .score:last-child").text()).toBe("Score: 2");

            expect(board.vm.tiles[0][0]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][0]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][1]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: true,
            });
            expect(board.vm.score).toEqual(2);

            board.vm.moveLeft();

            expect(board.findAll(".tile-merged").exists()).toBe(true);

            jest.runAllTimers();

            expect(board.find(".tile-1-1 > span").text()).toBe("4");
            expect(board.find(".tile-2-1 > span").text()).toBe("8");
            expect(board.find(".tile-2-2 > span").exists()).toBe(false);

            expect(board.findAll(".tile-new").exists()).toBe(false);
            expect(board.findAll(".tile-merged").exists()).toBe(false);
            expect(board.find("div.stats > .score:first-child").text()).toBe("Num Moves: 3");
            expect(board.find("div.stats > .score:nth-of-type(2)").text()).toBe("Current highest tile: 8");
            expect(board.find("div.stats > .score:last-child").text()).toBe("Score: 6");

            expect(board.vm.tiles[0][0]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][0]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][1]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.numMoves).toEqual(3);
            expect(board.vm.highest).toEqual(8);
            expect(board.vm.score).toEqual(6);
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 1,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 3,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 2,
                    col: 3,
                    value: 2,
                });

            board.vm.addRandomTile = addRandomMockTile;
            board.vm.startGame();
            board.vm.tiles[0][2].value = 4;
            board.vm.tiles[0][2].merged = false;
            board.vm.moveLeft();

            expect(board.findAll(".tile-merged").length).toBe(1);

            jest.runAllTimers();

            expect(board.find(".tile-1-1 > span").text()).toBe("4");
            expect(board.find(".tile-1-2 > span").text()).toBe("4");
            expect(board.find(".tile-2-4 > span").text()).toBe("2");

            expect(board.findAll(".tile-new").length).toBe(1);
            expect(board.findAll(".tile-merged").exists()).toBe(false);

            expect(board.find("div.stats > .score:first-child").text()).toBe("Num Moves: 1");
            expect(board.find("div.stats > .score:nth-of-type(2)").text()).toBe("Current highest tile: 4");
            expect(board.find("div.stats > .score:last-child").text()).toBe("Score: 2");

            expect(board.vm.tiles[0][0]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][1]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            expect(board.vm.score).toEqual(2);

            board.vm.moveLeft();

            expect(board.findAll(".tile-merged").length).toBe(1);

            jest.runAllTimers();

            expect(board.find(".tile-1-1 > span").text()).toBe("8");
            expect(board.find(".tile-2-1 > span").text()).toBe("2");
            expect(board.find(".tile-3-4 > span").text()).toBe("2");
            expect(board.find(".tile-1-2 > span").exists()).toBe(false);
            expect(board.find(".tile-2-4 > span").exists()).toBe(false);

            expect(board.findAll(".tile-new").length).toBe(1);
            expect(board.findAll(".tile-merged").exists()).toBe(false);

            expect(board.find("div.stats > .score:first-child").text()).toBe("Num Moves: 2");
            expect(board.find("div.stats > .score:nth-of-type(2)").text()).toBe("Current highest tile: 8");
            expect(board.find("div.stats > .score:last-child").text()).toBe("Score: 6");

            expect(board.vm.tiles[0][0]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][1]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][3]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[2][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            expect(board.vm.numMoves).toEqual(2);
            expect(board.vm.highest).toEqual(8);
            expect(board.vm.score).toEqual(6);
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 1,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 3,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 2,
                    col: 3,
                    value: 2,
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

            expect(board.findAll(".tile-merged").length).toBe(3);

            jest.runAllTimers();

            expect(board.find(".tile-1-1 > span").text()).toBe("4");
            expect(board.find(".tile-1-2 > span").text()).toBe("4");
            expect(board.find(".tile-2-1 > span").text()).toBe("8");
            expect(board.find(".tile-2-4 > span").text()).toBe("2");

            expect(board.find(".tile-1-3 > span").exists()).toBe(false);
            expect(board.find(".tile-1-4 > span").exists()).toBe(false);
            expect(board.find(".tile-2-2 > span").exists()).toBe(false);
            expect(board.find(".tile-2-3 > span").exists()).toBe(false);

            expect(board.findAll(".tile-new").length).toBe(1);
            expect(board.findAll(".tile-merged").exists()).toBe(false);

            expect(board.find("div.stats > .score:first-child").text()).toBe("Num Moves: 1");
            expect(board.find("div.stats > .score:nth-of-type(2)").text()).toBe("Current highest tile: 8");
            expect(board.find("div.stats > .score:last-child").text()).toBe("Score: 8");

            expect(board.vm.tiles[0][0]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][1]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][2]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][3]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][0]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][1]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][2]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            for (let i = 2; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.score).toEqual(8);

            board.vm.moveLeft();

            expect(board.findAll(".tile-merged").length).toBe(1);

            jest.runAllTimers();

            expect(board.find(".tile-1-1 > span").text()).toBe("8");
            expect(board.find(".tile-2-1 > span").text()).toBe("8");
            expect(board.find(".tile-2-2 > span").text()).toBe("2");
            expect(board.find(".tile-3-4 > span").text()).toBe("2");

            expect(board.find(".tile-1-2 > span").exists()).toBe(false);
            expect(board.find(".tile-1-3 > span").exists()).toBe(false);
            expect(board.find(".tile-1-4 > span").exists()).toBe(false);
            expect(board.find(".tile-2-3 > span").exists()).toBe(false);
            expect(board.find(".tile-2-4 > span").exists()).toBe(false);

            expect(board.findAll(".tile-new").length).toBe(1);
            expect(board.findAll(".tile-merged").exists()).toBe(false);

            expect(board.find("div.stats > .score:first-child").text()).toBe("Num Moves: 2");
            expect(board.find("div.stats > .score:nth-of-type(2)").text()).toBe("Current highest tile: 8");
            expect(board.find("div.stats > .score:last-child").text()).toBe("Score: 12");

            expect(board.vm.tiles[0][0]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][1]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][2]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][3]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][0]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][1]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][2]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][3]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[2][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            for (let i = 2; i < SIZE; i++) {
                for (let j = 0; j < SIZE - 1; j++) {
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.tiles[3][3]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.numMoves).toEqual(2);
            expect(board.vm.highest).toEqual(8);
            expect(board.vm.score).toEqual(12);
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 3,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 3,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 2,
                    col: 3,
                    value: 2,
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

            expect(board.findAll(".tile-merged").length).toBe(2);

            jest.runAllTimers();

            expect(board.find(".tile-1-1 > span").text()).toBe("2");
            expect(board.find(".tile-1-2 > span").text()).toBe("2048");
            expect(board.find(".tile-1-3 > span").text()).toBe("2");
            expect(board.find(".tile-2-1 > span").text()).toBe("8");

            expect(board.find(".tile-1-4 > span").exists()).toBe(false);

            expect(board.findAll(".tile-new").exists()).toBe(false);
            expect(board.findAll(".tile-merged").length).toBe(2);

            expect(board.find("div.stats > .score:first-child").text()).toBe("Num Moves: 1");
            expect(board.find("div.stats > .score:nth-of-type(2)").text()).toBe("Current highest tile: 2048");
            expect(board.find("div.stats > .score:last-child").text()).toBe("Score: 1028");

            expect(board.vm.tiles[0][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][1]).toEqual({
                value: TARGET,
                merged: true,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][2]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][3]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][0]).toEqual({
                value: 8,
                merged: true,
                newlyAdded: false,
            });
            for (let i = 2; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i === 2 && j === 0) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.numMoves).toEqual(1);
            expect(board.vm.highest).toEqual(2048);
            expect(board.vm.score).toEqual(1028);
            expect(board.vm.gameState).toEqual(STATE.won);
        });
    });

    describe("moveRight", () => {
        let addRandomMockTile;
        let board;
        beforeEach(() => {
            jest.useFakeTimers();
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 1,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 0,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 3,
                    col: 2,
                    value: 4,
                });

            board.vm.addRandomTile = addRandomMockTile;
            board.vm.startGame();
            board.vm.moveRight();
            jest.runAllTimers();

            expect(board.find(".tile-1-4 > span").text()).toBe("2");
            expect(board.find(".tile-2-4 > span").text()).toBe("2");
            expect(board.find(".tile-2-1 > span").text()).toBe("2");

            expect(board.findAll(".tile-new").exists()).toBe(true);
            expect(board.findAll(".tile-merged").exists()).toBe(false);

            expect(board.find("div.stats > .score:first-child").text()).toBe("Num Moves: 1");
            expect(board.find("div.stats > .score:nth-of-type(2)").text()).toBe("Current highest tile: 0");
            expect(board.find("div.stats > .score:last-child").text()).toBe("Score: 0");

            expect(board.vm.tiles[0][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            expect(board.vm.score).toEqual(0);

            board.vm.moveRight();
            jest.runAllTimers();

            expect(board.find(".tile-1-4 > span").text()).toBe("2");
            expect(board.find(".tile-2-4 > span").text()).toBe("4");
            expect(board.find(".tile-4-3 > span").text()).toBe("4");

            expect(board.find(".tile-3-4 > span").exists()).toBe(false);

            expect(board.findAll(".tile-new").exists()).toBe(true);
            expect(board.findAll(".tile-merged").exists()).toBe(false);

            expect(board.find("div.stats > .score:first-child").text()).toBe("Num Moves: 2");
            expect(board.find("div.stats > .score:nth-of-type(2)").text()).toBe("Current highest tile: 4");
            expect(board.find("div.stats > .score:last-child").text()).toBe("Score: 2");

            expect(board.vm.tiles[0][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][3]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][2]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: true,
            });

            for (let i = 0; i < SIZE - 1; i++) {
                for (let j = 0; j < SIZE - 1; j++) {
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.tiles[2][3]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            for (let j = 0; j < 3; j++) {
                if (j === 2) continue;
                expect(board.vm.tiles[3][j]).toEqual({
                    value: -1,
                    merged: false,
                    newlyAdded: false,
                });
            }
            expect(board.vm.numMoves).toEqual(2);
            expect(board.vm.highest).toEqual(4);
            expect(board.vm.score).toEqual(2);
            expect(board.vm.gameState).toEqual(STATE.running);
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 1,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 0,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 2,
                    col: 0,
                    value: 2,
                });

            board.vm.addRandomTile = addRandomMockTile;
            board.vm.startGame();
            board.vm.tiles[0][2].value = 4;
            board.vm.tiles[0][2].merged = false;
            board.vm.moveRight();
            jest.runAllTimers();

            expect(board.find(".tile-1-3 > span").text()).toBe("4");
            expect(board.find(".tile-1-4 > span").text()).toBe("4");
            expect(board.find(".tile-2-1 > span").text()).toBe("2");

            expect(board.find(".tile-1-1 > span").exists()).toBe(false);
            expect(board.find(".tile-1-2 > span").exists()).toBe(false);

            expect(board.findAll(".tile-new").exists()).toBe(true);
            expect(board.findAll(".tile-merged").exists()).toBe(false);

            expect(board.find("div.stats > .score:first-child").text()).toBe("Num Moves: 1");
            expect(board.find("div.stats > .score:nth-of-type(2)").text()).toBe("Current highest tile: 4");
            expect(board.find("div.stats > .score:last-child").text()).toBe("Score: 2");

            expect(board.vm.tiles[0][2]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][3]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][0]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][1]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });

            for (let i = 1; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i === 1 && j === 0) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.score).toEqual(2);

            board.vm.moveRight();
            jest.runAllTimers();

            expect(board.find(".tile-1-4 > span").text()).toBe("8");
            expect(board.find(".tile-2-4 > span").text()).toBe("2");
            expect(board.find(".tile-3-1 > span").text()).toBe("2");

            expect(board.find(".tile-1-1 > span").exists()).toBe(false);
            expect(board.find(".tile-1-2 > span").exists()).toBe(false);
            expect(board.find(".tile-1-3 > span").exists()).toBe(false);

            expect(board.findAll(".tile-new").exists()).toBe(true);
            expect(board.findAll(".tile-merged").exists()).toBe(false);

            expect(board.find("div.stats > .score:first-child").text()).toBe("Num Moves: 2");
            expect(board.find("div.stats > .score:nth-of-type(2)").text()).toBe("Current highest tile: 8");
            expect(board.find("div.stats > .score:last-child").text()).toBe("Score: 6");

            expect(board.vm.tiles[0][3]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][0]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][1]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][2]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[2][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });

            for (let i = 1; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i === 1 && j === 3) continue;
                    if (i === 2 && j === 0) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.numMoves).toEqual(2);
            expect(board.vm.highest).toEqual(8);
            expect(board.vm.score).toEqual(6);
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 1,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 2,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 2,
                    col: 3,
                    value: 2,
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
            jest.runAllTimers();

            expect(board.find(".tile-1-3 > span").text()).toBe("4");
            expect(board.find(".tile-1-4 > span").text()).toBe("4");
            expect(board.find(".tile-2-4 > span").text()).toBe("8");
            expect(board.find(".tile-2-3 > span").text()).toBe("2");

            expect(board.findAll(".tile-new").exists()).toBe(true);
            expect(board.findAll(".tile-merged").exists()).toBe(false);

            expect(board.find("div.stats > .score:first-child").text()).toBe("Num Moves: 1");
            expect(board.find("div.stats > .score:nth-of-type(2)").text()).toBe("Current highest tile: 8");
            expect(board.find("div.stats > .score:last-child").text()).toBe("Score: 8");

            expect(board.vm.tiles[0][2]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][3]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][3]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][2]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i === 0 && (j === 2 || j === 3)) continue;
                    if (i === 1 && (j === 2 || j === 3)) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.score).toEqual(8);

            board.vm.moveRight();
            jest.runAllTimers();

            expect(board.find(".tile-1-4 > span").text()).toBe("8");
            expect(board.find(".tile-2-4 > span").text()).toBe("8");
            expect(board.find(".tile-2-3 > span").text()).toBe("2");
            expect(board.find(".tile-3-4 > span").text()).toBe("2");

            expect(board.find(".tile-1-3 > span").exists()).toBe(false);

            expect(board.findAll(".tile-new").exists()).toBe(true);
            expect(board.findAll(".tile-merged").exists()).toBe(false);

            expect(board.find("div.stats > .score:first-child").text()).toBe("Num Moves: 2");
            expect(board.find("div.stats > .score:nth-of-type(2)").text()).toBe("Current highest tile: 8");
            expect(board.find("div.stats > .score:last-child").text()).toBe("Score: 12");

            expect(board.vm.tiles[0][3]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][3]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][2]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[2][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i === 0 && j === 3) continue;
                    if (i === 1 && (j === 2 || j === 3)) continue;
                    if (i === 2 && j === 3) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.numMoves).toEqual(2);
            expect(board.vm.highest).toEqual(8);
            expect(board.vm.score).toEqual(12);
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 3,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 3,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 2,
                    col: 3,
                    value: 2,
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
            jest.runAllTimers();

            expect(board.vm.tiles[0][0]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][1]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][2]).toEqual({
                value: TARGET,
                merged: true,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][3]).toEqual({
                value: 8,
                merged: true,
                newlyAdded: false,
            });
            for (let i = 2; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i === 2 && j === 3) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.numMoves).toEqual(1);
            expect(board.vm.highest).toEqual(2048);
            expect(board.vm.score).toEqual(1028);
            expect(board.vm.gameState).toEqual(STATE.won);
        });
    });

    describe("moveUp", () => {
        let addRandomMockTile;
        let board;
        beforeEach(() => {
            jest.useFakeTimers();
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 3,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 2,
                    col: 2,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 1,
                    value: 2,
                });

            board.vm.addRandomTile = addRandomMockTile;
            board.vm.startGame();

            board.vm.moveUp();
            jest.runAllTimers();

            expect(board.vm.tiles[0][1]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[2][2]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            expect(board.vm.score).toEqual(0);

            board.vm.moveUp();
            jest.runAllTimers();

            expect(board.vm.tiles[0][1]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][2]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][1]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            for (let i = 0; i < SIZE - 1; i++) {
                for (let j = 0; j < SIZE - 1; j++) {
                    if (i == 0 && j !== 0) continue;
                    if (i == 1 && j === 1) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.numMoves).toEqual(2);
            expect(board.vm.highest).toEqual(0);
            expect(board.vm.score).toEqual(0);
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 2,
                    col: 2,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 3,
                    col: 2,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 3,
                    col: 3,
                    value: 4,
                });

            board.vm.addRandomTile = addRandomMockTile;
            board.vm.startGame();
            board.vm.tiles[3][2].value = 2;
            board.vm.tiles[3][2].merged = false;

            board.vm.moveUp();
            jest.runAllTimers();

            expect(board.vm.tiles[0][2]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][2]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][2]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            for (let i = 1; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i !== 2 && j === 2) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.score).toEqual(2);

            board.vm.moveUp();
            jest.runAllTimers();

            expect(board.vm.tiles[0][2]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][2]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][3]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: true,
            });
            for (let i = 1; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if ((i === 0 || i === 1) && j === 2) continue;
                    if (i === 3 && j === 3) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.numMoves).toEqual(2);
            expect(board.vm.highest).toEqual(4);
            expect(board.vm.score).toEqual(4);
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 1,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 3,
                    col: 1,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 0,
                    value: 2,
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
            jest.runAllTimers();

            expect(board.vm.tiles[0][1]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][1]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][3]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][1]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i === 0 && (j === 1 || j === 3)) continue;
                    if ((i === 1 || i === 3) && j === 1) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.score).toEqual(8);

            // [ [2, 8, -1, 8], [-1, 2, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1] ]
            board.vm.moveUp();
            jest.runAllTimers();

            expect(board.vm.tiles[0][1]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][1]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][3]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i === 0 && j !== 2) continue;
                    if (i === 1 && j === 1) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.numMoves).toEqual(2);
            expect(board.vm.highest).toEqual(8);
            expect(board.vm.score).toEqual(12);
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 3,
                    col: 0,
                    value: 4,
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
            jest.runAllTimers();

            expect(board.vm.tiles[0][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][0]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][1]).toEqual({
                value: TARGET,
                merged: true,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i === 0 && j !== 2) continue;
                    if (i === 1 && j === 0) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.numMoves).toEqual(1);
            expect(board.vm.highest).toEqual(2048);
            expect(board.vm.score).toEqual(1024);
            expect(board.vm.gameState).toEqual(STATE.won);
        });
    });

    describe("moveDown", () => {
        let addRandomMockTile;
        let board;
        beforeEach(() => {
            jest.useFakeTimers();
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 2,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 1,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 1,
                    value: 2,
                });

            board.vm.addRandomTile = addRandomMockTile;
            board.vm.startGame();

            board.vm.moveDown();
            jest.runAllTimers();

            expect(board.vm.tiles[3][1]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][2]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][1]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            expect(board.vm.tiles[1][2]).toEqual({
                value: -1,
                merged: false,
                newlyAdded: false,
            });
            for (let i = 0; i < SIZE - 1; i++) {
                for (let j = 0; j < SIZE - 1; j++) {
                    if (i == 3 && (j == 1 || j == 2)) continue;
                    if (i == 0 && j == 1) continue;
                    if (i == 1 && j == 2) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.score).toEqual(0);

            board.vm.moveDown();
            jest.runAllTimers();

            expect(board.vm.tiles[3][1]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][2]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][1]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });

            for (let i = 0; i < SIZE - 1; i++) {
                for (let j = 0; j < SIZE - 1; j++) {
                    if (i == 3 && (j == 1 || j == 2)) continue;
                    if (i == 0 && j == 1) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.numMoves).toEqual(2);
            expect(board.vm.highest).toEqual(4);
            expect(board.vm.score).toEqual(2);
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
                    value: 4,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 1,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 3,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 3,
                    value: 2,
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
            jest.runAllTimers();

            expect(board.vm.tiles[2][1]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][1]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][3]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i === 1 && j === 3) continue;
                    if (i === 2 && j === 1) continue;
                    if (i === 3 && (j === 1 || j === 3)) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.score).toEqual(4);

            // move down
            // [ [-1, -1, -1, -1], [-1, -1, -1, 2], [-1, -1, -1, 2], [-1,  8, -1, 4] ]
            board.vm.moveDown();
            jest.runAllTimers();

            expect(board.vm.tiles[1][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            expect(board.vm.tiles[2][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][1]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][3]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i === 1 && j === 3) continue;
                    if (i === 2 && j === 3) continue;
                    if (i === 3 && (j === 1 || j === 3)) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.numMoves).toEqual(2);
            expect(board.vm.highest).toEqual(8);
            expect(board.vm.score).toEqual(8);
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 2,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 0,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 2,
                    col: 0,
                    value: 2,
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
            jest.runAllTimers();

            expect(board.vm.tiles[2][1]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[2][2]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][1]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][2]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i === 0 && j === 0) continue;
                    if (i === 2 && (j === 1 || j === 2)) continue;
                    if (i === 3 && (j === 1 || j === 2)) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.score).toEqual(6);

            board.vm.moveDown();
            jest.runAllTimers();

            expect(board.vm.tiles[2][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            expect(board.vm.tiles[2][2]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });

            expect(board.vm.tiles[3][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][1]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][2]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i === 2 && (j === 0 || j === 2)) continue;
                    if (i === 3 && j < SIZE - 1) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.numMoves).toEqual(2);
            expect(board.vm.highest).toEqual(8);
            expect(board.vm.score).toEqual(10);
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 1,
                    col: 0,
                    value: 4,
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
            jest.runAllTimers();

            expect(board.vm.tiles[2][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][0]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][1]).toEqual({
                value: TARGET,
                merged: true,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (i === 2 && j === 0) continue;
                    if (i === 3 && (j === 0 || j === 1 || j === 3)) continue;
                    expect(board.vm.tiles[i][j]).toEqual({
                        value: -1,
                        merged: false,
                        newlyAdded: false,
                    });
                }
            }
            expect(board.vm.numMoves).toEqual(1);
            expect(board.vm.highest).toEqual(2048);
            expect(board.vm.score).toEqual(1024);
            expect(board.vm.gameState).toEqual(STATE.won);
        });
    });

    describe("Lose game", () => {
        let addRandomMockTile;
        let board;
        beforeEach(() => {
            jest.useFakeTimers();
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
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 3,
                    value: 2,
                })
                .mockReturnValueOnce({
                    row: 0,
                    col: 0,
                    value: 2,
                });

            const tiles = [
                [2, 2, 8, 2],
                [4, 8, 128, 4],
                [8, 32, 64, 32],
                [2, 4, 8, 4],
            ];

            board.vm.addRandomTile = addRandomMockTile;
            board.vm.startGame();
            board.vm.clone(tiles);

            board.vm.moveRight();
            jest.runAllTimers();

            expect(board.vm.tiles[0][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: true,
            });
            expect(board.vm.tiles[0][1]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][2]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[0][3]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][0]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][1]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][2]).toEqual({
                value: 128,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[1][3]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[2][0]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[2][1]).toEqual({
                value: 32,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[2][2]).toEqual({
                value: 64,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[2][3]).toEqual({
                value: 32,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][0]).toEqual({
                value: 2,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][1]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][2]).toEqual({
                value: 8,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.tiles[3][3]).toEqual({
                value: 4,
                merged: false,
                newlyAdded: false,
            });
            expect(board.vm.numMoves).toEqual(1);
            expect(board.vm.highest).toEqual(4);
            expect(board.vm.score).toEqual(2);
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

    describe("setGameState", () => {
        let board;
        beforeEach(() => {
            jest.useFakeTimers();
            board = shallowMount(Board);
        });
        it("set state to won", () => {
            board.vm.setGameState(STATE.won);
            expect(board.vm.gameState).toEqual(STATE.won);
        });

        it("set state to over", () => {
            board.vm.setGameState(STATE.over);
            expect(board.vm.gameState).toEqual(STATE.over);
        });

        it("does not set state if neither won nor over", () => {
            board.vm.setGameState(STATE.running);
            expect(board.vm.gameState).toEqual(STATE.start);
        });

        it("mock the outcome of the game is won", () => {
            window.history.pushState({}, "Test Title", "/?outcome=WON");
            board = shallowMount(Board);
            // https://www.ryandoll.com/post/2018/3/29/jest-and-url-mocking
            expect(board.vm.gameState).toEqual(STATE.won);
        });

        it("mock the outcome of the game is loss", () => {
            window.history.pushState({}, "Test Title", "/?outcome=OVER");
            board = shallowMount(Board);
            // https://www.ryandoll.com/post/2018/3/29/jest-and-url-mocking
            expect(board.vm.gameState).toEqual(STATE.over);
        });

        it("mock the outcome of the game is neither winning or losing", () => {
            window.history.pushState({}, "Test Title", "/?outcome=xxxx");
            board = shallowMount(Board);
            // https://www.ryandoll.com/post/2018/3/29/jest-and-url-mocking
            expect(board.vm.gameState).toEqual(STATE.start);
        });
    });

    describe("addEventListener and removeEventListener", () => {
        let board;
        let spyAddEventListener;
        let spyRemoveEventListener;
        beforeAll(() => {
            jest.useFakeTimers();
            spyAddEventListener = jest.spyOn(document, "addEventListener");
            spyRemoveEventListener = jest.spyOn(document, "removeEventListener");
            board = shallowMount(Board, {});
        });

        it("addEventListener is called", () => {
            expect(spyAddEventListener).toHaveBeenCalledTimes(1);
        });

        it("removeEventListener is called", () => {
            board.vm.$destroy();
            expect(spyRemoveEventListener).toHaveBeenCalledTimes(1);
        });
    });

    describe("handleKeyup", () => {
        let board;
        let spyMoveUp;
        let spyMoveDown;
        let spyMoveLeft;
        let spyMoveRight;

        beforeEach(() => {
            jest.useFakeTimers();
            board = shallowMount(Board);
            const { vm } = board;
            spyMoveUp = jest.spyOn(vm, "moveUp");
            spyMoveDown = jest.spyOn(vm, "moveDown");
            spyMoveLeft = jest.spyOn(vm, "moveLeft");
            spyMoveRight = jest.spyOn(vm, "moveRight");
        });

        it("moveUp is called", () => {
            board.vm.gameState = STATE.running;
            board.vm.handleKeyUp({
                keyCode: KEYCODE.up,
            });
            expect(spyMoveUp).toHaveBeenCalledTimes(1);
            expect(spyMoveDown).toHaveBeenCalledTimes(0);
            expect(spyMoveLeft).toHaveBeenCalledTimes(0);
            expect(spyMoveRight).toHaveBeenCalledTimes(0);
        });

        it("moveDown is called", () => {
            board.vm.gameState = STATE.running;
            board.vm.handleKeyUp({
                keyCode: KEYCODE.down,
            });
            expect(spyMoveUp).toHaveBeenCalledTimes(0);
            expect(spyMoveDown).toHaveBeenCalledTimes(1);
            expect(spyMoveLeft).toHaveBeenCalledTimes(0);
            expect(spyMoveRight).toHaveBeenCalledTimes(0);
        });

        it("moveLeft is called", () => {
            board.vm.gameState = STATE.running;
            board.vm.handleKeyUp({
                keyCode: KEYCODE.left,
            });
            expect(spyMoveUp).toHaveBeenCalledTimes(0);
            expect(spyMoveDown).toHaveBeenCalledTimes(0);
            expect(spyMoveLeft).toHaveBeenCalledTimes(1);
            expect(spyMoveRight).toHaveBeenCalledTimes(0);
        });

        it("moveRight is called", () => {
            board.vm.gameState = STATE.running;
            board.vm.handleKeyUp({
                keyCode: KEYCODE.right,
            });
            expect(spyMoveUp).toHaveBeenCalledTimes(0);
            expect(spyMoveDown).toHaveBeenCalledTimes(0);
            expect(spyMoveLeft).toHaveBeenCalledTimes(0);
            expect(spyMoveRight).toHaveBeenCalledTimes(1);
        });

        it("other key is ignored", () => {
            board.vm.gameState = STATE.running;
            board.vm.handleKeyUp({
                keyCode: 0,
            });
            expect(spyMoveUp).toHaveBeenCalledTimes(0);
            expect(spyMoveDown).toHaveBeenCalledTimes(0);
            expect(spyMoveLeft).toHaveBeenCalledTimes(0);
            expect(spyMoveRight).toHaveBeenCalledTimes(0);
        });
    });
});

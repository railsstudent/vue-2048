<template>
    <div class="container">
        <div class="full">
            <Summary
                :numMoves="numMoves"
                :highest="highest"
                :score="score"
                :gameState="gameState"
                @startGame="startGame"
            ></Summary>
            <div class="tiles">
                <template v-for="row in 4">
                    <template v-for="col in 4">
                        <Tile :key="`tile-${row}-${col}`" :tiles="tiles" :row="row" :col="col"></Tile>
                    </template>
                </template>
                <div class="overlay" :class="{ show: gameState === 'OVER' || gameState === 'WON' }">
                    <div class="text">
                        <span v-if="gameState === 'OVER'">Game Over! Please try again!</span>
                        <span v-if="gameState === 'WON'">You Win!</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export const STATE = {
    start: "START",
    won: "WON",
    running: "RUNNING",
    over: "OVER",
};
export const SIZE = 4;
export const TARGET = 2048;
export const KEYCODE = {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
};

import Summary from "./Summary";
import Tile from "./Tile";

export default {
    name: "Board",
    components: {
        Summary,
        Tile,
    },
    data: function() {
        const arr = Array(SIZE).fill(-1);
        const tiles = [...arr].reduce((acc, _) => {
            const row = [...arr].reduce((acc2, value) => acc2.concat({ value, merged: false, newlyAdded: false }), []);
            acc.push(row);
            return acc;
        }, []);

        return {
            tiles,
            checkingAvailableMoves: false,
            gameState: STATE.start,
            highest: 0,
            score: 0,
            numMoves: 0,
        };
    },
    methods: {
        validIndex(idx) {
            return typeof idx !== "undefined" && idx >= 0 && idx < SIZE;
        },
        assignTile: function(tiles, { row, col, value, merged = false, newlyAdded = false }) {
            if (tiles && this.validIndex(row) && this.validIndex(col)) {
                const newRow = tiles[row].slice(0);
                newRow[col] = {
                    value,
                    merged,
                    newlyAdded,
                };
                this.$set(tiles, row, newRow);
            }
        },
        move: function(tiles, countDownFrom, yIncr, xIncr, { checkMove }) {
            let moved = false;
            for (let i = 0; i < SIZE * SIZE; i++) {
                let j = Math.abs(countDownFrom - i);
                let r = Math.floor(j / SIZE);
                let c = j % SIZE;

                if (tiles[r][c].value === -1) {
                    continue;
                }

                let nextR = r + yIncr;
                let nextC = c + xIncr;
                // console.log(`r=${r}, c=${c}, nextR=${nextR}, nextC=${nextC}`);

                while (nextR >= 0 && nextR < SIZE && nextC >= 0 && nextC < SIZE) {
                    const next = tiles[nextR][nextC];
                    const curr = tiles[r][c];

                    // console.log(`r=${r}, c=${c}, nextR=${nextR}, nextC=${nextC}`);
                    // console.log(`next=${next.value}, ${next.merged} curr=${curr.value}, ${curr.merged}`);

                    if (next && next.value === -1) {
                        if (this.checkingAvailableMoves === true) {
                            return true;
                        }
                        this.assignTile(tiles, {
                            row: nextR,
                            col: nextC,
                            value: curr.value,
                        });
                        this.assignTile(tiles, { row: r, col: c, value: -1 });
                        r = nextR;
                        c = nextC;
                        nextR += yIncr;
                        nextC += xIncr;
                        moved = true;
                    } else if (this.canMergeWith(curr, next) === true) {
                        if (this.checkingAvailableMoves === true) {
                            return true;
                        }
                        const score = tiles[r][c].value;
                        const value = this.mergeWith(tiles, nextR, nextC, r, c);
                        if (!checkMove) {
                            this.score += score;
                            if (value > this.highest) {
                                this.highest = value;
                            }
                        }
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            }

            if (checkMove) {
                return moved;
            }

            setTimeout(() => {
                if (moved === true) {
                    this.numMoves += 1;
                    if (this.highest < TARGET) {
                        const { row, col, value } = this.addRandomTile() || {};
                        this.clearMerged();
                        this.assignTile(tiles, { row, col, value, newlyAdded: true });
                        if (!this.movesAvailable()) {
                            this.gameState = STATE.over;
                        }
                    } else if (this.highest === TARGET) {
                        this.gameState = STATE.won;
                    }
                }
            }, 250);
            return moved;
        },
        moveUp: function(tiles, { checkMove = false } = {}) {
            if (typeof tiles === "undefined" || tiles == null) {
                tiles = this.tiles;
            }
            return this.move(tiles, 0, -1, 0, { checkMove });
        },
        moveDown: function(tiles, { checkMove = false } = {}) {
            if (typeof tiles === "undefined" || tiles == null) {
                tiles = this.tiles;
            }
            return this.move(tiles, SIZE * SIZE - 1, 1, 0, { checkMove });
        },
        moveLeft: function(tiles, { checkMove = false } = {}) {
            if (typeof tiles === "undefined" || tiles == null) {
                tiles = this.tiles;
            }
            return this.move(tiles, 0, 0, -1, { checkMove });
        },
        moveRight: function(tiles, { checkMove = false } = {}) {
            if (typeof tiles === "undefined" || tiles == null) {
                tiles = this.tiles;
            }
            return this.move(tiles, SIZE * SIZE - 1, 0, 1, { checkMove });
        },
        canMergeWith: function(curr, next) {
            return !next.merged && curr !== null && !curr.merged && next.value === curr.value;
        },
        mergeWith: function(tiles, nextR, nextC, r, c) {
            if (this.canMergeWith(tiles[r][c], tiles[nextR][nextC])) {
                this.assignTile(tiles, {
                    row: nextR,
                    col: nextC,
                    value: tiles[r][c].value * 2,
                    merged: true,
                });
                this.assignTile(tiles, { row: r, col: c, value: -1 });
                return tiles[nextR][nextC].value;
            }
            return -1;
        },
        clearMerged: function() {
            const arr = Array(SIZE).fill(0);
            [...arr].forEach((_, row) => {
                [...arr].forEach((_, col) => {
                    const { value } = this.tiles[row][col];
                    this.assignTile(this.tiles, { row, col, value });
                });
            });
        },
        movesAvailable: function() {
            this.checkingAvailableMoves = true;
            const tilesCopy = JSON.parse(JSON.stringify(this.tiles));
            const hasMoves =
                this.moveUp(tilesCopy, { checkMove: true }) ||
                this.moveDown(tilesCopy, { checkMove: true }) ||
                this.moveLeft(tilesCopy, { checkMove: true }) ||
                this.moveRight(tilesCopy, { checkMove: true });
            this.checkingAvailableMoves = false;
            return hasMoves;
        },
        addRandomTile: function() {
            let pos = Math.floor(Math.random() * (SIZE * SIZE));
            let row;
            let col;
            do {
                pos = (pos + 1) % (SIZE * SIZE);
                row = Math.floor(pos / SIZE);
                col = pos % SIZE;
            } while (this.tiles[row][col].value !== -1);
            let value = Math.random() < 0.1 ? 4 : 2;
            return {
                row,
                col,
                value,
            };
        },
        startGame: function() {
            if (this.gameState != STATE.running) {
                this.score = 0;
                this.highest = 0;
                this.numMoves = 0;
                this.clone();
                this.gameState = STATE.running;
                const { row: row1, col: col1, value: value1 } = this.addRandomTile() || {};
                this.assignTile(this.tiles, { row: row1, col: col1, value: value1 });
                const { row: row2, col: col2, value: value2 } = this.addRandomTile() || {};
                this.assignTile(this.tiles, { row: row2, col: col2, value: value2 });
            }
        },
        clone: function() {
            const arr = Array(SIZE).fill(-1);
            [...arr].forEach((_, row) => {
                [...arr].forEach((value, col) => {
                    this.assignTile(this.tiles, { row, col, value });
                });
            });
        },
        setGameState(state) {
            if (state === STATE.won || state === STATE.over) {
                this.gameState = state;
            }
        },
        handleKeyUp(e) {
            if (this.gameState === STATE.running) {
                const code = e.which || e.keyCode;
                switch (code) {
                    case KEYCODE.up:
                        this.moveUp();
                        break;
                    case KEYCODE.down:
                        this.moveDown();
                        break;
                    case KEYCODE.left:
                        this.moveLeft();
                        break;
                    case KEYCODE.right:
                        this.moveRight();
                        break;
                    default:
                        break;
                }
            }
        },
    },
    created: function() {
        const outcome = getParameterByName("outcome");
        if (outcome === STATE.won || outcome === STATE.over) {
            this.setGameState(outcome);
        }
        document.addEventListener("keyup", this.handleKeyUp);
    },
    destroyed: function() {
        document.removeEventListener("keyup", this.handleKeyUp);
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$background-color: #bbada0;

.container {
    --grid-columns: repeat(4, 105px);

    display: flex;
    flex-direction: row;
    justify-content: center;

    .tiles {
        position: relative;
        margin-top: 10px;
        padding: 10px;
        background: $background-color;
        display: grid;
        grid-gap: 15px;
        grid-template-columns: var(--grid-columns);
        grid-template-rows: var(--grid-columns);
        grid-template-areas:
            "a1 a2 a3 a4"
            "a5 a6 a7 a8"
            "a9 a10 a11 a12"
            "a13 a14 a15 a16";
        border: 3px solid darken($background-color, 1.5);

        .tile-1-1 {
            grid-area: a1;
        }

        .tile-1-2 {
            grid-area: a2;
        }

        .tile-1-3 {
            grid-area: a3;
        }

        .tile-1-4 {
            grid-area: a4;
        }

        .tile-2-1 {
            grid-area: a5;
        }

        .tile-2-2 {
            grid-area: a6;
        }

        .tile-2-3 {
            grid-area: a7;
        }

        .tile-2-4 {
            grid-area: a8;
        }

        .tile-3-1 {
            grid-area: a9;
        }

        .tile-3-2 {
            grid-area: a10;
        }

        .tile-3-3 {
            grid-area: a11;
        }

        .tile-3-4 {
            grid-area: a12;
        }

        .tile-4-1 {
            grid-area: a13;
        }

        .tile-4-2 {
            grid-area: a14;
        }

        .tile-4-3 {
            grid-area: a15;
        }

        .tile-4-4 {
            grid-area: a16;
        }
    }

    .full {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .overlay {
        display: none;

        &.show {
            display: block;
            position: absolute;
            top: 0%;
            bottom: 0%;
            left: 0%;
            right: 0%;
            z-index: 2;
            background: rgba(0, 0, 0, 0.7);
        }

        .text {
            display: table;
            color: #fff;
            font-size: 1.5em;
            height: 100%;
            width: 100%;
            text-align: center;

            span {
                display: table-cell;
                vertical-align: middle;
            }
        }
    }
}

@media screen and (min-width: 355px) and (max-width: 499px) {
    .container {
        --grid-columns: repeat(4, 70px);
    }
}
</style>

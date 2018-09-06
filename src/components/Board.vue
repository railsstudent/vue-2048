<template>
<div class="container">
    <div class="actions">
        <button class="btn" v-if="gameState !== 'RUNNING'" v-on:click="startGame">Start Game</button>
    </div>
    <div class="tiles">
        <template v-for="row in 4">
            <div v-for="col in 4" v-bind:key="'[' + row + ',' + col + ']'" :class="['tile-' + row + '-' + col, 'background-' + tiles[row-1][col-1].value]">
                <span v-if="tiles[row-1][col-1].value !== -1">
                    {{tiles[row-1][col-1].value}}
                </span>
            </div>
        </template>
    </div>
</div>
</template>

<script>

export const STATE = {
    start: "START",
    won: "WON",
    running: "RUNNING",
    over: "OVER"
};
export const SIZE = 4;
export const TARGET = 2048;
const KEYCODE = {
    up: 38,
    down: 40,
    left: 37,
    right: 39
};

export default {
  name: "Board",
  props: {
    msg: String
  },
  data: function() {
    const tiles = [];
    for (let i = 0; i < SIZE; i++) {
        tiles.push([]);
        for (let j = 0; j < SIZE; j++) {
            tiles[i].push({
                value: -1,
                merged: false
            });
        }
    }
    return {
        tiles,
        checkingAvailableMoves: false,
        gameState: STATE.start,
        highest: -1
    };
  },
  methods: {
    assignTile: function(tiles, row, col, value, merged = false) {
        if (tiles && typeof row !== "undefined" && typeof col !== "undefined"
            && row >= 0 && row < SIZE && col >= 0 && col < SIZE) {
            const newRow = tiles[row].slice(0);
            newRow[col] = {
                value,
                merged
            };
            this.$set(tiles, row, newRow);
        }
    },
    move: function(tiles, countDownFrom, yIncr, xIncr) {
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
                    this.assignTile(this.tiles, nextR, nextC, curr.value);
                    this.assignTile(this.tiles, r, c, -1);
                    r = nextR;
                    c = nextC;
                    nextR += yIncr;
                    nextC += xIncr;
                    moved = true;
                } else if (this.canMergeWith(curr, next) === true) {
                    if (this.checkingAvailableMoves === true) {
                        return true;
                    }
                    const value = this.mergeWith(tiles, nextR, nextC, r, c);
                    if (value > this.highest) {
                        this.highest = value;
                    }
                    moved = true;
                    break;
                } else {
                    break;
                }
            }
        }
        // console.log('moved', moved);
        if (moved === true) {
            if (this.highest < TARGET) {
                const { row, col, value } = this.addRandomTile() || {};
                this.clearMerged();
                this.assignTile(this.tiles, row, col, value);
                if (!this.movesAvailable()) {
                    this.gameState = STATE.over;
                }
            } else if (this.highest === TARGET) {
                this.gameState = STATE.won;
            }
        }
        return moved;
    },
    moveUp: function(tiles) {
        if (typeof tiles === 'undefined' || tiles == null) {
            tiles = this.tiles;
        }
        return this.move(tiles, 0, -1, 0);
    },
    moveDown: function(tiles) {
        if (typeof tiles === 'undefined' || tiles == null) {
            tiles = this.tiles;
        }
        return this.move(tiles, SIZE * SIZE - 1, 1, 0);
    },
    moveLeft: function(tiles) {
        if (typeof tiles === 'undefined' || tiles == null) {
            tiles = this.tiles;
        }
        return this.move(tiles, 0, 0, -1);
    },
    moveRight: function(tiles) {
        if (typeof tiles === 'undefined' || tiles == null) {
            tiles = this.tiles;
        }
        return this.move(tiles, SIZE * SIZE - 1, 0, 1);
    },
    canMergeWith: function(curr, next) {
        return next.merged === false && curr != null && curr.merged === false && next.value === curr.value;
    },
    mergeWith: function(tiles, nextR, nextC, r, c) {
        if (this.canMergeWith(tiles[r][c], tiles[nextR][nextC]) === true) {
            this.assignTile(this.tiles, nextR, nextC, tiles[r][c].value * 2, true);
            this.assignTile(this.tiles, r, c, -1);
            return tiles[nextR][nextC].value;
        }
        return -1;
    },
    clearMerged: function() {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                const { value } = this.tiles[i][j];
                this.assignTile(this.tiles, i, j, value);
            }
        }
    },
    movesAvailable: function() {
        this.checkingAvailableMoves = true;
        const tilesCopy = JSON.parse(JSON.stringify(this.tiles));
        const hasMoves = this.moveUp(tilesCopy) || this.moveDown(tilesCopy)
            || this.moveLeft(tilesCopy) || this.moveRight(tilesCopy);
        this.checkingAvailableMoves = false;
        return hasMoves;
    },
    addRandomTile: function() {
        let pos = Math.floor(Math.random() * (SIZE * SIZE));
        console.log('pos', pos);
        let row;
        let col;
        do {
            pos = (pos + 1) % (SIZE * SIZE);
            row = Math.floor(pos / SIZE);
            col = pos % SIZE;
        } while (this.tiles[row][col].value !== -1);
        let value = Math.random() < 0.1 ? 4 : 2;
        console.log ('add', { row, col, value });
        return {
            row,
            col,
            value
        };
    },
    startGame: function() {
        if (this.gameState != STATE.running) {
            this.clone([[-1,-1,-1,-1], [-1,-1,-1,-1], [-1,-1,-1,-1], [-1,-1,-1,-1]]);
            this.gameState = STATE.running;
            const { row: row1, col: col1, value: value1 } = this.addRandomTile() || {};
            this.assignTile(this.tiles, row1, col1, value1);
            const { row: row2, col: col2, value: value2 } = this.addRandomTile() || {};
            this.assignTile(this.tiles, row2, col2, value2);
        }
    },
    clone: function(otherTiles) {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                this.assignTile(this.tiles, i, j, otherTiles[i][j], false);
            }
        }
    }
  },
  created: function() {
      const self = this;
      document.addEventListener("keyup", function(e) {
          if (self.gameState === STATE.running) {
            const code = e.which || e.keyCode;
            switch(code) {
                case KEYCODE.up:
                    self.moveUp();
                    break;
                case KEYCODE.down:
                    self.moveDown();
                    break;
                case KEYCODE.left:
                    self.moveLeft();
                    break;
                case KEYCODE.right:
                    self.moveRight();
                    break;
                default:
                    break;
            }
          }
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    $background-color: #bbada0;
    $tile-border-color: #9a9a9a;
    $tile-empty-color: rgba(238, 228, 218, 0.35);
    $background-2: #eee4da;
    $background-4: #ede0c8;
    $background-8: #f2b179;
    $background-16: #f59563;
    $background-32: #f67c5f;
    $background-64: #f65e3b;
    $background-128: #edcf72;
    $background-256: #edcc61;
    $background-512: #edc850;
    $background-1024: #edc53f;
    $background-2048: #edc22e;

    $color-2: #776e65;
    $color-8: #f9f6f2;

    $button-color: #007bff;

    .container {
        width: calc(100% - 100px);

        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        margin: 0 50px;
        border: 1px solid red;

        .tiles {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);

            width: 500px;
            height: 500px;

            margin-top: 10px;
            padding: 10px;
            background: $background-color;

            display: grid;
            grid-gap: 10px;
            grid-template-columns: repeat(4, minmax(80px, 120px));
            grid-template-rows: repeat(4, minmax(80px, 120px));
            grid-template-areas: "a b c a4"
                                 "a5 a6 a7 a8"
                                 "a9 a10 a11 a12"
                                 "a13 a14 a15 a16";
            border: 2px solid black;

            .tile-1-1, .tile-1-2, .tile-1-3, .tile-1-4,
            .tile-2-1, .tile-2-2, .tile-2-3, .tile-2-4,
            .tile-3-1, .tile-3-2, .tile-3-3, .tile-3-4,
            .tile-4-1, .tile-4-2, .tile-4-3, .tile-4-4
             {
                border-color: transparent;
                border-radius: 8px;
                display: flex;
                justify-content: center;
                align-items: center;

                span {
                    font-size: 3.2em;
                    font-weight: 600;
                }
             }

            > div.background- {
                &-1 {
                    background: $tile-empty-color;
                }

                &2, &4 {
                   color: $color-2;
                }

                &2 {
                   background: $background-2;
                }

                &4 {
                   background: $background-4;
                }

                &8, &16, &32, &64, &128, &256, &512, &1024 {
                   color: $color-8;
                }

                &8 {
                   background: $background-8;
                }

                &16 {
                   background: $background-16;
                }

                &32 {
                    background: $background-32;
                }

                &64 {
                    background: $background-64;
                }

                &128 {
                    background: $background-128;
                }

                &256 {
                    background: $background-256;
                    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.31746), inset 0 0 0 1px rgba(255, 255, 255, 0.19048)
                }

                &512 {
                    background: $background-512;
                    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.39683), inset 0 0 0 1px rgba(255, 255, 255, 0.2381)
                }

                &1024 {
                    background: $background-1024;
                    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.47619), inset 0 0 0 1px rgba(255, 255, 255, 0.28571);
                }

                &2048 {
                    background: $background-2048;
                    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.55556), inset 0 0 0 1px rgba(255, 255, 255, 0.33333);
                }
             }

            .tile-1-1 {
                grid-area: a;
            }

            .tile-1-2 {
                grid-area: b;
            }

            .tile-1-3 {
                grid-area: c;
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

        .actions {
            .btn {
                background-color: $button-color;
                border-color: $button-color;
                color: #fff;
                font-size: 1rem;
                border-radius: .25rem;
                padding: .375rem .75rem;
                font-weight: 400;
                text-align: center;
                white-space: nowrap;
                display: inline-block;
                vertical-align: middle;
                transition: ease-in-out, background-color .15s
            }
        }
    }
</style>

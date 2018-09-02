<template>
<div>
    Board works!!!!
    <pre>
        {{gameState}}
        {{checkingAvailableMoves}}
        {{highest}}
    </pre>
    {{tiles}}
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
        let pos = Math.floor(Math.random() + (SIZE * SIZE - 1));
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
            value
        };
    },
    startGame: function() {
        if (this.gameState != STATE.running) {
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
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

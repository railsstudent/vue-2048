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

const STATE = {
    start: "START",
    won: "WON",
    running: "RUNNING",
    over: "OVER"
};
const TARGET = 2048;
const SIZE = 4;
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

            while (nextR >= 0 && nextR < SIZE && nextC >= 0 && nextC < SIZE) {
                const next = tiles[nextR][nextC];
                const curr = tiles[r][c];

                if (next && next.value === -1) {
                    if (this.checkingAvailableMoves === true) {
                        return true;
                    }

                    tiles[nextR].$set(nextC, {
                        value: curr.value,
                        merged: false
                    });
                    tiles[r].$set(c, {
                        value: -1,
                        merged: false
                    });
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
        if (moved === true) {
            if (this.highest < TARGET) {
                this.addRandomTile();
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
        return this.move(tiles, 0, -1, 0);
    },
    moveDown: function(tiles) {
        return this.move(tiles, SIZE * SIZE - 1, 1, 0);
    },
    moveLeft: function(tiles) {
        return this.move(tiles, 0, 0, -1);
    },
    moveRight: function(tiles) {
        return this.move(tiles, SIZE * SIZE - 1, 0, 1);
    },
    canMergeWith: function(curr, next) {
        return next.merged === false && curr != null && curr.merged === false && next.value === curr.value;
    },
    mergeWith: function(tiles, nextR, nextC, r, c) {
        if (this.canMergeWith(tiles[r][c], tiles[nextR][nextC]) === true) {
            tiles[nextR].$set(nextC, {
                value: tiles[r][c].value * 2,
                merged: true
            });
            tiles[r].$set(c, {
                value: -1,
                merged: false
            });
            return tiles[nextR][nextC].value;
        }
        return -1;
    },
    clearMerged: function() {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                const value = this.tiles[i][j];
                this.tiles[i].$set(j, {
                    value,
                    merged: false
                });
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
            row = Math.floor(row / SIZE);
            col = pos % SIZE;
        } while (this.tiles[row][col].value !== -1);
        let val = Math.random() < 0.1 ? 4 : 2;
        this.tiles[row].$set(col, {
            value: val,
            merged: false
        });
    }
  },
  created: function() {
      document.addEventListener("keyup", function(e) {
          const code = e.which || e.keyCode;
          switch(code) {
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

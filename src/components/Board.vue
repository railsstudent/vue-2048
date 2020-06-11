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
                    <div
                        v-for="col in 4"
                        v-bind:key="'[' + row + ',' + col + ']'"
                        :class="[
                            'tile-' + row + '-' + col,
                            'background-' + tiles[row - 1][col - 1].value,
                            tiles[row - 1][col - 1].newlyAdded ? 'tile-new' : '',
                        ]"
                    >
                        <span
                            v-if="tiles[row - 1][col - 1].value !== -1"
                            v-bind:key="'[ span' + row + ',' + col + ']'"
                            :class="[tiles[row - 1][col - 1].merged ? 'tile-merged' : '']"
                        >
                            {{ tiles[row - 1][col - 1].value }}
                        </span>
                    </div>
                </template>
                <div class="overlay" v-bind:class="{ show: gameState === 'OVER' || gameState === 'WON' }">
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

export default {
    name: "Board",
    components: {
        Summary,
    },
    data: function() {
        const tiles = [];
        for (let i = 0; i < SIZE; i++) {
            tiles.push([]);
            for (let j = 0; j < SIZE; j++) {
                tiles[i].push({
                    value: -1,
                    merged: false,
                    newlyAdded: false,
                });
            }
        }
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
        assignTile: function(tiles, { row, col, value, merged = false, newlyAdded = false }) {
            if (
                tiles &&
                typeof row !== "undefined" &&
                typeof col !== "undefined" &&
                row >= 0 &&
                row < SIZE &&
                col >= 0 &&
                col < SIZE
            ) {
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
            return next.merged === false && curr != null && curr.merged === false && next.value === curr.value;
        },
        mergeWith: function(tiles, nextR, nextC, r, c) {
            if (this.canMergeWith(tiles[r][c], tiles[nextR][nextC]) === true) {
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
            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    const { value } = this.tiles[i][j];
                    this.assignTile(this.tiles, { row: i, col: j, value });
                }
            }
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
                this.clone([
                    [-1, -1, -1, -1],
                    [-1, -1, -1, -1],
                    [-1, -1, -1, -1],
                    [-1, -1, -1, -1],
                ]);
                this.gameState = STATE.running;
                const { row: row1, col: col1, value: value1 } = this.addRandomTile() || {};
                this.assignTile(this.tiles, { row: row1, col: col1, value: value1 });
                const { row: row2, col: col2, value: value2 } = this.addRandomTile() || {};
                this.assignTile(this.tiles, { row: row2, col: col2, value: value2 });
            }
        },
        clone: function(otherTiles) {
            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    this.assignTile(this.tiles, {
                        row: i,
                        col: j,
                        value: otherTiles[i][j],
                        merged: false,
                    });
                }
            }
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

.container {
    --grid-columns: repeat(4, 105px);
    --font-size: 3.2em;

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

        .tile-1-1,
        .tile-1-2,
        .tile-1-3,
        .tile-1-4,
        .tile-2-1,
        .tile-2-2,
        .tile-2-3,
        .tile-2-4,
        .tile-3-1,
        .tile-3-2,
        .tile-3-3,
        .tile-3-4,
        .tile-4-1,
        .tile-4-2,
        .tile-4-3,
        .tile-4-4 {
            border-color: transparent;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;

            span {
                font-size: var(--font-size);
                font-weight: 600;
            }
        }

        > div.background- {
            &-1 {
                background: $tile-empty-color;
            }

            &2,
            &4 {
                color: $color-2;
            }

            &2 {
                background: $background-2;
            }

            &4 {
                background: $background-4;
            }

            &8,
            &16,
            &32,
            &64,
            &128,
            &256,
            &512,
            &1024 {
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
                box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.31746), inset 0 0 0 1px rgba(255, 255, 255, 0.19048);
            }

            &512 {
                background: $background-512;
                box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.39683), inset 0 0 0 1px rgba(255, 255, 255, 0.2381);
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

        .tile-merged {
            animation: merged 0.3s ease 100ms;
            animation-fill-mode: backwards;
        }

        .tile-new {
            animation: bounce-in 0.2s;
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

    @keyframes bounce-in {
        0% {
            transform: scale(0);
        }

        50% {
            transform: scale(0.5);
        }

        100% {
            transform: scale(1);
        }
    }

    @keyframes merged {
        0% {
            transform: scale(0);
        }

        50% {
            transform: scale(1.2);
        }

        100% {
            transform: scale(1);
        }
    }
}

@media screen and (min-width: 355px) and (max-width: 499px) {
    .container {
        --grid-columns: repeat(4, 70px);
        --font-size: 2.2em;
    }
}
</style>

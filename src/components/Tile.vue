<template>
    <div :class="[`tile-${row}-${col}`, `background-${currentTile.value}`, currentTile.newlyAdded ? 'tile-new' : '']">
        <span v-if="currentTile.value !== -1" :class="[currentTile.merged ? 'tile-merged' : '']">
            {{ currentTile.value }}
        </span>
    </div>
</template>

<script>
export default {
    name: "Tile",
    props: {
        row: Number,
        col: Number,
        tiles: Array,
    },
    computed: {
        currentTile() {
            return this.row >= 1 && this.col >= 1 ? this.tiles[this.row - 1][this.col - 1] : null;
        },
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

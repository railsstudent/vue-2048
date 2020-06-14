<template>
    <div :class="['tile', tileCssClass, backgroundCsssClass, newTileCssClass]">
        <span v-if="tile && tile.value !== -1" :class="[mergeCssClass]">
            {{ tile.value }}
        </span>
    </div>
</template>

<script>
export default {
    name: "Tile",
    props: {
        row: Number,
        col: Number,
        tile: Object,
    },
    computed: {
        tileCssClass() {
            return `tile-${this.row}-${this.col}`;
        },
        backgroundCsssClass() {
            return this.tile && this.tile.value ? `background-${this.tile.value}` : "";
        },
        newTileCssClass() {
            return this.tile && this.tile.newlyAdded ? "tile-new" : "";
        },
        mergeCssClass() {
            return this.tile && this.tile.merged ? "tile-merged" : "";
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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

.tile {
    --font-size: 3.2em;

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

div.background- {
    &-1 {
        background: $tile-empty-color;
        border: 1px solid $tile-border-color;
    }

    &2,
    &4 {
        color: $color-2;
        border: 1px solid $tile-border-color;
    }

    &2 {
        background: $background-2;
        border: 1px solid $tile-border-color;
    }

    &4 {
        background: $background-4;
        border: 1px solid $tile-border-color;
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
        border: 1px solid $tile-border-color;
    }

    &8 {
        background: $background-8;
        border: 1px solid $tile-border-color;
    }

    &16 {
        background: $background-16;
        border: 1px solid $tile-border-color;
    }

    &32 {
        background: $background-32;
        border: 1px solid $tile-border-color;
    }

    &64 {
        background: $background-64;
        border: 1px solid $tile-border-color;
    }

    &128 {
        background: $background-128;
        border: 1px solid $tile-border-color;
    }

    &256 {
        background: $background-256;
        border: 1px solid $tile-border-color;
        box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.31746), inset 0 0 0 1px rgba(255, 255, 255, 0.19048);
    }

    &512 {
        background: $background-512;
        border: 1px solid $tile-border-color;
        box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.39683), inset 0 0 0 1px rgba(255, 255, 255, 0.2381);
    }

    &1024 {
        background: $background-1024;
        box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.47619), inset 0 0 0 1px rgba(255, 255, 255, 0.28571);
    }

    &2048 {
        background: $background-2048;
        border-color: 1px solid $tile-border-color;
        box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.55556), inset 0 0 0 1px rgba(255, 255, 255, 0.33333);
    }
}

.tile-merged {
    animation: merged 0.3s ease 100ms;
    animation-fill-mode: backwards;
}

.tile-new {
    animation: bounce-in 0.2s;
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

@media screen and (min-width: 355px) and (max-width: 499px) {
    .tile {
        --font-size: 2.2em;
    }
}
</style>

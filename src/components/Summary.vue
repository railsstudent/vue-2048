<template>
    <div class="actions">
        <div class="stats">
            <div class="score">Num Moves: {{ info.numMoves }}</div>
            <div class="score">Current highest tile: {{ info.highest }}</div>
            <div class="score">Score: {{ info.score }}</div>
        </div>
        <div class="buttons">
            <button class="btn" v-if="info.gameState !== 'RUNNING'" @click="startGame">Start Game</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "Summary",
    props: {
        info: { numMoves: Number, highest: Number, score: Number, gameState: String },
    },
    methods: {
        startGame() {
            this.$emit("startGame");
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$button-color: #007bff;

.actions {
    display: flex;
    flex-direction: column;
    width: 100%;

    .stats {
        --font-size: 1.2em;

        display: flex;
        justify-content: space-between;

        .score {
            padding: 10px;
            font-size: var(--font-size);
            font-weight: bold;
        }
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
        margin: 10px 0;
    }

    .btn {
        background-color: $button-color;
        border-color: $button-color;
        color: #fff;
        font-size: 1rem;
        border-radius: 0.25rem;
        padding: 0.375rem 0.75rem;
        font-weight: 400;
        text-align: center;
        white-space: nowrap;
        display: inline-block;
        vertical-align: middle;
        transition: ease-in-out, background-color 0.15s;
    }
}

@media screen and (min-width: 355px) and (max-width: 499px) {
    .actions .stats {
        --font-size: 1em;
    }
}
</style>

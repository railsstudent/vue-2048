<template>
    <div id="app">
        <p class="title">Vue 2048 Game</p>
        <Board></Board>
        <p class="footer">Made by Connie @ {{ year }}</p>
    </div>
</template>

<script>
import Board from "./components/Board";

export default {
    name: "app",
    components: {
        Board,
    },
    data() {
        return {
            year: new Date().getFullYear(),
        };
    },
};
</script>

<style lang="scss">
*,
::before,
::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}

#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto;

    .title {
        padding: 15px;
        text-align: center;
        font-size: 1.5rem;
    }

    .footer {
        padding: 10px;
        font-size: 1rem;
    }
}
</style>

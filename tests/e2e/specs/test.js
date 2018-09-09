// https://docs.cypress.io/api/introduction/api.html

describe("2048 game", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("p.title", "Vue 2048 Game");
    cy.contains("p.footer", "Made by Connie @ 2018");
    cy.contains("button.btn", "Start Game");
    const scores = cy.get("div.stats");
    cy.contains(scores[0], "Num Moves: 0");
    cy.contains(scores[1], "Current highest tile: -1");
    cy.contains(scores[2], "Score: 0");
  });
});

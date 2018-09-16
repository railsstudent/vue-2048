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

  it("Clicks Start game button", () => {
    cy.visit("/");
    cy.get("button.btn").click();
    const scores = cy.get("div.stats");
    cy.contains(scores[0], "Num Moves: 0");
    cy.contains(scores[1], "Current highest tile: 0");
    cy.contains(scores[2], "Score: 0");

    const emptyTiles = cy.get("div.background--1");
    emptyTiles.should("have.length", 14);

    cy.get(".tiles > div span").then($spans => {
      const twoCells = $spans.filter(
        (_, e) => parseInt(Cypress.$(e).text()) === 2
      );
      if (twoCells.length === 2) {
        cy.get("div.background-2").should("have.length", 2);
      } else {
        cy.get("div.background-2").should("have.length", 1);
        cy.get("div.background-4").should("have.length", 1);
      }
    });
  });

  it("Show game over overlay", () => {
    cy.visit("/?outcome=WON");
    cy.contains("div.tiles > div.overlay > div.text > span", "You Win!");
  });

  it("Show game won overlay", () => {
    cy.visit("/?outcome=OVER");
    cy.contains(
      "div.tiles > div.overlay > div.text > span",
      "Game Over! Please try again!"
    );
  });

  it("Can move up, down, left and right keys", () => {
    cy.visit("/");
    cy.get("button.btn").click();
    cy.get("body")
      .type("{leftarrow}")
      .type("{downarrow}")
      .type("{rightarrow}")
      .type("{uparrow}");
    cy.get("div.stats > div.score")
      .first()
      .then(firstScore => {
        expect(Cypress.$(firstScore).text()).equals("Num Moves: 4");
      });
  });
});

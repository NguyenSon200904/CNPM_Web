describe("Inventory Management", () => {
  it("should load the inventory page successfully", () => {
    cy.visit("/ton-kho");
    cy.contains("Quản lý tồn kho").should("be.visible");
  });

  it("should display a list of inventory items", () => {
    cy.visit("/ton-kho");
    cy.get(".inventory-list").should("exist");
  });
});

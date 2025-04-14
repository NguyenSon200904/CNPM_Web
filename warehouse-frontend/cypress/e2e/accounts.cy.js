describe("Accounts Management", () => {
  it("should load the accounts page successfully", () => {
    cy.visit("/tai-khoan");
    cy.contains("Quản lý tài khoản").should("be.visible");
  });

  it("should display a list of accounts", () => {
    cy.visit("/tai-khoan");
    cy.get(".account-list").should("exist");
  });

  it("should show an error when adding an account with invalid email", () => {
    cy.visit("/tai-khoan");
    cy.get("button").contains("Thêm").click();
    cy.get('input[name="email"]').type("invalid-email");
    cy.get("button").contains("Thêm").click();
    cy.contains("Vui lòng nhập email!").should("be.visible");
  });
});

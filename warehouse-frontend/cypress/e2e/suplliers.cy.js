describe("Suppliers Management", () => {
  it("should load the suppliers page successfully", () => {
    cy.visit("/nha-cung-cap");
    cy.contains("Quản lý nhà cung cấp").should("be.visible");
  });

  it("should allow adding a new supplier", () => {
    cy.visit("/nha-cung-cap");
    cy.get("button").contains("Thêm").click();
    cy.get('input[name="name"]').type("Nhà cung cấp A");
    cy.get('input[name="phone"]').type("0123456789");
    cy.get('input[name="address"]').type("Hà Nội");
    cy.get("button").contains("Thêm").click();
    cy.contains("Thêm nhà cung cấp thành công!").should("be.visible");
  });
});

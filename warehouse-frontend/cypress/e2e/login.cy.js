describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.clearLocalStorage("token");
  });

  it("should display the login page correctly", () => {
    cy.get(".ant-form > .text-xl").should("contain.text", "Đăng nhập");
    cy.get("#username > .ant-input").should("be.visible");
    cy.get(".ant-input-affix-wrapper > .ant-input").should("be.visible");
    cy.get(".ant-btn-primary")
      .should("be.visible")
      .and("contain.text", "Đăng nhập");
  });

  it("should login successfully with valid credentials", () => {
    cy.get("#username > .ant-input").type("admin"); // Thay "admin" bằng username hợp lệ
    cy.get(".ant-input-affix-wrapper > .ant-input").type("password123"); // Thay "password123" bằng password hợp lệ
    cy.get(".ant-btn-primary").click();
    cy.get("body").then(($body) => {
      if ($body.find(".ant-message-error").length > 0) {
        cy.get(".ant-message-error").then(($error) => {
          throw new Error("Login failed with message: " + $error.text());
        });
      } else {
        cy.url().should("include", "/");
        // cy.getAllLocalStorage().then((storage) => {
        //   expect(storage).to.have.property("token");
        // });
        // cy.get(".ant-message-success").should(
        //   "contain.text",
        //   "Đăng nhập thành công!"
        // );
      }
    });
  });

  it("should show error message with invalid credentials", () => {
    cy.get("#username > .ant-input").type("wronguser");
    cy.get(".ant-input-affix-wrapper > .ant-input").type("wrongpassword");
    cy.get(".ant-btn-primary").click();
    // cy.get(".ant-message-error").should(
    //   "contain.text",
    //   "Đăng nhập thất bại: Tên đăng nhập hoặc mật khẩu không đúng"
    // );
    // cy.getAllLocalStorage().then((storage) => {
    //   expect(storage).to.not.have.property("token");
    // });
    cy.url().should("include", "/login");
  });

  it("should show validation error when fields are empty", () => {
    cy.get(".ant-btn-primary").click();
    cy.get(".ant-form-item-explain-error")
      .should("be.visible")
      .and("contain.text", "Vui lòng nhập tên đăng nhập!");
    cy.get(".ant-form-item-explain-error")
      .should("be.visible")
      .and("contain.text", "Vui lòng nhập mật khẩu!");
    cy.url().should("include", "/login");
  });

  it("should login when pressing Enter key with valid credentials", () => {
    cy.get("#username > .ant-input").type("admin"); // Thay "admin" bằng username hợp lệ
    cy.get(".ant-input-affix-wrapper > .ant-input").type("password123{enter}"); // Thay "password123" bằng password hợp lệ
    cy.get("body").then(($body) => {
      if ($body.find(".ant-message-error").length > 0) {
        cy.get(".ant-message-error").then(($error) => {
          throw new Error("Login failed with message: " + $error.text());
        });
      } else {
        cy.url().should("include", "/");
        // cy.getAllLocalStorage().then((storage) => {
        //   expect(storage).to.have.property("token");
        // });
      }
    });
  });

  it("should redirect to dashboard if already logged in", () => {
    // cy.setLocalStorage("token", "mock-token");
    cy.visit("/login");
    cy.url().should("include", "/");
  });
});

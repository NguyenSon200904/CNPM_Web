describe("Products Management", () => {
  // Đăng nhập trước khi chạy các test case
  beforeEach(() => {
    // Truy cập trang đăng nhập
    cy.visit("/login");

    // Nhập thông tin đăng nhập hợp lệ
    cy.get("#username > .ant-input").type("admin"); // Thay bằng username hợp lệ
    cy.get(".ant-input-affix-wrapper > .ant-input").type("admin123"); // Thay bằng password hợp lệ
    cy.get(".ant-btn-primary").click();

    // Kiểm tra đăng nhập thành công
    cy.url().should("include", "/"); // Đảm bảo chuyển hướng sau khi đăng nhập
    // cy.getAllLocalStorage().then((storage) => {
    //   expect(storage).to.have.property("token"); // Đảm bảo token được lưu
    // });

    // Truy cập trang sản phẩm sau khi đăng nhập
    cy.visit("/san-pham");
  });

  it("should load the products page successfully", () => {
    // Kiểm tra tiêu đề "Quản lý sản phẩm"
    cy.contains("Quản lý sản phẩm").should("be.visible");
  });

  it("should allow adding a new product", () => {
    // Nhấn nút "Thêm"
    cy.get("button").contains("Thêm").click();

    // Nhập thông tin sản phẩm
    cy.get('input[name="name"]').type("Sản phẩm A");
    cy.get('input[name="price"]').type("100000");

    // Nhấn nút "Thêm" để lưu sản phẩm
    cy.get("button").contains("Thêm").click();

    // Kiểm tra thông báo thành công (có thể dùng Ant Design)
    cy.get(".ant-message-success", { timeout: 5000 }).should(
      "contain.text",
      "Thêm sản phẩm thành công!"
    );

    // Kiểm tra sản phẩm mới có trong danh sách không (tùy chọn)
    cy.contains("Sản phẩm A").should("be.visible");
    cy.contains("100000").should("be.visible");
  });
});

describe('Import Receipts', () => {
  it('should load the import receipts page successfully', () => {
    cy.visit('/phieu-nhap');
    cy.contains('Quản lý phiếu nhập').should('be.visible');
  });

  it('should allow importing an Excel file', () => {
    cy.visit('/phieu-nhap');
    cy.get('input[type="file"]').attachFile('sample-import.xlsx');
    cy.contains('Nhập Excel thành công!').should('be.visible');
  });
});
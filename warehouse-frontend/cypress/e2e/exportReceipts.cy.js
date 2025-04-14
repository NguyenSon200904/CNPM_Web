describe('Export Receipts', () => {
  it('should load the export receipts page successfully', () => {
    cy.visit('/phieu-xuat');
    cy.contains('Quản lý phiếu xuất').should('be.visible');
  });

  it('should allow exporting an Excel file', () => {
    cy.visit('/phieu-xuat');
    cy.get('button').contains('Xuất Excel').click();
    cy.contains('Xuất Excel thành công!').should('be.visible');
  });
});
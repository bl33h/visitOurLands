describe('Prueba de Backend en SignIn', () => {
  it('Debería realizar la evaluación de inicio de sesión', () => {
    cy.visit('http://localhost:3000/SignIn');
    
    // Simular interacción con los campos de entrada (correo, usuario, contraseña, confirmar contraseña, etc.)
    cy.get('[data-testid="input-correo"]').type('usuario@example.com');
    cy.get('[data-testid="input-username"]').type('usuario123');
    cy.get('[data-testid="input-password"]').type('contraseña@123');
    cy.get('[data-testid="input-confirm-password"]').type('contraseña@123');
    
    // Simular clic en el botón de registro
    cy.get('[data-testid="registro-button"]').click();
    
    // Verificar que el backend se haya evaluado correctamente
    cy.contains('Su usuario ha sido creado con éxito!').should('be.visible');
  });
});
describe('Prueba de Backend en Login', () => {
    it('Debería realizar la evaluación de inicio de sesión', () => {
      cy.visit('http://localhost:3000/Login');
      
      // Simular interacción con los campos de entrada (usuario, contraseña, etc.)
      cy.get('[data-testid="input-usernam"]').type('fernando');
      cy.get('[data-testid="input-p"]').type('fabian*adaf');
      
      // Simular clic en el botón de inicio de sesión
      cy.get('[data-testid="login-button"]').click();
      
      // Verificar que el backend se haya evaluado correctamente
      cy.contains('Usuario o contraseña incorrectos').should('be.visible');
    });
  });

  describe('Prueba de Backend en Login', () => {
    it('Debería realizar la evaluación de inicio de sesión y redirigir a la MainPage', () => {
      cy.visit('http://localhost:3000/Login');
      
      // Simular interacción con los campos de entrada (usuario, contraseña)
      cy.get('[data-testid="input-usernam"]').type('fer');
      cy.get('[data-testid="input-p"]').type('fabian*');
      
      // Simular clic en el botón de inicio de sesión
      cy.get('[data-testid="login-button"]').click();

      cy.wait(2000); // Espera 2 segundos (ajusta este tiempo según sea necesario)
      
      // Verificar que se haya redirigido a la MainPage
     // Verificar que la redirección se haya realizado correctamente
    cy.window().then((win) => {
        cy.url().should('eq', `${win.location.origin}/MainPage`); // Ajusta la URL de redirección
      });
    });
  });
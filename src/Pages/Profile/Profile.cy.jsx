import React from 'react'
import Profile from './Profile'

describe('<Profile />', () => {
  it('click on edit button', () => {
    cy.mount(<Profile/>)
    cy.get('[data-testid="edit-button"]').click();
    cy.contains('Edita tus recomendaciones').should('be.visible');
  });

  
  it('click on save button', () => {
    cy.mount(<Profile/>)
    cy.get('[data-testid="save-button"]').click();
  });

  it('click on like button', () => {
    cy.mount(<Profile/>)
    cy.get('[data-testid="like-button"]').click();
  });
})
import React from 'react'
import CreatePlace from './CreatePlace'

describe('<CreatePlace />', () => {
  it('Displays page and title', () => {
    cy.mount(<CreatePlace />)
    cy.contains('Crear un nuevo lugar').should('be.visible');
  })

  it('Rating stars', () => {
    cy.mount(<CreatePlace />)
    cy.get('.ec-stars-wrapper a[data-value="4"]').click();
  })

  it('Crear Lugar button', () => {
    cy.mount(<CreatePlace />)
    cy.get('[data-testid="nombre-label"]').click();
  })
})
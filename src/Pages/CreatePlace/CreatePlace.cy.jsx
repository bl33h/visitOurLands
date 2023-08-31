import React from 'react'
import CreatePlace from './CreatePlace'

describe('<CreatePlace />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CreatePlace />)
  })
})
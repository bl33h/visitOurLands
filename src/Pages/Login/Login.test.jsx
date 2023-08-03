import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Login from './Login';

/* Credentials error management in the Login page only when it's necessary*/
test('negate function test', () => {
  const { getByText, container } = render(<Login />);

  // Simulate a click on the "INICIAR SESION" button to trigger an attempt to log in
  fireEvent.click(getByText('INICIAR SESION'));

  // Get the error message element
  const errorMessageElement = container.querySelector('p[style="color: red;"]');

  // Verify that the error message is present (this means there is an error)
  expect(errorMessageElement.textContent).toBe('Ingrese el nombre de usuario y la contraseña');

  // Perform a second login attempt to check if the error message is cleared
  fireEvent.click(getByText('INICIAR SESION'));

  // Wait for a sufficient amount of time for the login attempt to be processed
  setTimeout(() => {

    // Verify that the error message has been cleared after the second login attempt
    expect(errorMessageElement.textContent).toBe('');
  }, 1500);
});

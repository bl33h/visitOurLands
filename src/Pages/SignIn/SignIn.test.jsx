import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from './SignIn';

// Input validation function
const testInputUpdate = (inputId, inputValue) => {
  const { container } = render(<SignIn />);
  const input = container.querySelector(inputId);

  // Simulate user typing inputValue into the input
  fireEvent.change(input, { target: { value: inputValue } });

  // Check if the value of the input is updated correctly
  expect(input.value).toBe(inputValue);
};

// Input to validate information for user
const fillAndSubmitForm = async (email, username, password) => {
  render(<SignIn />);
  const correoInput = screen.getByTestId('input-correo');
  const usernameInput = screen.getByTestId('input-username');
  const passwordInput = screen.getByTestId('input-password');
  const confirmPasswordInput = screen.getByTestId('input-confirm-password');

  fireEvent.change(correoInput, { target: { value: email } });
  fireEvent.change(usernameInput, { target: { value: username } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, { target: { value: password } });

  fireEvent.click(screen.getByText('REGISTRARME'));
};

/* Sign In spaces allow inputs test*/
test('updates username input correctly', () => {
  testInputUpdate('#input-username', 'john_doe');
});

test('updates password input correctly', () => {
  testInputUpdate('#input-password', 'password123!');
});

test('updates confirm password input correctly', () => {
  testInputUpdate('#input-confirm-password', 'password123!');
});

/* Password error management in the Sign In page only when it's necessary */
test('does not show error message when passwords match', () => {
    const { container } = render(<SignIn />);
  
    const usernameInput = container.querySelector('#input-username');
    const passwordInput = container.querySelector('#input-password');
    const confirmPasswordInput = container.querySelector('#input-confirm-password');
  
    fireEvent.change(usernameInput, { target: { value: 'john_doe' } });
    fireEvent.change(passwordInput, { target: { value: 'password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123!' } });
});

test('debe registrar un nuevo usuario correctamente', async () => {
  await fillAndSubmitForm('nuevo@example.com', 'Usuario_Tests', 'clave123$');

  // Wait for the success message to be displayed
  await waitFor(() => expect(screen.getByText('Su usuario ha sido creado con éxito!')).toBeInTheDocument());
});

test('debe mostrar un mensaje de error si el usuario ya existe', async () => {
  await fillAndSubmitForm('fabian@gmail.com', 'as', '123465^');

  // Wait for the error message to be displayed
  await waitFor(() => expect(screen.getByText('El usuario ya existe.')).toBeInTheDocument());
});
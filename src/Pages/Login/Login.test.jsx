import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Login from './Login';

const fillAndSubmitForm = async (username, password) => {
  render(<Login />);
  const usernameInput = screen.getByTestId('input-usernam');
  const passwordInput = screen.getByTestId('input-p');
  fireEvent.change(usernameInput, { target: { value: username } });
  fireEvent.change(passwordInput, { target: { value: password } });

  fireEvent.click(screen.getByText('INICIAR SESION'));
};

/* Credentials error management in the Login page only when it's necessary */
test('negate function test', () => {
  const { getByText, container } = render(<Login />);

  // Simulate a click on the "INICIAR SESION" button to trigger an attempt to log in
  fireEvent.click(getByText('INICIAR SESION'));
  // Get the error message element
  const errorMessageElement = container.querySelector('p[style="color: red;"]');
  // Verify that the error message is present (this means there is an error)
  const errorMessageElemen = screen.queryByText('Ingrese el nombre de usuario y la contraseña');
  console.log('errorMessageElement.textContent:', errorMessageElemen.textContent);
  expect(errorMessageElement.textContent).toBe('Ingrese el nombre de usuario y la contraseña');
  // Perform a second login attempt to check if the error message is cleared
  fireEvent.click(getByText('INICIAR SESION'));
  // Wait for a sufficient amount of time for the login attempt to be processed
  setTimeout(() => {
    // Verify that the error message has been cleared after the second login attempt
    expect(errorMessageElement.textContent).toBe('');
  }, 1500);
});

test('should display error for empty username and password fields', async () => {

  await fillAndSubmitForm('', '');

  await waitFor(() =>
    expect(screen.getByText('Ingrese el nombre de usuario y la contraseña')).toBeInTheDocument()
  );
});

describe('Login component', () => {
  it('should render the login form', () => {
    render(<Login />);
    
    expect(screen.getByText('Username:')).toBeInTheDocument();
    expect(screen.getByText('Password:')).toBeInTheDocument();
    expect(screen.getByText('Mostrar contraseña')).toBeInTheDocument();
    expect(screen.getByText('INICIAR SESION')).toBeInTheDocument();
    expect(screen.getByText('¿Aún no tienes una cuenta?')).toBeInTheDocument();
    expect(screen.getByText('REGISTRATE')).toBeInTheDocument();
  });
});





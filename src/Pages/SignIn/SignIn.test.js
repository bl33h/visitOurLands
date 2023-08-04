import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SignIn from './SignIn';

const fillAndSubmitForm = async (email, username, password) => {
  fireEvent.change(screen.getByTestId('input-correo'), { target: { value: email } });
  fireEvent.change(screen.getByTestId('input-username'), { target: { value: username } });
  fireEvent.change(screen.getByTestId('input-password'), { target: { value: password } });
  fireEvent.change(screen.getByTestId('input-confirm-password'), { target: { value: password } });

  fireEvent.click(screen.getByText('REGISTRARME'));
};

describe('Test de check_signIn en el que el usuario aun no existe y se ingresa en SignIn', () => {
  beforeEach(() => {
    render(<SignIn />);
  });

  it('debe registrar un nuevo usuario correctamente', async () => {
    await fillAndSubmitForm('nuevo@example.com', 'Usuario_Tests', 'clave123$');

    // Wait for the success message to be displayed
    await waitFor(() => expect(screen.getByText('Su usuario ha sido creado con éxito!')).toBeInTheDocument());
  });

  it('debe mostrar un mensaje de error si el usuario ya existe', async () => {
    await fillAndSubmitForm('fabian@gmail.com', 'as', '123465^');

    // Wait for the error message to be displayed
    await waitFor(() => expect(screen.getByText('El usuario ya existe.')).toBeInTheDocument());
  });
});
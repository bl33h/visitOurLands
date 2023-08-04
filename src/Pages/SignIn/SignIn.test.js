import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SignIn from './SignIn';

describe('Test de check_signIn en SignIn', () => {
  it('debe registrar un nuevo usuario correctamente', async () => {
    render(<SignIn />);

    // Simular ingreso de datos en los campos de input
    fireEvent.change(screen.getByTestId('input-correo'), { target: { value: 'nuevo@example.com' } });
    fireEvent.change(screen.getByTestId('input-username'), { target: { value: 'Usuario_Tests' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'clave123$' } });
    fireEvent.change(screen.getByTestId('input-confirm-password'), { target: { value: 'clave123$' } });

    // Simular el clic en el botón REGISTRARME
    fireEvent.click(screen.getByText('REGISTRARME'));

    // Wait for the success message to be displayed
    await waitFor(() => expect(screen.getByText('Su usuario ha sido creado con éxito!')).toBeInTheDocument());
  });
});

describe('Test de check_signIn en SignIn', () => {
  it('debe mostrar un mensaje de error si el usuario ya existe', async () => {
    render(<SignIn />);

    // Simular ingreso de datos en los campos de input
    fireEvent.change(screen.getByTestId('input-correo'), { target: { value: 'nuevo@example.com' } });
    fireEvent.change(screen.getByTestId('input-username'), { target: { value: 'Usuario_Tests' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'clave123$' } });
    fireEvent.change(screen.getByTestId('input-confirm-password'), { target: { value: 'clave123$' } });

    // Simular el clic en el botón REGISTRARME
    fireEvent.click(screen.getByText('REGISTRARME'));

    // Wait for the error message to be displayed
    await waitFor(() => expect(screen.getByText('El usuario ya existe.')).toBeInTheDocument());
  });
});
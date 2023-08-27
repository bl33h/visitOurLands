import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditRecommendations from './edit';

const fillEditingForm = async (description, rating, image) => {
  fireEvent.change(screen.getByTestId('input-description'), { target: { value: description } });
  fireEvent.change(screen.getByTestId('input-rating'), { target: { value: rating } });
  fireEvent.change(screen.getByTestId('input-image'), { target: { value: image } });

  fireEvent.click(screen.getByText('Guardar'));
};

describe('EditRecommendations saves the updated recommendation', () => {
  it('recomendacion editada correctamente', async () => {
    // Preparar valores de prueba para las propiedades
    const recommendation = {
      id_places: 1, // Replace with the actual valid id_places
      name: 'Tikal',
      description: 'Descripción de la recomendación',
      rating: 4,
      image: 'https://ejemplo.com/imagen.jpg',
    };
    const onSave = jest.fn(); // Simular la función onSave
    const onCancelEdit = jest.fn(); // Simular la función onCancelEdit

    render(
      <EditRecommendations
        recommendation={recommendation}
        onSave={onSave}
        onCancelEdit={onCancelEdit}
      />
    );

    await fillEditingForm('asdfg lkjhg', `3`, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Google_Images_2015_logo.svg/1200px-Google_Images_2015_logo.svg.png');

    // Wait for the success message to be displayed
    await waitFor(() =>
      expect(screen.getByText('¡Recomendación editada correctamente!')).toBeInTheDocument()
    );
  });
});

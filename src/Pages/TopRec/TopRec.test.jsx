import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TopRec from './TopRec';

test('renders loading message when recommendations are loading', () => {
  render(<TopRec />);
  const loadingMessage = screen.getByText('Cargando recomendaciones...');
  expect(loadingMessage).toBeInTheDocument();
});


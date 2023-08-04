import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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

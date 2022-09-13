import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = window.getElementByClassName("displayHome mt-4");
  expect(linkElement).toBeInTheDocument();
});

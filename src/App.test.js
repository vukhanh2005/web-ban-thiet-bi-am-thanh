import { render, screen } from '@testing-library/react';
import App from './App';

test('renders storefront heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /trang chủ/i, level: 1 });
  expect(headingElement).toBeInTheDocument();
});

import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

describe('App Component', () => {

  beforeEach(() => {
    render (
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
  })

test('renders learn react link', () => {
  const linkElement = screen.getByText(/Home/i);
  expect(linkElement).toBeInTheDocument();
});

   // Test for navigation link to Home
    it('should navigate to Home Page', () => {

        // Test clicking the "Home" link and verify if it navigates
        const homeLink = screen.getByText('Home');
        fireEvent.click(homeLink);
        const button = screen.getByRole("button", { name: "Add New Post" });
        expect(button).toBeInTheDocument();

    });

    // Test for navigation link to About page
    it('should navigate to About Page', () => {

        // Test clicking the "About" link and verify if it navigates
        const aboutLink = screen.getByText('About');
        fireEvent.click(aboutLink);
        expect(screen.getByText('Kathy Dang')).toBeInTheDocument();
    });
});

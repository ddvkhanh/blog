import { render, screen, fireEvent, act } from '@testing-library/react';
import NavBar from '../components/NavBar';
import { MemoryRouter } from 'react-router-dom';

describe('NavBar Component', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
    })

    // Test for rendering the component
    it('should render navigation items', () => {

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
    });

    // Test for mobile menu toggle (open/close)
    it('should open and close the mobile menu', async () => {

        // Mobile menu should be initially closed
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        // Open the mobile menu by clicking the menu button
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Open main menu/i }));
        });
        // Mobile menu should be open
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        // Close the mobile menu
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Close menu/i }));
        });
        // Mobile menu should be closed
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Test for the desktop menu display (for large screens)
    it('should show desktop navigation on large screens', () => {

        // Desktop menu items should be visible on large screens
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
    });
});


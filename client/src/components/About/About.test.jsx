import { render, screen } from '@testing-library/react'; // Import testing utilities
import About from './About';

describe('About Component', () => {
    beforeEach(() => {
        render(<About />);
    })

    it('should render the About page with correct information', () => {
        expect(screen.getByText('Kathy Dang')).toBeInTheDocument();
        expect(screen.getByText(/Welcome to my blog/)).toBeInTheDocument();
    });

    it('should open the portfolio link in a new tab', () => {
        const portfolioLink = screen.getByRole('link', { name: /Visit my Portfolio/i });

        expect(portfolioLink).toHaveAttribute('target', 'blank');
    })

    it('should have the correct rel attribute for security reasons', () => {
        const portfolioLink = screen.getByRole('link', { name: /Visit my Portfolio/i });

        // Ensure the link has the rel attribute set for security
        expect(portfolioLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

})
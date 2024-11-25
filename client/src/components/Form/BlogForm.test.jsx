import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import BlogForm from './BlogForm';

//mock useNavigate
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}));

// mock axios
jest.mock('axios');

describe('BlogForm Component', () => {

    beforeAll(() => {
        global.alert = jest.fn();
    })

    beforeEach(() => {
        mockedUseNavigate.mockReset();
        render(
            <MemoryRouter initialEntries={['/new']}>
                <BlogForm />
            </MemoryRouter>
        )
    });

    it('should render the blog form component', () => {
        expect(screen.getByText(/Add New Post/i)).toBeInTheDocument();
    });

    it('should update the form input fields when typing', () => {
        const titleInput = screen.getByLabelText(/Title/i);
        const contentInput = screen.getByLabelText(/Content/i);

        fireEvent.change(titleInput, { target: { value: 'New Blog Post' } });
        fireEvent.change(contentInput, { target: { value: 'This is the content of the blog post' } })

        expect(titleInput.value).toBe('New Blog Post');
        expect(contentInput.value).toBe('This is the content of the blog post');
    });

    it('should display selected file name when select to upload a file', () => {
        const fileInput = screen.getByLabelText(/Thumbnail photo/i);
        const file = new File(['image content'], 'thumbnail.png', { type: 'image/png' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(screen.getByText('Selected file: thumbnail.png')).toBeInTheDocument();
    });

    it('should call the cancel function and navigate home', () => {
        const cancelButton = screen.getByRole('button', { name: /Cancel/i });
        fireEvent.click(cancelButton);
        expect(mockedUseNavigate).toHaveBeenCalledWith('/');
    });

    it('should make an API call to create a new post on form submission', async () => {
        const titleInput = screen.getByLabelText(/Title/i);
        const contentInput = screen.getByLabelText(/Content/i);
        const submitButton = screen.getByRole('button', { name: /Add Post/i });

        fireEvent.change(titleInput, { target: { value: 'New Blog Post' } });
        fireEvent.change(contentInput, { target: { value: 'This is a test blog post.' } });

        // Mock the POST request to resolve successfully
        axios.post.mockResolvedValueOnce({ data: { id: 1, title: 'New Blog Post' } });

        fireEvent.click(submitButton);

        // Wait for the API call and navigation to happen
        await waitFor(() => {
            // Assert that the form data was posted correctly
            expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.any(FormData), expect.any(Object));

            // Check if alert was called with the correct message
            expect(global.alert).toHaveBeenCalledWith('Post created successfully');
        });

    });



});

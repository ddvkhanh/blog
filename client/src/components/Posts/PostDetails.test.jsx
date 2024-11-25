import PostDetails from "./PostDetails";
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { API_POSTS } from '../../constants/data';


jest.mock('axios');
describe('PostDetails Component', () => {
    const post = { id: 1, title: 'Post 1', content: 'Content 1', thumbnail: '/path/to/image.png' };

    beforeEach(() => {
        axios.get.mockResolvedValueOnce({ data: post });

        render(
            <MemoryRouter initialEntries={[`/${post.id}`]}>
                <Routes>
                    <Route path="/:id" element={<PostDetails />} />
                </Routes>
            </MemoryRouter>
        );
    })

    it('should navigate back to the post list page when "Back" is clicked', async () => {
        await waitFor(() => screen.getByText('Post 1'));  // Ensures post is rendered first
        const backButton = screen.getByText('Back');
        await act(async () => {
            fireEvent.click(backButton);
        });

        expect(window.location.pathname).toBe('/');
    });

    it('should fetch and display the post details', async () => {
        await waitFor(() => expect(axios.get).toHaveBeenCalledWith(`${API_POSTS}/${post.id}`));

        expect(screen.getByText(post.title)).toBeInTheDocument();
        expect(screen.getByText(post.content)).toBeInTheDocument();
    });

});
import PostList from "./PostList";
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import axios from 'axios';

jest.mock('axios');

describe('PostDetails Component', () => {
    beforeEach(() => {
        axios.get.mockResolvedValueOnce({
            data: [{ id: 1, title: 'Post 1', content: 'Content 1' }, { id: 2, title: 'Post 2', content: 'Content 2' }]
        });

        render(
            <MemoryRouter>
                <PostList />
            </MemoryRouter>
        );
    })

    it('should render list of posts', async () => {

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('http://localhost:5001/api/posts');

            expect(screen.getByText('Post 1')).toBeInTheDocument();
            expect(screen.getByText('Post 2')).toBeInTheDocument();
        });
    })

});
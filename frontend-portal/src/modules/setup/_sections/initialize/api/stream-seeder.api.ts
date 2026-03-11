const API_URL = import.meta.env.API_URL || import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';

export const streamSeederApi = (key: string) => {
    return new EventSource(`${API_URL}/seeder/stream/${key}`);
};

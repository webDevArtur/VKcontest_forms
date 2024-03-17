import axios from 'axios';

export async function fetchCatFact(): Promise<string> {
    try {
        const response = await axios.get('https://catfact.ninja/fact');
        return response.data.fact;
    } catch (error) {
        console.error('Error fetching cat fact:', error);
        throw error;
    }
}

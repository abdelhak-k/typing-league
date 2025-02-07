import api from '../api.js'

const createTest = async (score, duration) => {
    try {
        const response = await api.post('/create-test/', {score, duration });
        return response.data;
    } catch (error) {
        console.error('Error creating test:', error.response?.data);
        throw error;
    }
};

export default createTest;
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { jwtDecode } from 'jwt-decode';

const useFetchSubmissions = () => {
    const { auth } = useContext(AuthContext);
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!auth) return null; // Ensure auth token exists

            try {
                const decodedToken = jwtDecode(auth);
                const username = decodedToken.sub;

                const response = await axios.get(`http://localhost:8080/submissions/users/${username}`, {
                    headers: {
                        Authorization: `Bearer ${auth}`
                    }
                });
                setSubmissions(response.data);
            } catch (error) {
                console.error('Error fetching user submissions:', error);
                throw error; // You might choose to throw an error to handle it externally
            }
        };

        fetchSubmissions();
    }, [auth]);

    return submissions;
};

export default useFetchSubmissions;
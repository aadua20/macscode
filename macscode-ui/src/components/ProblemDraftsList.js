import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/ProblemDraftsList.css';
import { jwtDecode } from 'jwt-decode';
import TopBar from "./TopBar";

const ProblemDraftsList = () => {
    const { auth } = useContext(AuthContext);
    const [drafts, setDrafts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const draftsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDrafts = async () => {
            try {
                const decodedToken = jwtDecode(auth);
                const response = await axios.get(`/problems-service/authors/drafts`, {
                    headers: {
                        Authorization: `Bearer ${auth}`
                    }
                });
                setDrafts(response.data);
            } catch (error) {
                console.error('Error fetching drafts', error);
            }
        };

        if (auth) {
            fetchDrafts();
        }
    }, [auth]);

    const handleDraftClick = (draftId) => {
        navigate(`/problem-creation?id=${draftId}`);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastDraft = currentPage * draftsPerPage;
    const indexOfFirstDraft = indexOfLastDraft - draftsPerPage;
    const currentDrafts = drafts.slice(indexOfFirstDraft, indexOfLastDraft);
    const totalPages = Math.ceil(drafts.length / draftsPerPage);

    return (
        <div className="drafts-container">
            <TopBar/>
            <h3 className="drafts-title">Problem Drafts</h3>
            {drafts.length === 0 ? (
                <p className="no-drafts">You have no drafts</p>
            ) : (
                <div className="drafts-list">
                    {currentDrafts.map(draft => (
                        <div className="draft-item" key={draft.id}>
                            <div className="draft-info">
                                <div className="draft-id">ID: {draft.id}</div>
                                <div className="draft-name">Name: {draft.name}</div>
                            </div>
                            <button
                                className="edit-draft-button"
                                onClick={() => handleDraftClick(draft.id)}
                            >
                                Edit Draft
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {totalPages > 1 && (
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProblemDraftsList;

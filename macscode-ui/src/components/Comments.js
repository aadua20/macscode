import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/Comments.css';
import { AuthContext } from '../AuthContext';

const Comments = ({ problemId }) => {
    const { auth } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [commentsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (auth) {
            const decodedToken = jwtDecode(auth);
            setUsername(decodedToken.sub);
        }

        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8082/discussion/comments/${problemId}`);
                setComments(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching comments', error);
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [problemId, auth]);

    const handleAddComment = async () => {
        if (newComment.trim() === '') return;

        try {
            const response = await axios.post('http://localhost:8082/discussion/addComment', {
                problemId,
                comment: newComment,
                username,
            });
            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
    const totalPages = Math.ceil(comments.length / commentsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <div className="loading-text">Loading...</div>
            </div>
        );
    }

    return (
        <div className="comments-container">
            <div className="add-comment">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add your comment..."
                    maxLength={500}
                />
                <button onClick={handleAddComment}>Submit</button>
            </div>
            <div className="comments-list">
                {currentComments.map((comment) => (
                    <Comment key={comment.id} comment={comment} username={username} formatDate={formatDate} />
                ))}
            </div>
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
        </div>
    );
};

const Comment = ({ comment, username, formatDate }) => {
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [showReplies, setShowReplies] = useState(false);

    const fetchReplies = async () => {
        if (!showReplies) {
            try {
                const response = await axios.get(`http://localhost:8082/discussion/replies/${comment.id}`);
                setReplies(response.data);
            } catch (error) {
                console.error('Error fetching replies', error);
            }
        }
        setShowReplies(!showReplies);
    };

    const handleAddReply = async () => {
        if (newReply.trim() === '') return;

        try {
            const response = await axios.post('http://localhost:8082/discussion/addReply', {
                commentId: comment.id,
                reply: newReply,
                username,
            });
            setReplies([...replies, response.data]);
            setNewReply('');
        } catch (error) {
            console.error('Error adding reply', error);
        }
    };

    return (
        <div className="comment">
            <div className="comment-header">
                <span className="comment-username">{comment.username}</span>
                <span className="comment-date">{formatDate(comment.commentDate)}</span>
            </div>
            <p className="comment-body">{comment.comment}</p>
            <button className="reply-button" onClick={fetchReplies}>
                {showReplies ? 'Hide Replies' : 'Show Replies'}
            </button>
            {showReplies && (
                <div className="replies-section">
                    {replies.map((reply) => (
                        <div key={reply.id} className="reply">
                            <div className="reply-header">
                                <span className="reply-username">{reply.username}</span>
                                <span className="reply-date">{formatDate(reply.replyDate)}</span>
                            </div>
                            <p className="reply-body">{reply.reply}</p>
                        </div>
                    ))}
                    <div className="add-reply">
                        <textarea
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="Add your reply..."
                            maxLength={250}
                        />
                        <button onClick={handleAddReply}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Comments;

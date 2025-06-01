import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from "../component/AuthContext";
import { CircularProgress } from '@mui/material';
import AlertMessage from '../component/AlertMessage';

export default function ProductDetails() {
    const { currUser } = useAuth();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviewPopupOpen, setReviewPopupOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [alert, setAlert] = useState({ msg: '', severity: '' });

    const reviewPopup = () => setReviewPopupOpen(true);
    const closeReviewPopup = () => {
        setReviewPopupOpen(false);
        setRating(0);
        setComment('');
    }

    useEffect(() => {
        fetch(`https://booknest-3ev5.onrender.com/products/${id}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => setProduct(data.product))
            .catch(err => console.error(err));
    }, [id]);

    useEffect(() => {
        if (!reviewPopupOpen) return;

        (() => {
            'use strict';
            const forms = document.querySelectorAll('.needs-validation');

            Array.from(forms).forEach((form) => {
                form.addEventListener(
                    'submit',
                    (event) => {
                        if (!form.checkValidity()) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add('was-validated');
                    },
                    false
                );
            });
        })();
    }, [reviewPopupOpen]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`https://booknest-3ev5.onrender.com/products/${id}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ review: { comment, rating } })
        });
        const data = await response.json();
        if (response.ok) {
            setProduct(prev => ({
                ...prev,
                reviews: [...prev.reviews, data.review]
            }));
            closeReviewPopup();
        } else {
            setAlert({ msg: "Failed to submit review", severity: "error" });
        }
    };

    const handleDeleteReview = async (reviewId) => {
        const response = await fetch(`https://booknest-3ev5.onrender.com/products/${id}/reviews/${reviewId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
            setProduct(prev => ({
                ...prev,
                reviews: prev.reviews.filter(r => r._id !== reviewId)
            }));
            setAlert({ msg: data.msg, severity: "success" });
        } else {
            setAlert({ msg: "Failed to delete review", severity: "error" });
        }
    };
    if (!product) {
        return (
          <div className="LoaderContainer">
            <div className="Loader">
              <CircularProgress />
            </div>
          </div>
        );
      }

    const addToCart = async () => {
        try {
            const res = await fetch(`https://booknest-3ev5.onrender.com/cart/add/${product._id}`, {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                setAlert({ msg: data.msg, severity: "success" });
            } else {
                setAlert({ msg: data.message, severity: "error" });
            }
        } catch (err) {
            console.error("Add to cart error:", err);
            setAlert({ msg: "Error adding to cart", severity: "error" });
        }
    };

    return (
        <div>
            <AlertMessage alert={alert} setAlert={setAlert} />
            <div className="show-page">
                <div className="show-page-img">
                    <img src={product.image.url} alt="img" />
                </div>
                <div className="book-details">
                    <p className="title">{product.title}</p>
                    <div className="price-info price-info-detail">
                        <p className="text">Rs. {product.price}</p>
                        <p>{product.discount}% off</p>
                    </div>
                    <p className="text">Author: {product.author}</p>

                    {currUser && currUser.role !== 'admin' && (
                        <>

                            <button className="show-page-add-to-cart" onClick={addToCart}>Add to cart</button>

                            <Link to={`/address/${product._id}?checkout=buyNow`}>
                                <button className="button">BUY NOW</button>
                            </Link>
                        </>
                    )}

                    {currUser?.role === 'admin' && (
                        <Link to={`/Edit/${product._id}`}>
                            <button className="button">EDIT</button>
                        </Link>
                    )}

                    <div>
                        <p className="des">{product.description}</p>
                    </div>
                </div>
            </div>

            <div>
                {currUser && currUser.role !== 'admin' && (
                    <div className="review-div">
                        <h3>Customer Reviews</h3>
                        <p>No reviews yet. Any feedback? Let us know</p>
                        <button className="review-btn" onClick={reviewPopup}>
                            Write review
                        </button>
                    </div>
                )}

                {reviewPopupOpen && (
                    <div className="popup" id="review">
                        <form onSubmit={handleReviewSubmit} className="needs-validation" noValidate>
                            <div className="popup-content">
                                <h2>Ratings & Reviews</h2>
                                <label htmlFor="rating" className="form-label">Give a Rating</label>

                                <fieldset className="starability-slot">
                                    <input
                                        type="radio"
                                        id="no-rate"
                                        className="input-no-rate"
                                        name="review[rating]"
                                        value="0"
                                        checked={rating === 0}
                                        onChange={() => setRating(0)}
                                        aria-label="No rating"
                                        hidden
                                    />
                                    <input
                                        type="radio"
                                        id="first-rate1"
                                        name="review[rating]"
                                        value="1"
                                        checked={rating === 1}
                                        onChange={() => setRating(1)}
                                    />
                                    <label htmlFor="first-rate1" title="Terrible">1 star</label>

                                    <input
                                        type="radio"
                                        id="first-rate2"
                                        name="review[rating]"
                                        value="2"
                                        checked={rating === 2}
                                        onChange={() => setRating(2)}
                                    />
                                    <label htmlFor="first-rate2" title="Not good">2 stars</label>

                                    <input
                                        type="radio"
                                        id="first-rate3"
                                        name="review[rating]"
                                        value="3"
                                        checked={rating === 3}
                                        onChange={() => setRating(3)}
                                    />
                                    <label htmlFor="first-rate3" title="Average">3 stars</label>

                                    <input
                                        type="radio"
                                        id="first-rate4"
                                        name="review[rating]"
                                        value="4"
                                        checked={rating === 4}
                                        onChange={() => setRating(4)}
                                    />
                                    <label htmlFor="first-rate4" title="Very good">4 stars</label>

                                    <input
                                        type="radio"
                                        id="first-rate5"
                                        name="review[rating]"
                                        value="5"
                                        checked={rating === 5}
                                        onChange={() => setRating(5)}
                                    />
                                    <label htmlFor="first-rate5" title="Amazing">5 stars</label>
                                </fieldset>
                                <label htmlFor="comment" className="form-label">Write your review</label>
                                <textarea
                                    name="review[comment]"
                                    rows="6"
                                    cols="40"
                                    className="form-control"
                                    required
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>

                                <button id="SUBMIT" type="submit">Submit Review</button>
                                <div onClick={closeReviewPopup} id="Cancel-btn">Cancel</div>
                            </div>
                        </form>
                    </div>
                )}
                {product.reviews.length > 0 && (
                    <div>
                        <h4 style={{ textAlign: 'center'}}>All Reviews</h4>
                        <div className="reviews-div">
                            {product.reviews.map((review) => (
                                <div className="card" key={review._id}>
                                    <div className="card-body">
                                        <h5 className="card-title">@{review.author.username}</h5>
                                        <p className="starability-result card-text" data-rating={review.rating}></p>
                                        <p className="card-text comment">{review.comment}</p>
                                    </div>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleDeleteReview(review._id);
                                        }}
                                    >
                                        <button className="btn btn-sm btn-dark">Delete review</button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

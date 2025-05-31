import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import AlertMessage from '../component/AlertMessage';
import { useAuth } from "../component/AuthContext";
import SidebarLayout from "../component/SidebarLayout";
export default function NewProduct() {
    const [alert, setAlert] = useState({ msg: '', severity: '' });
    const { currUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        author: '',
        price: '',
        discount: '',
        category: '',
    });
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handlePdfChange = (e) => {
        setPdfFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("product[title]", formData.title);
        data.append("product[description]", formData.description);
        data.append("product[author]", formData.author);
        data.append("product[price]", formData.price);
        data.append("product[discount]", formData.discount);
        data.append("product[category]", formData.category);
        data.append("product[image]", image);

        if (pdfFile && formData.category === "Notes") {
            data.append("product[pdf]", pdfFile);
        }

        try {
            const res = await fetch("https://booknest-cnfb.onrender.com/products", {
                method: "POST",
                credentials: "include",
                body: data
            });

            const result = await res.json();
            if (res.ok) {
                setAlert({ msg: result.msg, severity: "success" });
                navigate(result.redirectTo || "/products");
            } else {
                setAlert({ msg: "Failed to create product", severity: "success" });
            }
        } catch (err) {
            console.error("Error:", err);
            setAlert({ msg: "An error occurred", severity: "success" });
        } finally {
            setLoading(false);
        }
    };
    if (!currUser) {
        return (
            <div className="LoaderContainer">
                <div className="Loader">
                    <CircularProgress />
                </div>
            </div>
        );
    }
    return (

        <SidebarLayout currUser={currUser}>
            <div className="newForm">
                <AlertMessage alert={alert} setAlert={setAlert} />
                <form onSubmit={handleSubmit} className="needs-validation" noValidate encType="multipart/form-data">
                    <div className="col-6 mb-3">
                        <label htmlFor="title" className="form-label">Enter book name</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-control" required />
                        <div className="invalid-feedback">Book name should be valid.</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Write a description...</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="6" cols="40" className="form-control" required />
                        <div className="invalid-feedback">Please enter a description</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="author" className="form-label">Enter author name</label>
                        <input type="text" name="author" value={formData.author} onChange={handleChange} className="form-control" required />
                        <div className="invalid-feedback">Author name should be valid.</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Upload image</label>
                        <input type="file" name="image" onChange={handleImageChange} className="form-control" required />
                        <div className="invalid-feedback">Product image is required</div>
                    </div>

                    <div className="mb-3 col-md-6">
                        <label htmlFor="price" className="form-label">Add Price</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" required />
                        <div className="invalid-feedback">Price should be valid.</div>
                    </div>

                    <div className="mb-3 col-md-6">
                        <label htmlFor="discount" className="form-label">Add Discount</label>
                        <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="form-control" />
                    </div>

                    <select name="category" value={formData.category} onChange={handleChange} className="form-control" required style={{ marginBottom: '1.5rem' }}>
                        <option value="">-- Select Category --</option>
                        <option value="Books">Books</option>
                        <option value="Notes">Notes</option>
                    </select>

                    {formData.category === "Notes" && (
                        <div className="mb-3">
                            <label htmlFor="pdf" className="form-label">Upload Notes PDF</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                name="pdf"
                                onChange={handlePdfChange}
                                className="form-control"
                                required
                            />
                            <div className="invalid-feedback">PDF file is required for notes.</div>
                        </div>
                    )}
                    <div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : "ADD"}
                        </button>
                    </div>
                </form>
            </div>
        </SidebarLayout>
        // </div>
    );
}

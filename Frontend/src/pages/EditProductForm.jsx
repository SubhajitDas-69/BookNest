import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AlertMessage from '../component/AlertMessage';
import CircularProgress from '@mui/material/CircularProgress';

export default function EditProductForm() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ msg: '', severity: '' });
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState(null);
  const [product, setProduct] = useState({
    title: '',
    description: '',
    author: '',
    price: '',
    discount: '',
    category: '',
  });
  const [image, setImage] = useState(null);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    fetch(`https://booknest-cnfb.onrender.com/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.product) {
          setProduct(data.product);
        } else {
          setAlert({ msg: "Product not found", severity: "error" });
          navigate('/');
        }
      })
      .catch(err => {
        console.error('Failed to fetch product:', err);
        setAlert({ msg: "Failed to load product.", severity: "error" });
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    if (!e.currentTarget.checkValidity()) {
      setValidated(true);
      return;
    }

    const formData = new FormData();
    const { _id, __v, reviews, image: existingImage, pdf, ...productToSend } = product;

    for (let key in productToSend) {
      formData.append(`product[${key}]`, productToSend[key]);
    }

    if (image) {
      formData.append('product[image]', image);
    }

    if (product.category === "Notes" && pdfFile) {
      formData.append("product[pdf]", pdfFile);
    }

    try {
      const response = await fetch(`https://booknest-cnfb.onrender.com/products/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({ msg: data.msg, severity: "success" });
        navigate(data.redirectTo || `/products/${id}`);
      } else {
        setAlert({ msg: "Error updating product.", severity: "error" });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setAlert({ msg: "Server error. Try again later.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newFormEdit col-6 mx-auto mt-5">
      <AlertMessage alert={alert} setAlert={setAlert} />
      <form
        noValidate
        className={`needs-validation ${validated ? 'was-validated' : ''}`}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Book Name</label>
          <input type="text" name="title" value={product.title} onChange={handleChange} className="form-control" required />
          <div className="invalid-feedback">Book name is required.</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" rows="6" value={product.description} onChange={handleChange} className="form-control" required />
          <div className="invalid-feedback">Please enter a description.</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Author Name</label>
          <input type="text" name="author" value={product.author} onChange={handleChange} className="form-control" required />
          <div className="invalid-feedback">Author name is required.</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input type="file" name="product[image]" onChange={handleImageChange} className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} className="form-control" required />
          <div className="invalid-feedback">Enter a valid price.</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Discount (%)</label>
          <input type="number" name="discount" value={product.discount} onChange={handleChange} className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select name="category" value={product.category} onChange={handleChange} className="form-control" required>
            <option value="">-- Select Category --</option>
            <option value="Books">Books</option>
            <option value="Notes">Notes</option>
          </select>
          <div className="invalid-feedback">Please select a category.</div>
        </div>

        {product.category === "Notes" && (
          <div className="mb-3">
            <label htmlFor="product[pdf]" className="form-label">Upload Notes PDF</label>
            <input
              type="file"
              accept="application/pdf"
              name="product[pdf]"
              onChange={handlePdfChange}
              className="form-control"
            />
          </div>
        )}
        <div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

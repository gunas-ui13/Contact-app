import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  // BASE URL for your deployed backend
  const API_BASE_URL = 'https://contact-app-kxj8.onrender.com/api/contacts';

  const fetchContacts = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setContacts(res.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormInvalid = !formData.name || !formData.email.includes('@') || !formData.phone;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_BASE_URL, formData);
      setFormData({ name: '', email: '', phone: '', message: '' });
      await fetchContacts(); 
      alert("Contact added successfully!");
    } catch (err) {
      alert("Error saving contact. Please check if the backend is awake (Render can take 60s to wake up).");
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.post(`${API_BASE_URL}/delete/${id}`);
        fetchContacts(); 
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Contact Management</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input 
            style={styles.input} 
            name="name" 
            placeholder="Full Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
          <input 
            style={styles.input} 
            name="email" 
            type="email" 
            placeholder="Email Address" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <input 
            style={styles.input} 
            name="phone" 
            placeholder="Phone Number" 
            value={formData.phone} 
            onChange={handleChange} 
            required 
          />
          <textarea 
            style={styles.textarea} 
            name="message" 
            placeholder="Message (Optional)" 
            value={formData.message} 
            onChange={handleChange} 
          />
          
          <button 
            type="submit" 
            disabled={isFormInvalid || loading} 
            style={isFormInvalid ? styles.buttonDisabled : styles.button}
            onMouseEnter={(e) => !isFormInvalid && (e.target.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => !isFormInvalid && (e.target.style.transform = 'scale(1)')}
          >
            {loading ? 'Saving...' : 'Add Contact'}
          </button>
        </form>

        <h3 style={styles.subtitle}>Recent Contacts</h3>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c._id} style={styles.tr}>
                  <td style={styles.td}>{c.name}</td>
                  <td style={styles.td}>{c.email}</td>
                  <td style={styles.td}>{c.phone}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => deleteContact(c._id)} 
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contacts.length === 0 && <p style={{textAlign: 'center', padding: '20px', color: '#636e72'}}>No contacts found.</p>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    minHeight: '100vh', 
    padding: '40px 20px', 
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  card: { 
    maxWidth: '900px', 
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    padding: '40px', 
    borderRadius: '24px', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    backdropFilter: 'blur(10px)',
    margin: '20px 0'
  },
  title: { textAlign: 'center', color: '#2d3436', fontSize: '2.2rem', marginBottom: '35px', fontWeight: '800', letterSpacing: '-1px' },
  subtitle: { marginTop: '45px', color: '#2d3436', fontSize: '1.6rem', borderBottom: '3px solid #667eea', paddingBottom: '10px', fontWeight: '700' },
  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  input: { padding: '14px', borderRadius: '10px', border: '1px solid #dfe6e9', fontSize: '16px', outline: 'none', backgroundColor: '#fff', transition: 'border 0.3s ease' },
  textarea: { gridColumn: '1 / span 2', padding: '14px', borderRadius: '10px', border: '1px solid #dfe6e9', fontSize: '16px', height: '110px', outline: 'none', fontFamily: 'inherit', resize: 'none' },
  button: { gridColumn: '1 / span 2', padding: '16px', borderRadius: '10px', border: 'none', background: 'linear-gradient(to right, #667eea, #764ba2)', color: 'white', fontWeight: 'bold', fontSize: '17px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(118, 75, 162, 0.3)', transition: 'all 0.3s ease' },
  buttonDisabled: { gridColumn: '1 / span 2', padding: '16px', borderRadius: '10px', border: 'none', backgroundColor: '#dfe6e9', color: '#b2bec3', cursor: 'not-allowed', fontSize: '17px', fontWeight: 'bold' },
  tableContainer: { marginTop: '25px', overflowX: 'auto', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' },
  tableHeader: { backgroundColor: '#f8f9fa', color: '#636e72' },
  th: { padding: '18px', textAlign: 'left', fontWeight: '700', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' },
  td: { padding: '18px', borderBottom: '1px solid #f1f2f6', color: '#2d3436', fontSize: '15px' },
  deleteBtn: { backgroundColor: '#ff7675', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'background 0.3s ease' }
};

export default App;
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false); // Track if CV is uploaded

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResponse('');
      setStatus('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('⚠️ Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsFileUploaded(true); // File uploaded successfully
      setStatus(res.data.status || '✅ File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      const errMsg =
        error.response?.data?.error || '❌ Error uploading file. Check backend logs.';
      setStatus(errMsg);
    }
  };

  const handleUpdate = async () => {
    if (!file) {
      setStatus('⚠️ Please select a file to update.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.put('http://127.0.0.1:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsFileUploaded(true); // File updated successfully
      setStatus(res.data.status || '✅ File updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      const errMsg =
        error.response?.data?.error || '❌ Error updating file. Check backend logs.';
      setStatus(errMsg);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      setResponse('⚠️ Please enter a question.');
      return;
    }

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/ask/', { question });
      setResponse(res.data.answer || '🤖 No answer returned.');
    } catch (error) {
      console.error('Ask error:', error);
      const errMsg =
        error.response?.data?.error || '❌ Error asking question. Check backend logs.';
      setResponse(errMsg);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete('http://127.0.0.1:8000/api/upload/');
      setStatus(res.data.message || '✅ Resume deleted and memory reset.');
      setResponse('');
      setQuestion('');
      setFile(null);
      setIsFileUploaded(false); // Reset file upload state
    } catch (error) {
      console.error('Delete error:', error);
      const errMsg =
        error.response?.data?.error || '❌ Error deleting resume.';
      setStatus(errMsg);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>📄 Upload or Update Resume for CV Chatbot</h2>
        <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!file || isFileUploaded}>
          Upload
        </button>
        <button onClick={handleUpdate} disabled={!file || !isFileUploaded}>
          Update
        </button>
        <button onClick={handleDelete} style={{ marginLeft: '10px' }}>
          Delete Resume
        </button>
        {status && (
          <div style={{ marginTop: '15px', color: '#ccc' }}>
            <strong>Status:</strong>
            <p>{status}</p>
          </div>
        )}

        <hr style={{ width: '80%', margin: '20px auto' }} />

        <h3>💬 Ask the Chatbot</h3>
        <input
          type="text"
          placeholder="Ask something about your CV..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: '60%', padding: '10px' }}
        />
        <button onClick={handleAsk} style={{ marginLeft: '10px' }}>
          Ask
        </button>

        {response && (
          <div style={{ marginTop: '20px', backgroundColor: '#222', padding: '15px', borderRadius: '5px' }}>
            <h4>🤖 Chatbot Response:</h4>
            <p>{response}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

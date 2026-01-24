import { useState } from 'react';
import axios from 'axios';
import { Upload as UploadIcon, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function UploadData() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [mapping, setMapping] = useState(null);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setPreviewData(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = await currentUser.getIdToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${API_URL}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            setPreviewData(response.data);
            setMapping(response.data.mapping);
            toast.success('File analyzed successfully!');
        } catch (error) {
            console.error("Upload failed", error);
            if (error.message === 'Network Error') {
                toast.error("Network Error: Cannot reach Backend", {
                    description: "Make sure your Backend is running and VITE_API_URL is set correctly."
                });
            } else {
                toast.error("Upload failed", {
                    description: error.response?.data?.message || error.message
                });
            }
        } finally {
            setUploading(false);
        }
    };

    const proceedToWorkflow = () => {
        if (!previewData) return;
        // Navigate to workflow config with the file ID and mapping
        navigate('/workflows', { state: { distinctId: previewData.distinctId, mapping } });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <UploadIcon className="text-blue-600" /> Upload Data
                </h2>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                    />
                    <label htmlFor="fileInput" className="cursor-pointer">
                        <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <UploadIcon />
                        </div>
                        <p className="text-gray-600 font-medium">{file ? file.name : "Click to upload Excel file (.xlsx)"}</p>
                        <p className="text-sm text-gray-400 mt-2">Auto-detection enabled</p>
                    </label>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                        {uploading ? 'Analyzing...' : 'Analyze File'}
                    </button>
                </div>
            </div>

            {previewData && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                        <span>AI Column Mapping</span>
                        {previewData.missing.length > 0 ? (
                            <span className="text-yellow-600 text-sm flex items-center gap-1"><AlertTriangle size={16} /> {previewData.missing.length} Missing Fields</span>
                        ) : (
                            <span className="text-green-600 text-sm flex items-center gap-1"><CheckCircle size={16} /> All Fields Matched</span>
                        )}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {Object.entries(mapping).map(([field, mappedCol]) => (
                            <div key={field} className="bg-gray-50 p-3 rounded border border-gray-200">
                                <span className="block text-xs text-gray-400 uppercase tracking-wider">{field}</span>
                                <span className="font-medium text-gray-800 truncate block" title={mappedCol}>{mappedCol}</span>
                            </div>
                        ))}
                    </div>

                    <h4 className="font-medium mb-3 text-sm text-gray-500">Data Preview</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    {previewData.headers.map(h => <th key={h} className="px-4 py-3">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.preview.map((row, i) => (
                                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                        {previewData.headers.map(h => <td key={h} className="px-4 py-3">{row[h]}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={proceedToWorkflow}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-lg shadow-green-200 flex items-center gap-2"
                        >
                            Proceed to Configuration <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

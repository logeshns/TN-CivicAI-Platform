import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:2020/api/complaints/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data);
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:2020/api/complaints/admin/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplaints(); // Refresh table
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const getSeverityBadge = (severity) => {
    if (severity === 'HIGH') return 'bg-red-100 text-red-800 border-red-200';
    if (severity === 'MEDIUM') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Government Command Center</h1>
            <p className="text-slate-500 mt-1">Live AI-Routed Citizen Complaints</p>
          </div>
          <button onClick={() => navigate('/')} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-300">
            Exit Admin
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">ID & Dept</th>
                <th className="px-6 py-4 font-semibold">Issue Details</th>
                <th className="px-6 py-4 font-semibold">Severity</th>
                <th className="px-6 py-4 font-semibold">Current Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No complaints found.</td></tr>
              )}
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">#{c.id}</div>
                    <div className="text-xs font-semibold text-blue-600 mt-1">{c.department}</div>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <div className="font-bold text-slate-800 mb-1">{c.title}</div>
                    <div className="text-sm text-slate-500 truncate">{c.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityBadge(c.severity)}`}>
                      {c.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold text-sm ${c.status === 'RESOLVED' ? 'text-green-600' : 'text-amber-600'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {c.status !== 'RESOLVED' ? (
                      <button 
                        onClick={() => updateStatus(c.id, 'RESOLVED')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="text-slate-400 text-sm font-medium">Completed ✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
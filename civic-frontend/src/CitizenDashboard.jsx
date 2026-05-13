import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const [complaintText, setComplaintText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myComplaints, setMyComplaints] = useState([]);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // 1. Grab the secure badge we saved during login!
  const token = localStorage.getItem('jwt_token');

  // 2. Fetch existing complaints when the dashboard loads
  useEffect(() => {
    if (!token) {
      navigate('/'); // Kick out if not logged in
      return;
    }
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      // NOTE: We will build this endpoint in Spring Boot next!
      const response = await axios.get('http://localhost:2020/api/complaints/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyComplaints(response.data);
    } catch (error) {
      console.error("Could not fetch complaints yet", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      // 3. Send the complaint to your Spring Boot AI Controller
      const response = await axios.post(
        'http://localhost:2020/api/complaints', 
        { description: complaintText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedback({ type: 'success', message: 'AI successfully analyzed and routed your complaint!' });
      setComplaintText(''); // Clear the box
      fetchMyComplaints(); // Refresh the list to show the new complaint
      
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to send to AI. Is the backend endpoint ready?' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to color-code severity
  const getSeverityColor = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">TN</div>
              <span className="text-xl font-bold text-slate-800">CivicAI Platform</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors px-3 py-2 rounded-md hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Section: Submit a Complaint */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Report an Issue</h2>
            <p className="text-blue-100 max-w-2xl text-sm">
              Describe your problem naturally. Our AI agent will automatically categorize it, assign severity, and route it to the correct department (TANGEDCO, TWAD, Police, etc.).
            </p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                rows="4"
                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-slate-700 shadow-inner"
                placeholder="Example: An electric line has fallen down near the main road in Velachery and it is sparking..."
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                required
                disabled={isSubmitting}
              ></textarea>
              
              {feedback.message && (
                <div className={`p-3 rounded-lg text-sm font-medium ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {feedback.message}
                </div>
              )}

              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-xl font-semibold text-white shadow-sm transition-all flex items-center gap-2 ${
                    isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing with AI...
                    </>
                  ) : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Bottom Section: My Complaints Tracking */}
        <section>
          <h3 className="text-xl font-bold text-slate-800 mb-4">My Reports</h3>
          
          {myComplaints.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
              <p className="text-slate-500">You haven't submitted any complaints yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myComplaints.map((complaint) => (
                <div key={complaint.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {complaint.department || 'Processing...'}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${getSeverityColor(complaint.severity)}`}>
                        {complaint.severity || 'Pending'}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-2 line-clamp-1">
                      {complaint.title || 'Analyzing Title...'}
                    </h4>
                    <p className="text-sm text-slate-500 line-clamp-3 mb-4">
                      {complaint.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-400">ID: #{complaint.id}</span>
                    <span className="text-sm font-medium text-blue-600">
                      Status: {complaint.status || 'UNASSIGNED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default CitizenDashboard;
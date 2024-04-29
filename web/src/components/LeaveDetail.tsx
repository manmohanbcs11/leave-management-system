import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get the :id parameter
import '../css/leaveDetail.css'; // Include CSS for styling

// Define the structure of a detailed leave
interface LeaveDetail {
  _id: string;
  leaveType: string;
  startDate: string; // To be formatted
  endDate: string;
  managerIds: string[];
  comments: string;
  status: string;
}

export const LeaveDetail = () => {
  const { id } = useParams<{ id: string }>(); // Get the leave ID from the URL
  const [leave, setLeave] = useState<LeaveDetail | null>(null); // State to store the leave details
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track errors

  // Fetch leave details from the API
  useEffect(() => {
    const fetchLeaveDetail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/leave/getleave/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': process.env.REACT_APP_AUTH_TOKEN || '',
          },
        });

        if (response.ok) {
          const responseJson = await response.json();
          setLeave(responseJson.data); // Set the leave detail
          setError(null); // Clear any error
        } else {
          setError('Failed to fetch leave detail');
        }
      } catch (err) {
        setError('Failed to fetch leave detail');
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    fetchLeaveDetail(); // Fetch leave detail on component mount
  }, [id]); // Ensure it runs when id changes

  if (loading) {
    return <div>Loading...</div>; // Show a loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Show an error message
  }

  if (!leave) {
    return <div>No leave details found</div>; // Handle case where no data is found
  }

  return (
    <div className="leave-detail-container"> {/* Styling class */}
      <h2>Leave Detail</h2>
      <div className="leave-info">
        <p><strong>Leave Type:</strong> {leave.leaveType}</p>
        <p><strong>Start Date:</strong> {new Date(leave.startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(leave.endDate).toLocaleDateString()}</p>
        <p><strong>Comments:</strong> {leave.comments}</p>
        <p><strong>Status:</strong> {leave.status}</p>
      </div>
    </div>
  );
};

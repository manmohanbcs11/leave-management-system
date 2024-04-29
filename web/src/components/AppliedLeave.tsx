import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import React Router Link
import '../css/appliedLeave.css'; // Include CSS for styling

// Define the structure of a leave
interface Leave {
  _id: string; // Unique identifier
  leaveType: string;
  startDate: string; // To be formatted
  endDate: string;
  managerIds: string[];
  comments: string;
  status: string;
}

export const AppliedLeave = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]); // State to store leaves
  const [loading, setLoading] = useState<boolean>(true); // State to track loading
  const [error, setError] = useState<string | null>(null); // State to track errors

  // Fetch leaves from the API
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/leave/fetchleaves`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': process.env.REACT_APP_AUTH_TOKEN || '',
          },
        });

        if (response.ok) {
          const responseJson = await response.json();
          setLeaves(responseJson.data || []); // Set leaves data
          setError(null); // Clear any previous error
        } else {
          setError('Failed to fetch leaves');
        }
      } catch (err) {
        setError('Failed to fetch leaves'); // Handle error
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    fetchLeaves(); // Fetch leaves on component mount
  }, []); // Run once on component mount

  if (loading) {
    return <div>Loading...</div>; // Show a loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Show an error message
  }

  return (
    <div className="applied-leave-container"> {/* Styling class */}
      <h2>Applied Leaves</h2>
      <table className="leave-table">
        <thead>
          <tr>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Comments</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id}>
              <td>
                <Link to={`/leave/${leave._id}`}>{leave.leaveType}</Link> {/* Create a clickable link */}
              </td>
              <td>{new Date(leave.startDate).toLocaleDateString()}</td>
              <td>{new Date(leave.endDate).toLocaleDateString()}</td>
              <td>{leave.comments}</td>
              <td>{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

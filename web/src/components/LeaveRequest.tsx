import React, { useState, useEffect } from 'react';
import '../css/leaveRequest.css'; // Include CSS for styling

// Define the structure of a manager
interface Manager {
  id: string;
  name: string;
}

export const LeaveRequest = () => {
  // Initialize state for the form fields
  const [leaveType, setLeaveType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [managerIds, setManagerIds] = useState<string[]>([]); // Array for multiple managers
  const [comments, setComments] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Initialize state to store manager options
  const [managers, setManagers] = useState<Manager[]>([]);

  // Fetch available managers from an API
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/getmanagers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': process.env.REACT_APP_AUTH_TOKEN || '',
          },
        });

        if (response.ok) {
          const responseJson = await response.json();
          setManagers(responseJson.data || []);
        } else {
          setError('Error fetching managers');
        }
      } catch (err) {
        setError('Error fetching managers');
      }
    };

    fetchManagers();
  }, []); // Run once on component mount

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requestData = {
      leaveType,
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      managerIds,
      comments,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/leave/createleave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': process.env.REACT_APP_AUTH_TOKEN || '',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setSuccess(true);
        setError(null);
        // Reset the form fields after successful submission
        setLeaveType('');
        setStartDate('');
        setEndDate('');
        setManagerIds([]);
        setComments('');
        window.alert('Leave request submitted successfully!');
      } else {
        setSuccess(false);
        setError('Failed to submit leave request');
        window.alert('Failed to submit leave request.');
      }
    } catch (err) {
      setSuccess(false);
      setError('Failed to submit leave request');
      window.alert('Failed to submit leave request.');
    }
  };

  return (
    <div className="leave-request-container">
      <h3>Create a new leave request</h3>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Leave request submitted successfully!</p>}
      <form onSubmit={handleSubmit} className="leave-form my-3">
        <div className="form-group">
          <label htmlFor="leaveType">Leave Type:</label>
          <select
            id="leaveType"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            required
          >
            <option value="" disabled>
              Select leave type
            </option>
            <option value="Sick">Sick</option>
            <option value="Casual">Casual</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="managerIds">Manager(s):</label>
          <select
            id="managerIds"
            multiple
            value={managerIds}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map(
                (option) => option.value
              );
              setManagerIds(selectedOptions);
            }}
          >
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="comments">Comments:</label>
          <textarea
            id="comments"
            value={comments} required
            onChange={(e) => setComments(e.target.value)}
            rows={3}
          />
        </div>

        <button className="submit-button" type="submit">
          Submit Leave Request
        </button>
      </form>
    </div>
  );
};

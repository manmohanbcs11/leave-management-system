import React, { useEffect, useState } from 'react';

// Define interfaces for the calendar data
interface CalendarItem {
  _id: string;
  date: string;
  day: string;
  leaveName: string;
}

interface Calendar {
  year: number;
  country: string;
  data: CalendarItem[];
}

// Inline styles for the table and other elements
const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse',
  width: '100%',
};

const thStyle: React.CSSProperties = {
  backgroundColor: '#f2f2f2', // Light gray for headers
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd', // Border for separation
};

const tdStyle: React.CSSProperties = {
  padding: '10px',
  textAlign: 'left', // Ensure text alignment
  borderBottom: '1px solid #ddd',
};

const hoverStyle: React.CSSProperties = {
  backgroundColor: '#f9f9f9', // Hover effect on row
};

const oddRowStyle: React.CSSProperties = {
  backgroundColor: '#f5f5f5', // Alternating row color
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex', // Flex layout
  justifyContent: 'space-between', // Ensure buttons are evenly spaced
  paddingBottom: '10px', // Add space below buttons
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px', // Padding for the button
  borderRadius: '5px', // Rounded corners
  border: '1px solid #ccc', // Border for the button
  backgroundColor: '#f2f2f2', // Background color
  cursor: 'pointer', // Change cursor on hover
};

export const LeaveCalendar = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'2023' | '2024' | null>('2024'); // Default open section
  const [calendars, setCalendars] = useState<Calendar[]>([]);

  useEffect(() => {
    const fetchData = async (year: number) => {
      try {
        const authToken = process.env.REACT_APP_AUTH_TOKEN || '';
        const url = `${process.env.REACT_APP_API_URL}/leave/fetchleavecalendar`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': authToken,
          },
          body: JSON.stringify({ year, country: 'India' }),
        });

        if (response.ok) {
          const responseJson = await response.json();
          setCalendars((prevCalendars) =>
            prevCalendars.filter((calendar) => calendar.year !== year).concat({
              year,
              country: 'India',
              data: responseJson.data,
            })
          );
        } else {
          setError(`Failed to fetch data: ${response.statusText}`);
        }
      } catch (error: any) {
        setError(error.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData(2023);
    fetchData(2024);
  }, []); // Fetching both 2023 and 2024 leave calendars

  const toggleSection = (year: '2023' | '2024') => {
    setActiveSection(activeSection === year ? null : year); // Toggle the section
  };

  const renderTable = (calendar: Calendar) => (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Serial No.</th>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Day</th>
          <th style={thStyle}>Leave Name</th>
        </tr>
      </thead>
      <tbody>
        {calendar.data.map((item, index) => (
          <tr
            key={item._id}
            style={index % 2 === 0 ? hoverStyle : oddRowStyle}
          >
            <td style={tdStyle}>{index + 1}</td>
            <td style={tdStyle}>{item.date}</td>
            <td style={tdStyle}>{item.day}</td>
            <td style={tdStyle}>{item.leaveName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <h2>India Leave Calendar</h2>
      <div style={buttonContainerStyle}>
        <button
          onClick={() => toggleSection('2024')}
          style={buttonStyle}
        >
          {activeSection === '2024' ? 'Hide 2024 Calendar' : 'Show 2024 Calendar'}
        </button>
        <button
          onClick={() => toggleSection('2023')}
          style={buttonStyle}
        >
          {activeSection === '2023' ? 'Hide 2023 Calendar' : 'Show 2023 Calendar'}
        </button>
      </div>
      {activeSection === '2024' && (
        <div>
          <h3>India Leave Calendar - 2024</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            calendars
              .filter((c) => c.year === 2024)
              .map((calendar) => renderTable(calendar))
          )}
        </div>
      )}
      {activeSection === '2023' && (
        <div>
          <h3>India Leave Calendar - 2023</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            calendars
              .filter((c) => c.year === 2023)
              .map((calendar) => renderTable(calendar))
          )}
        </div>
      )}
    </div>
  );
};

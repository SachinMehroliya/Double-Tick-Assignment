import { useState, useEffect, useRef, useCallback } from 'react';
import { generateCustomers, searchCustomers, sortCustomers } from '../utils/dataGenerator';
import './CustomerList.css';


import doublelogo from '../assets/doublelogo.png';
import filterIcon from '../assets/test_filter.svg';
import searchIcon from '../assets/test_search-3.svg';
import userIcon from '../assets/test_user-3.svg';

const ROWS_PER_PAGE = 30;
const TOTAL_CUSTOMERS = 1000000;

function CustomerList() {
  const [allCustomers] = useState(() => generateCustomers(TOTAL_CUSTOMERS));
  const [filteredCustomers, setFilteredCustomers] = useState(allCustomers);
  const [displayedCustomers, setDisplayedCustomers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ROWS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeoutRef = useRef(null);
  const tableContainerRef = useRef(null);


  useEffect(() => {
    let result = allCustomers;
    if (searchTerm) result = searchCustomers(result, searchTerm);
    if (sortKey) result = sortCustomers(result, sortKey, sortDirection);
    setFilteredCustomers(result);
    setVisibleCount(ROWS_PER_PAGE);
  }, [searchTerm, sortKey, sortDirection, allCustomers]);


  useEffect(() => {
    setDisplayedCustomers(filteredCustomers.slice(0, visibleCount));
  }, [filteredCustomers, visibleCount]);


  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setSearchTerm(value), 250);
  };


  const handleSort = (key) => {
    if (sortKey === key) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleScroll = useCallback(() => {
    if (!tableContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setVisibleCount((prev) => Math.min(prev + ROWS_PER_PAGE, filteredCustomers.length));
    }
  }, [filteredCustomers.length]);

  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


  const formatDate = (date) => {
    const d = new Date(date);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm}`;
  };

  const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').toUpperCase();

  return (
    <div className="customer-list-container">
      <header className="header">
        <div className="logo">
          <img src={doublelogo} alt="DoubleTick Logo" className="logo-img" />
        </div>
      </header>

      <div className="content">
        <div className="title-section">
          <h1 className="title">All Customers</h1>
          <span className="count-badge">{filteredCustomers.length}</span>
        </div>

        <div className="controls">
          <div className="search-box">
            <img src={searchIcon} alt="Search Icon" className="search-icon" />
            <input
              type="text"
              placeholder="Search Customers"
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="filter-wrapper">
            <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
              <img src={filterIcon} alt="Filter Icon" className="filter-icon" />
              Add Filters
            </button>
            {showFilters && (
              <div className="filter-dropdown">
                <div className="filter-item">Filter 1</div>
                <div className="filter-item">Filter 2</div>
                <div className="filter-item">Filter 3</div>
                <div className="filter-item">Filter 4</div>
              </div>
            )}
          </div>
        </div>

        <div className="table-container" ref={tableContainerRef}>
          <table className="customer-table">
            <thead>
              <tr>
                <th className="checkbox-col"><input type="checkbox" /></th>
                <th className="customer-col sortable" onClick={() => handleSort('name')}>
                  Customer {sortKey === 'name' && <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th className="score-col sortable" onClick={() => handleSort('score')}>
                  Score {sortKey === 'score' && <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th className="email-col sortable" onClick={() => handleSort('email')}>
                  Email {sortKey === 'email' && <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th className="message-col sortable" onClick={() => handleSort('lastMessageAt')}>
                  Last message sent at {sortKey === 'lastMessageAt' && <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th className="added-col sortable" onClick={() => handleSort('addedBy')}>
                  Added by {sortKey === 'addedBy' && <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                </th>
              </tr>
            </thead>

            <tbody>
              {displayedCustomers.map((customer) => (
                <tr key={customer.id} className="customer-row">
                  <td className="checkbox-col"><input type="checkbox" /></td>
                  <td className="customer-col">
                    <div className="customer-info">
                      <div className="avatar" style={{ backgroundColor: customer.avatarColor }}>
                        {getInitials(customer.name)}
                      </div>
                      <div className="customer-details">
                        <div className="customer-name">{customer.name}</div>
                        <div className="customer-phone">{customer.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="score-col">{customer.score}</td>
                  <td className="email-col">{customer.email}</td>
                  <td className="message-col">{formatDate(customer.lastMessageAt)}</td>
                  <td className="added-col">
                    <div className="added-by">
                      <img src={userIcon} alt="User Icon" className="user-icon" />
                      {customer.addedBy}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visibleCount < filteredCustomers.length && (
            <div className="loading-indicator">Loading more...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerList;

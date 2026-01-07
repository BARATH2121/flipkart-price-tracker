import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAlertLogs } from '../services/api';
import './AlertLogs.css';

const AlertLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, price-drop, price-increase, stock-change
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAlertLogs();
  }, [user]);

  const fetchAlertLogs = async () => {
    try {
      setLoading(true);
      const response = await getAlertLogs();
      setLogs(response.data || []);
    } catch (err) {
      console.error('Failed to fetch alert logs:', err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];

    if (filter !== 'all') {
      filtered = filtered.filter(log => log.type === filter);
    }

    if (sortBy === 'oldest') {
      filtered.reverse();
    }

    return filtered;
  };

  const filteredLogs = filterLogs();
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const getAlertBadge = (type) => {
    const badges = {
      'price-drop': { label: 'Price Drop', color: 'green' },
      'price-increase': { label: 'Price Increase', color: 'red' },
      'stock-change': { label: 'Stock Update', color: 'blue' },
      'back-in-stock': { label: 'Back in Stock', color: 'purple' },
    };
    return badges[type] || { label: 'Alert', color: 'gray' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="alert-logs">
        <p>Please log in to view alert logs.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="alert-logs">
        <div className="loading-spinner">Loading alert history...</div>
      </div>
    );
  }

  return (
    <div className="alert-logs">
      <h2>Alert History</h2>

      <div className="controls">
        <div className="filter-group">
          <label htmlFor="filter">Filter by Type:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="all">All Alerts</option>
            <option value="price-drop">Price Drops</option>
            <option value="price-increase">Price Increases</option>
            <option value="stock-change">Stock Changes</option>
            <option value="back-in-stock">Back in Stock</option>
          </select>
        </div>

        <div className="sort-group">
          <label htmlFor="sort">Sort:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {paginatedLogs.length === 0 ? (
        <div className="no-alerts">
          <p>No alerts found. Start tracking products to receive alerts!</p>
        </div>
      ) : (
        <>
          <div className="logs-container">
            {paginatedLogs.map((log) => {
              const badge = getAlertBadge(log.type);
              return (
                <div key={log.id} className="alert-log-item">
                  <div className="alert-left">
                    <div className={`alert-badge ${badge.color}`}>
                      {badge.label}
                    </div>
                    <div className="alert-details">
                      <h4>{log.productName}</h4>
                      <p className="alert-message">{log.message}</p>
                      <p className="alert-time">{formatDate(log.timestamp)}</p>
                    </div>
                  </div>
                  <div className="alert-right">
                    {log.oldPrice && log.newPrice && (
                      <div className="price-change">
                        <span className="old-price">₹{log.oldPrice}</span>
                        <span className="arrow">→</span>
                        <span className={`new-price ${log.oldPrice > log.newPrice ? 'decrease' : 'increase'}`}>
                          ₹{log.newPrice}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlertLogs;

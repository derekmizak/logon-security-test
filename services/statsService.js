// Statistics Service
// Educational: This service provides data for the admin dashboard charts
// Uses Sequelize queries with aggregations for analytics

const { CredentialCapture, GeneralLog, sequelize } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

/**
 * Get login attempts timeline for chart
 * Returns attempts grouped by date for the last N days
 */
async function getTimelineData(days = 7) {
  try {
    // Sequelize query with date aggregation
    // Educational: This demonstrates GROUP BY with date functions
    const result = await CredentialCapture.findAll({
      attributes: [
        [fn('DATE', col('timestamp')), 'date'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        timestamp: {
          [Op.gte]: literal(`NOW() - INTERVAL '${days} days'`)
        }
      },
      group: [fn('DATE', col('timestamp'))],
      order: [[fn('DATE', col('timestamp')), 'ASC']],
      raw: true  // Return plain objects instead of Sequelize instances
    });

    // Transform for ECharts format
    return {
      dates: result.map(r => r.date),
      counts: result.map(r => parseInt(r.count))
    };

    // Educational: Raw SQL equivalent (for comparison):
    // SELECT DATE(timestamp) as date, COUNT(*) as count
    // FROM credential_capture
    // WHERE timestamp >= NOW() - INTERVAL '7 days'
    // GROUP BY DATE(timestamp)
    // ORDER BY date ASC;
  } catch (error) {
    console.error('Error getting timeline data:', error);
    return { dates: [], counts: [] };
  }
}

/**
 * Get top attacking IP addresses
 * Returns top N IPs by attempt count
 */
async function getTopIPs(limit = 10) {
  try {
    const result = await CredentialCapture.findAll({
      attributes: [
        'ipAddress',
        [fn('COUNT', col('id')), 'attempts']
      ],
      group: ['ipAddress'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: limit,
      raw: true
    });

    return {
      ips: result.map(r => r.ipAddress),
      counts: result.map(r => parseInt(r.attempts))
    };

    // Raw SQL equivalent:
    // SELECT ip_address, COUNT(*) as attempts
    // FROM credential_capture
    // GROUP BY ip_address
    // ORDER BY attempts DESC
    // LIMIT 10;
  } catch (error) {
    console.error('Error getting top IPs:', error);
    return { ips: [], counts: [] };
  }
}

/**
 * Get most common attempted usernames
 * Returns top N usernames by frequency
 */
async function getTopUsernames(limit = 20) {
  try {
    const result = await CredentialCapture.findAll({
      attributes: [
        'usernameAttempted',
        [fn('COUNT', col('id')), 'frequency']
      ],
      where: {
        usernameAttempted: {
          [Op.ne]: null  // Not null
        }
      },
      group: ['usernameAttempted'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: limit,
      raw: true
    });

    return {
      usernames: result.map(r => r.usernameAttempted),
      counts: result.map(r => parseInt(r.frequency))
    };
  } catch (error) {
    console.error('Error getting top usernames:', error);
    return { usernames: [], counts: [] };
  }
}

/**
 * Get overview statistics for dashboard cards
 * Returns total requests, attempts, unique IPs, etc.
 */
async function getOverviewStats() {
  try {
    // Run multiple queries in parallel using Promise.all
    // Educational: This is more efficient than sequential queries
    const [
      totalRequests,
      totalAttempts,
      uniqueIPs,
      dateRange
    ] = await Promise.all([
      GeneralLog.count(),
      CredentialCapture.count(),
      CredentialCapture.findAll({
        attributes: [[fn('COUNT', fn('DISTINCT', col('ipAddress'))), 'count']],
        raw: true
      }),
      CredentialCapture.findAll({
        attributes: [
          [fn('MIN', col('timestamp')), 'firstAttempt'],
          [fn('MAX', col('timestamp')), 'lastAttempt']
        ],
        raw: true
      })
    ]);

    return {
      totalRequests,
      totalAttempts,
      uniqueIPs: uniqueIPs[0]?.count || 0,
      firstAttempt: dateRange[0]?.firstAttempt,
      lastAttempt: dateRange[0]?.lastAttempt
    };
  } catch (error) {
    console.error('Error getting overview stats:', error);
    return {
      totalRequests: 0,
      totalAttempts: 0,
      uniqueIPs: 0,
      firstAttempt: null,
      lastAttempt: null
    };
  }
}

/**
 * Get request distribution (login vs other paths)
 * For pie chart visualization
 */
async function getRequestDistribution() {
  try {
    const result = await GeneralLog.findAll({
      attributes: [
        'requestPath',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['requestPath'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: 10,
      raw: true
    });

    return {
      paths: result.map(r => r.requestPath || 'Unknown'),
      counts: result.map(r => parseInt(r.count))
    };
  } catch (error) {
    console.error('Error getting request distribution:', error);
    return { paths: [], counts: [] };
  }
}

/**
 * Get recent login attempts for data table
 * Supports pagination
 */
async function getRecentAttempts(limit = 25, offset = 0) {
  try {
    const { count, rows } = await CredentialCapture.findAndCountAll({
      order: [['timestamp', 'DESC']],
      limit: limit,
      offset: offset
    });

    return {
      total: count,
      attempts: rows.map(row => ({
        id: row.id,
        timestamp: row.timestamp,
        ipAddress: row.ipAddress,
        username: row.usernameAttempted,
        passwordLength: row.passwordLength,
        userAgent: row.userAgent
      }))
    };
  } catch (error) {
    console.error('Error getting recent attempts:', error);
    return { total: 0, attempts: [] };
  }
}

// Educational: All of these functions demonstrate:
// - Sequelize aggregation functions (COUNT, DATE, etc.)
// - GROUP BY queries for analytics
// - Using Op (operators) for WHERE conditions
// - Transforming database results for chart consumption
// - Error handling in service layer
// - Raw SQL equivalents in comments for learning

module.exports = {
  getTimelineData,
  getTopIPs,
  getTopUsernames,
  getOverviewStats,
  getRequestDistribution,
  getRecentAttempts
};

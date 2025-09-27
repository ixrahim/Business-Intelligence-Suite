/**
 * Validate company data submission
 */
function validateCompanyData(req, res, next) {
  const { revenue, employees, industry } = req.body;
  const errors = [];
  
  // Validate revenue
  if (!revenue || typeof revenue !== 'number' || revenue <= 0) {
    errors.push('Revenue must be a positive number');
  }
  
  // Validate employees
  if (!employees || typeof employees !== 'number' || employees <= 0) {
    errors.push('Employee count must be a positive number');
  }
  
  // Validate industry
  const validIndustries = ['saas', 'fintech', 'ecommerce', 'healthcare'];
  if (!industry || !validIndustries.includes(industry)) {
    errors.push('Invalid industry selection');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      }
    });
  }
  
  next();
}

module.exports = {
  validateCompanyData
};
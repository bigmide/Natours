class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    // Filtering
    const queryObject = { ...this.queryString };
    const excludedQueries = ['sort', 'limit', 'fields', 'page'];
    excludedQueries.forEach((el) => delete queryObject[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replaceAll(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const field = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(field);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const { page } = this.queryString || 1;
    const { limit } = this.queryString || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;

// query = Resource.find() && queryString = req.query

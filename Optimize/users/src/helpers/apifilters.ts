import AppConstants from "../utils/constant";

const appConstant = new AppConstants();
export default class ApiFilters {
    query: any;
    queryStr: any;

    constructor(query: any, queryStr: any) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        if (this.queryStr.search) {
            delete this.queryStr.limit;
            delete this.queryStr.page;
        }
        if (this.queryStr.orderby && this.queryStr.orderby == appConstant.ORDER_BY.DESCENDING) {
            delete this.queryStr.orderby;
            this.queryStr.sort = `-${this.queryStr.sort}`
        } if (this.queryStr.orderby && this.queryStr.orderby == appConstant.ORDER_BY.ASCENDING) {
            delete this.queryStr.orderby;
            this.queryStr.sort = `${this.queryStr.sort}`
        }
        const queryCopy = { ...this.queryStr };
        const removeFields = ['sort', 'fields', 'search', 'limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el]);
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.collation({ locale: 'en' }).sort(sortBy);
            // this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-created');
        }
        return this;
    }

    searchByQuery() {
        const { search } = this.queryStr;
        if (search) {
            const searchTerm = search.split('-').join(' ');
            const searchRegex = new RegExp(searchTerm, 'i');
            this.query = this.query.or([
                { last_name: searchRegex },
                { first_name: searchRegex },
                { email: searchRegex },
                { status: searchRegex }
            ]);
        }
        return this;
    }
    pagination() {
        const page = parseInt(this.queryStr.page, 10);
        const limit = parseInt(this.queryStr.limit, 10);
        const skipResults = (page - 1) * limit;
        this.query = this.query.skip(skipResults).limit(limit);
        return this;
    }
}

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
        delete this.queryStr.project_id;
        delete this.queryStr.cloud_name;
        delete this.queryStr.orderBy;
        if (this.queryStr.search) {
            delete this.queryStr.limit;
            delete this.queryStr.page;
        }
        if (this.queryStr.sort) {
            delete this.queryStr.limit;
            delete this.queryStr.page;
        }   
        const queryCopy = { ...this.queryStr };
        const removeFields = ['sort', 'fields', 'search', 'limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el]);
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(queryStr));
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

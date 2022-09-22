class APIFeatures{
    constructor(query,queryString)
    {
        this.query=query;
        this.queryString=queryString;
    }
    filter(){
        const queryObj = {...this.queryString};
        const excludedFields = ['limit','sort','page','fields']
        excludedFields.forEach(el=> delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=> `$${match}`);
        // console.log(JSON.parse(queryStr));
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sorting()
    {
        if(this.queryString.sort)
        {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query=this.query.sort(sortBy);
        }
        else{
            this.query=this.query.sort('-createdAt')
        }
        return this;
    }
    fields(){
        if(this.queryString.fields)
        {
            this.query=this.query.select(this.queryString.fields.split(',').join(' '));
        }
        else{
            this.query=this.query.select('-__v');
        }
        return this;
    }
    paginate()
    {
        const page = this.queryString.page*1 || 1;
        const limit = this.queryString.limit*1 || 100;
        const skip = (page-1)*limit;
        // console.log(page,skip);
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
module.exports = APIFeatures;
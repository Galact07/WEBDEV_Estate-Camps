const mongoose= require('mongoose')
const Review=require('./review')
const {Schema} = mongoose
const opt2= {toJSON:{virtuals:true}}
const ImageSchema= new Schema({
        url:String,
        filename:String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const CampgroundSchema= new Schema({
    title:String,
    price:Number,
    image:[ImageSchema],
    description:String,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }] 
},opt2)
CampgroundSchema.virtual('properties.popUpMarker').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
             <p>${this.description.substring(1,20)}...</p>`

})

CampgroundSchema.post('findOneAndDelete',async function(data){
    if(data){
        await Review.deleteMany(
            {_id: {$in: data.reviews}}
        )
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema)
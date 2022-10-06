const Review= require('../models/review')
const Campground= require('../models/campground')


module.exports.createReview= async(req,res)=>{
    const {id}= req.params
    const camp= await Campground.findById(id)
   const {rating,body}= req.body
    const review1= new Review({rating:rating, body: body})
        review1.author=req.user._id
       camp.reviews.push(review1)

        await review1.save()
        await camp.save()
       req.flash('success','Successfully posted Review')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteReview= async(req,res,next)=>{
    const {id,reviewId}= req.params
   
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully deleted review')
    res.redirect(`/campgrounds/${id}`)

}
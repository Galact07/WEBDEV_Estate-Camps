const Campground=require('../models/campground.js')
const {cloudinary}= require('../cloudinary/index')
const mapGeocoding= require('@mapbox/mapbox-sdk/services/geocoding')
const mapToken= process.env.MAPBOX_TOKEN
const geocoder=mapGeocoding({accessToken: mapToken})

module.exports.index= async(req,res,next)=>{
    const campgrounds= await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm=(req,res)=>{  
    res.render('campgrounds/new')
}

module.exports.createCampground=async(req,res,next)=>{
    const geo=await geocoder.forwardGeocode({
        query:req.body.location,
        limit:1
    }).send()
    const{title,location,price,description}= req.body
    const newCamp= new Campground({title:title,location:location,price:price,description:description})
    newCamp.geometry= geo.body.features[0].geometry
    newCamp.image= req.files.map(f=> ({url:f.path,filename:f.filename}))
    newCamp.author= req.user._id
    await newCamp.save()
    console.log(newCamp)
    req.flash('success','Successfully made new campground')   
    res.redirect(`/campgrounds/${newCamp._id}`)
}

module.exports.showCampground=async (req,res,next)=>{
    const {id}= req.params
    const campground= await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author')
    if(!campground){
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
        // return next(new ExpressError('Campground not found',403))
    }
    res.render('campgrounds/show',{campground})
}

module.exports.renderEditForm= async (req,res,next)=>{
    const {id}= req.params
    const campground= await Campground.findById(id) 
    if(!campground){
         req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
        // return next(new ExpressError('Campground not found',403))
    }
    res.render('campgrounds/edit',{campground})
}

module.exports.updateCampground=async (req,res,next) => {
    const {id}= req.params
    const {...newCampground}= req.body
    const images= req.files.map(f=>({url:f.path,filename:f.filename}))
    const camp=await Campground.findByIdAndUpdate(id,newCampground,{new:true, runValidators:true})
    camp.image.push(...images)
    await camp.save()
    if(req.body.deleteImages){
        for(let img of req.body.deleteImages){
            await cloudinary.uploader.destroy(img)
        }
       await camp.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success','Successfully updated campground')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground=async (req,res)=>{
    const {id}= req.params
    await Campground.findByIdAndDelete(id,{new:true,runValidators:true})
    req.flash('success','Successfully deleted campground')
    res.redirect('/campgrounds')
}
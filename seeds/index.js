const mongoose= require('mongoose')
const {descriptors,places}= require('./seedHelpers')
const cities =require('./cities')
const Campground= require('../models/campground')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://0.0.0.0:27017/yelp-camp')
  console.log('mongodb connection established');
}
const randSample= array => array[Math.floor(Math.random()* array.length )]
const seedDB= async()=>{
    await Campground.deleteMany({})
    for(let i=0;i<300;i++){
        await new Campground({
            author:'632187fe3cd6ef583d864624',
            title:  `${randSample(descriptors)} ${randSample(places)}`,
            location: `${randSample(cities).city}, ${randSample(cities).state}` ,
            geometry:{type:'Point', coordinates:[randSample(cities).longitude,randSample(cities).latitude]},
            image:[
    {
      url: 'https://res.cloudinary.com/dhhrw8dv4/image/upload/v1663827560/YelpCamp/nhmz4wgtixx2dvwmreyo.jpg',
      filename: 'YelpCamp/nhmz4wgtixx2dvwmreyo',
    },
    {
      url: 'https://res.cloudinary.com/dhhrw8dv4/image/upload/v1663827562/YelpCamp/ozwaoty0c0dx8wesyi9m.jpg',
      filename: 'YelpCamp/ozwaoty0c0dx8wesyi9m',
    }
  ],
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, error! Nam debitis officiis accusantium error, hic architecto aspernatur. Eius, nisi vel? Consequuntur cum aspernatur eos delectus voluptates ea hic molestiae?',
            price:Math.floor(Math.random()*20)+10
        }).save()
    }
}


seedDB().then(()=>{
    mongoose.connection.close() 
})
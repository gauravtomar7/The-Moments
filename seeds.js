var mongoose   =require("mongoose");
var Campgrounds = require("./models/campgrounds");
var Comment    =require("./models/comment");
 

var data=[
    {
        name:"Badd taste",
        image:"https://images.unsplash.com/photo-1542014740373-51ad6425eb7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFkJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        description:"rtyu fghjk rtyui cvbnmg dfbvbje jneinve rjhev e nvnerivejvednvnsd vbeuvnehjv f vjienfvjbeiuv envbenvjenvnd v jenvenvkled mv  dfhjvjejfnvmehbnvm efvujejbv ejl vm dbvuenvm e vkjhediv en vfbvioefnvmnebfvme viujdfnmv dnmvbaefifmvenmfbvioemvndbvjndm vdfsmbvbuejvnmbuivjmn vm  fhvhdfkvbiuefnvm mfsdnvbdfjnvnbefbvm sdvhkmdnv jednv efvhjhdmv vsmnv s dfbvuenvm e fvkjndfnvhdfs;gm erjnghpflv mnfbgosdfmgn eriu"
    },

    {
        name:"Badd drink",
        image:"https://media.istockphoto.com/id/468735068/photo/alcohol-bottles-with-the-silhouette-of-an-alcoholic-man.webp?b=1&s=170667a&w=0&k=20&c=5J4lUEXH4LBDsSAPYp60ghxG-QkHYCdvZ5ILH63Uxk8=",
        description:"dont tyu fghjk rtyui cvbnmg dfbvbje jneinve rjhev e nvnerivejvednvnsd vbeuvnehjv f vjienfvjbeiuv envbenvjenvnd v jenvenvkled mv  dfhjvjejfnvmehbnvm efvujejbv ejl vm dbvuenvm e vkjhediv en vfbvioefnvmnebfvme viujdfnmv dnmvbaefifmvenmfbvioemvndbvjndm vdfsmbvbuejvnmbuivjmn vm  fhvhdfkvbiuefnvm mfsdnvbdfjnvnbefbvm sdvhkmdnv jednv efvhjhdmv vsmnv s dfbvuenvm e fvkjndfnvhdfs;gm erjnghpflv mnfbgosdfmgn eriu"
    },

    {
        name:"healthy",
        image:"https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhbHRoeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        description:"tyu fghjk rtyui cvbnmg dfbvbje jneinve rjhev e nvnerivejvednvnsd vbeuvnehjv f vjienfvjbeiuv envbenvjenvnd v jenvenvkled mv  dfhjvjejfnvmehbnvm efvujejbv ejl vm dbvuenvm e vkjhediv en vfbvioefnvmnebfvme viujdfnmv dnmvbaefifmvenmfbvioemvndbvjndm vdfsmbvbuejvnmbuivjmn vm  fhvhdfkvbiuefnvm mfsdnvbdfjnvnbefbvm sdvhkmdnv jednv efvhjhdmv vsmnv s dfbvuenvm e fvkjndfnvhdfs;gm erjnghpflv mnfbgosdfmgn eriu"
    }


]

function seedDB(){
    Campgrounds.deleteMany({})
                // .then(function({}) {
                //     console.log("Removed campgrounds");
            //         data.forEach(function(seed)
            //         {
            //         Campgrounds.create(seed)
            //         .then(function(campgrounds){
            //            console.log("added");
            //            Comment.create({text:"fghjklcvbnm", author:"homer"})
            //            .then(function(comment){
            //                 campgrounds.comments.push(comment);
            //                 campgrounds.save();
            //                 console.log("created new comment");
            //            })
            //            .catch(function(err){
            //                 console.log(err);
            //            });
            //        })
            //        .catch(function(err){
            //             console.log(err);
            //         });
            //   });
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //     });
   
   
}

module.exports=seedDB;

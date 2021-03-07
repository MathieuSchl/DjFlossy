
module.exports.run = async (ms)=>{
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports.help = {
    name: "wait"
};
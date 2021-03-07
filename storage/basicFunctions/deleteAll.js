

module.exports.run = async (bot,channel)=>{
    channel.bulkDelete(100).catch(()=>{});
    channel.messages.fetch().then(messages => {
        messages.array().forEach(msg => {
            setTimeout(function(){
                if(!msg.deleted) msg.delete().catch(()=>{});
            }, 100);
        });
    })
};


module.exports.help = {
    name: "deleteAll"
};
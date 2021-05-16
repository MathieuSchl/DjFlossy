module.exports.run = () => {
    const actualDate = new Date();
    return actualDate.getFullYear() + "-" + ("0" + (actualDate.getMonth() + 1)).slice(-2) + "-" + ("0" + actualDate.getDate()).slice(-2);
};

module.exports.help = {
    name: "getDateSqlFormat"
};
const connection = require("../db/dbmysql2");

exports.listMemeber = (payload) => {
    console.log("Member payload", payload);
    try {
        connection.query(
            "call member(?)", [payload],
            (error, results) => {
                if (error) {
                    console.log(error);
                    return false;
                }
                // console.log(results)
                return { body: "hello" }
            }
        );
    } catch (error) {
        console.log(error)
        return false

    }

};
const performQuery = (data) => {
    console.log(performQuery)

    // Perform your query operation here and return the result
    const result = {
        message: 'Query result',
        data: [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' }
        ]
    };

    return result;
};
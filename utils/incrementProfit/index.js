
const connection = require("../../db/dbmysql2");

const addProfit = async (data) => {
    let currentProfit = data.asset;
    // console.log(currentProfit, "data")
    return "dfsdfsdf"
}
function getAllCustomer() {
    try {
        let sqlget = "SELECT * FROM customer"
        connection.query(
            sqlget,
            (error, Aresults) => {
                if (error) {
                    console.log(error);
                    return false
                }
                return JSON.stringify(Aresults);
                // Aresults.map((value, index) => {
                //     // addProfit(value).then((error, result) => {
                //     //     console.log(result, "dadadadadadad")
                //     // })
                //     let dataReturn = getJsonData(value)
                //     console.log(dataReturn, "dataReturn")
                // })
            }
        );
    } catch (error) {
        console.log(error);
    }
}
exports.incrementParent = async () => {
    console.log("ggggg");
    // let allCustomer = await getAllCustomer();
    // console.log(getAllCustomer, "getAllCustomer");

    const jsonObject = await createJsonObject();
    console.log(jsonObject.invitaion_code); // Output: { name: 'John', age: 30, city: 'New York' }
    console.log("eeeeeeeeeeeeeee");

    //  getAllCustomer().then((result) => {

    //     console.log(result, "result")
    // })
};


function createJsonObject() {
    return new Promise((resolve, reject) => {
        try {
            let sqlget = "SELECT * FROM customer";
            connection.query(sqlget, (error, Aresults) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log(Aresults[0]);
                    resolve(Aresults[0]);
                }
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

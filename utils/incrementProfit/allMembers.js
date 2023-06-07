
const connection = require("../../db/dbmysql2");
const { perdayProfit } = require("./incrementPerDay");

exports.ApplyOnAll = async () => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(
                "Select * from customer",
                (error, AllCustomer) => {
                    if (error) {
                        console.log(error);
                        // return res.status(500).send({ apiName: "fetching failed customer ", status: false, error: error });
                    }
                    console.log(AllCustomer, "AllCustomer")
                    AllCustomer.map((value, index) => {
                        // console.log(value.customer_name);
                        perdayProfit(value.customer_id)
                            .then((customerData) => {
                                console.log(customerData, "customerData profit " + value.customer_name);
                                // Handle the returned data here
                                let updateProfitNew = parseFloat(customerData) + parseFloat(value.profit)
                                try {
                                    connection.query(
                                        "call updateCustomerProfit(?,?)", [value.customer_id, updateProfitNew],
                                        (error, resultc) => {
                                            if (error) {
                                                console.log(error);
                                            }
                                            console.log(value.customer_name + "profit updated")
                                        }
                                    );
                                } catch (error) {
                                    console.log(error);
                                }
                            })
                            .catch((error) => {
                                console.error(error); // Handle any errors that occurred
                            });
                    })
                    resolve(AllCustomer)
                }
            );
        } catch (error) {
            console.log(error);
            reject(error)
            // res.status(500).send({ apiName: "get customer", status: false, Message: "Invalid User Name and Password", error: error });
        }
    })
}


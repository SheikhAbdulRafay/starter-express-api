const connection = require("../../db/dbmysql2");

exports.perdayProfit = async (props) => {
    return new Promise((resolve, reject) => {
        console.log("---------------------------cahin  3 Log------------------------------")
        // let sql = "call member(?)"
        let totalProfitPerDay = 0;
        let sql = "call member(?)"
        let returndata;
        let Customerdata;
        try {
            connection.query(
                "call getCustomer(?)", [props],
                (error, resultc) => {
                    if (error) {
                        console.log(error);
                        // return res.status(500).send({ apiName: "fetching failed customer ", status: false, error: error });
                    }
                    console.log(resultc, "customerResult[0]")
                    Customerdata = resultc[0][0];
                }
            );
        } catch (error) {
            console.log(error);
            // res.status(500).send({ apiName: "get customer", status: false, Message: "Invalid User Name and Password", error: error });
        }
        try {
            ///////////////////////////////////////////first level ///////////////////////////////////////
            connection.query(
                sql, [props],
                (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send({ apiName: "fetching failed ", status: false, error: error });
                    }
                    console.log("data in level one", results)
                    results[0][0] == null ? console.log("testing ") : null
                    let newObject = { "level1": results[0] }
                    let combined = { ...returndata, ...newObject };
                    returndata = combined;

                    results[0].map((value, index) => {
                        totalProfitPerDay = parseFloat(totalProfitPerDay) + parseFloat(value.asset)
                        console.log(value.customer_name + "----level 1----" + totalProfitPerDay + "-totalProfitPerDay-" + value.asset, "-assit---");
                        // console.log(value.asset, "assit");
                        ///////////////////////////////////////////second level ///////////////////////////////////////
                        try {
                            connection.query(
                                sql, [value.customer_id],
                                (error, results2) => {
                                    if (error) {
                                        console.log(error);
                                        return res.status(500).send({ apiName: "fetching failed ", status: false, error: error });
                                    }
                                    console.log("data in level two")

                                    let newObject = { "level2": results2[0] }
                                    let combined = { ...returndata, ...newObject };
                                    returndata = combined;
                                    results2[0].map((value, index) => {
                                        totalProfitPerDay = parseFloat(totalProfitPerDay) + parseFloat(value.asset)
                                        console.log(value.customer_name + "----level 2----" + totalProfitPerDay + "-totalProfitPerDay-" + value.asset, "-assit---");
                                        ///////////////////////////////////////////third level ///////////////////////////////////////
                                        try {
                                            connection.query(
                                                sql, [value.customer_id],
                                                (error, results3) => {
                                                    if (error) {
                                                        console.log(error);
                                                        return res.status(500).send({ apiName: "fetching failed ", status: false, error: error });
                                                    }
                                                    console.log("data in level three")
                                                    console.log("data in level three else part ")

                                                    let newObject = { "level3": results2[0] }
                                                    let combined = { ...returndata, ...newObject };
                                                    returndata = combined;
                                                    results3[0].map((value, index) => {
                                                        totalProfitPerDay = parseFloat(totalProfitPerDay) + parseFloat(value.asset)
                                                        console.log(value.customer_name + "----level 3----" + totalProfitPerDay + "-totalProfitPerDay-" + value.asset, "-assit---");
                                                        try {
                                                            connection.query(
                                                                sql, [value.customer_id],
                                                                (error, results4) => {
                                                                    if (error) {
                                                                        console.log(error);
                                                                        return res.status(500).send({ apiName: "fetching failed ", status: false, error: error });
                                                                    }
                                                                    console.log("data in level three")
                                                                    console.log("data in level three else part ")

                                                                    let newObject = { "level4": results4[0] }
                                                                    let combined = { ...returndata, ...newObject };
                                                                    returndata = combined;
                                                                    results3[0].map((value, index) => {
                                                                        totalProfitPerDay = parseFloat(totalProfitPerDay) + parseFloat(value.asset)
                                                                        console.log(value.customer_name + "----level 4----" + totalProfitPerDay + "-totalProfitPerDay-" + value.asset, "-assit---");
                                                                        return 1;
                                                                    })

                                                                }



                                                            );
                                                        } catch (error) {
                                                            res.status(500).send({ apiName: "get customer", status: false, Message: "Invalid User Name and Password", error: error });
                                                        }
                                                    })

                                                }



                                            );
                                        } catch (error) {
                                            res.status(500).send({ apiName: "get customer", status: false, Message: "Invalid User Name and Password", error: error });
                                        }
                                    })
                                }

                            );
                        } catch (error) {
                            res.status(500).send({ apiName: "get customer", status: false, Message: "Invalid User Name and Password", error: error });

                        }
                    })
                }
            );

        } catch (error) {
            res.status(500).send({ apiName: "get customer", status: false, Message: "Invalid User Name and Password", error: error });

        }

        setTimeout(() => {
            let percentage = (5 / 100) * (totalProfitPerDay * '0.013')
            let percentageSelf = (5 / 100) * (Customerdata.asset * '0.013')
            console.log("Data=" + percentage);
            let profit = percentage + percentageSelf

            resolve(profit);
            // return percentage;
        }, 1000)
    });
}
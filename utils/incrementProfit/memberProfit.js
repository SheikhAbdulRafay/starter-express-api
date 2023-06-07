
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
exports.CalculateProfitAndMember = async (custoemrId) => {
    let sql = "call member(?)"
    return new Promise((resolve, reject) => {
        try {
            console.log("ggggg");
            getMember(custoemrId)
            // const jsonObject =  getMember(custoemrId); //functional
            const jsonObject = getMember(custoemrId)//functional
            resolve(jsonObject, "jsonObject")
        } catch (error) {
            reject(error);
        }

    });
    // console.log("ggggg");
    // const jsonObject = await getMember(custoemrId);
    // console.log(jsonObject.invitaion_code); // Output: { name: 'John', age: 30, city: 'New York' }
    // console.log("eeeeeeeeeeeeeee");

};
async function processArray(id) {
    const level1 = await getMemberTest(id);
    console.log(level1, "level1");
    const level2 = await Promise.all(level1.map(async (element, index) => {
        const result = await getMemberTest(element.customer_id);
        return result;
    }));
    console.log(level2, "level2");
    const level3 = await Promise.all(level2[0].map(async (element, index) => {
        const result = await getMemberTest(element.customer_id);
        return result;
    }));
    console.log(level3, "level3");
}

function getMemberTest(props) {
    console.log("props reched in memberfinder" + props)
    let sql = "call member(?)"
    return new Promise((resolve, reject) => {
        try {
            connection.query(
                sql, [props],
                (error, resultslevel1) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        resolve(resultslevel1[0])
                    }
                }
            );
        } catch (error) {
            console.log(error, "level  Error 1")
            reject(error);
        }
    });
}
function getMember(props) {
    let sql = "call member(?)"
    let totalProfit = 0;
    let returndata;
    let DataObject = new Promise((resolve, reject) => {
        // await(async () => {
        try {
            connection.query(
                sql, [props],
                (error, resultslevel1) => {
                    if (error) {
                        console.log(error);
                        // reject(error);
                    } else {
                        let newObject = { "level1": resultslevel1[0] }
                        let combined = { ...returndata, ...newObject };
                        returndata = combined;
                        resultslevel1[0]?.map((value, index) => {
                            console.log(value.customer_id, "level One Customer")
                            totalProfit = parseFloat(totalProfit) + parseFloat(value.asset)
                            // totalProfit += value.profit
                            try {
                                connection.query(
                                    sql, [value.customer_id],
                                    (error, resultslevel2) => {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            let newObject = { "level2": resultslevel2[0] }
                                            let combined = { ...returndata, ...newObject };
                                            returndata = combined;
                                            resultslevel2[0]?.map((value, index) => {
                                                console.log(value.customer_id, "level two Customer")
                                                totalProfit = parseFloat(totalProfit) + parseFloat(value.asset)

                                                // totalProfit += value.profit;
                                                try {
                                                    connection.query(
                                                        sql, [value.customer_id],
                                                        (error, resultslevel3) => {
                                                            if (error) {
                                                                console.log(error);
                                                            } else {
                                                                let newObject = { "level3": resultslevel2[0] }
                                                                let combined = { ...returndata, ...newObject };
                                                                returndata = combined;
                                                                resultslevel3[0]?.map((value, index) => {
                                                                    console.log(value.customer_id, "level three Customer")
                                                                    totalProfit = parseFloat(totalProfit) + parseFloat(value.asset)

                                                                    try {
                                                                        connection.query(
                                                                            sql, [value.customer_id],
                                                                            (error, resultslevel4) => {
                                                                                if (error) {
                                                                                    console.log(error);
                                                                                } else {
                                                                                    let newObject = { "level4": resultslevel4[0] }
                                                                                    let combined = { ...returndata, ...newObject };
                                                                                    returndata = combined;
                                                                                    console.log(returndata, "returndata level2")
                                                                                    resultslevel4[0]?.map((value, index) => {
                                                                                        console.log(value.customer_id, "level four Customer")
                                                                                        totalProfit = parseFloat(totalProfit) + parseFloat(value.asset)

                                                                                        // totalProfit += value.profit
                                                                                    })
                                                                                    let percentage = (5 / 100) * (totalProfit * '0.003')
                                                                                    console.log("DataResolve=" + percentage)
                                                                                    resolve(percentage)
                                                                                    // .then(() => {
                                                                                    // profitRate: parseFloat(profitConfig.rate) * totalProfitPerDay,
                                                                                    // totalAsset: totalProfitPerDay,
                                                                                    // message: "fetched successfully",
                                                                                    // parentId: req.query.customerId,
                                                                                    // dataMember: returndata
                                                                                    // let percentage = (5 / 100) * (totalProfit * '0.003')
                                                                                    // console.log("Data=" + percentage)
                                                                                    // })
                                                                                }
                                                                                // resolve(resultslevel2);
                                                                            }
                                                                        );
                                                                    } catch (error) {
                                                                        console.log(error, "level  Error 4")
                                                                    }
                                                                })
                                                            }
                                                            // resolve(resultslevel2);
                                                        }
                                                    );
                                                } catch (error) {
                                                    console.log(error, "level  Error 3")
                                                }
                                            })
                                        }
                                        // resolve(resultslevel2);
                                    }
                                );
                            } catch (error) {
                                console.log(error, "level  Error 2")
                            }
                        })

                    }

                }
            )
            // .then(() => {
            //     console.log(totalProfit, "totalProfit")
            //     return totalProfit;
            // }).catch((error) => {
            //     return error;
            // })

            setTimeout(() => {
                let percentage = (5 / 100) * (totalProfit * '0.003')
                console.log("Data=" + percentage);
                console.log("databulk =" + returndata)
                // return percentage;
            }, 3000)
        } catch (error) {
            console.log(error, "level  Error 1")
            // reject(error);
        }

        // }) ();
    }
    );


}

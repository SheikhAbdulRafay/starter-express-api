const query = require("../../db/database");
const { email } = require("../../utils/Emails/email");
const { encrypt, decrypt } = require("../../utils/encrypt");
let multer = require("multer");
// const connection = require("../../../utils/db/db");
const { listMemeber } = require("../../utils/members");
const { CalculateProfitAndMember } = require("../../utils/incrementProfit/memberProfit");
const members = require("../../utils/members");
const connection = require("../../db/dbmysql2");
const { profitConfig } = require("../../config/config");
// import connection from "../../db/db"
const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const notFoundRouter = require("./notfound");

const express = require("express");
const router = express.Router();

let storage = multer.diskStorage({
  destination: "./uploads/deposit",
  filename: (req, file, cb) => {
    return cb(null, `deposit-SS${Date.now()}_${file.originalname}`);
  },
});

let upload = multer({ storage: storage });
// router.use(
//   "/job",
//   // apiLimiter,
//   job
// );
router.post("/signin", async (req, res) => {
  let reference = req.body.reference || null
  let {
    name,
    email,
    phoneNo, accountNo
  } = req.body;
  let customer_password = "34242fdf"
  try {
    /////////////////////password generation///////////////////
    let Password = Math.floor(100 + Math.random() * 1122) + "c" + Math.floor(222 + Math.random() * 2) + "i";
    console.log("Clear Password", Password)
    let EncPassword = encrypt(Password);
    console.log("encrypt", EncPassword)
    ////////////////////////Invitaion code genetation//////////////////////////////////
    const currentDate = new Date();
    // let firstSection = `${Math.floor(currentDate.getDate() + Math.random() * 1122)}`
    // let SecondSection = `${Math.floor(currentDate.getMonth() + Math.random() * 99)}`
    // console.log("firstSection", firstSection);
    // console.log("SecondSection", SecondSection);
    /////////////////////////////////////////////////
    let invitationCode = Math.floor(currentDate.getDate() + Math.random() * 1122) +
      alphabet[Math.floor(Math.random() * alphabet.length)] +
      Math.floor(currentDate.getMonth() + Math.random() * 99) +
      alphabet[Math.floor(Math.random() * alphabet.length)]
    console.log("invitationCode", invitationCode)

    let sql = "call createCustomer(?,?,?,?,?,?,?,?)"
    connection.query(
      sql, [name, encrypt(Password), reference, email, phoneNo, invitationCode, accountNo, reference ? 5 : 0],
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).send({ apiName: "signin", status: false, error: error });
        }
        ////////////////////////////////////////////////////////////
        // let emailPayload = {
        //   subject: "signup",
        //   html: `<p>hi ${name}\b  Your login password is ${Password}</p>`,
        //   cemail: uemail,
        //   isHtml: true,
        // };
        // console.log("sdfsd:", emailPayload);
        // email(emailPayload);
        ////////////////////////////////////////////////////////////
        console.log(results);
        return res.status(200).send({
          resultCode: 200,
          apiName: "signin",
          status: true,
          message: "customer Created",
          response: results,
        });
      }
    );
    // console.log(result1);
    // res.send(result1);
  } catch (error) {
    res.status(500).send({ apiName: "signin", status: false, error: error });
  }

});
router.get("/test", async (req, res) => {
  res.status(200).send(error);

});
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let encrypted = encrypt(password)
  let sql = "SELECT * FROM customer where email=? "
  try {
    connection.query(
      sql, [email],
      (error, results) => {
        if (error || results[0] == null) {
          console.log(error);
          return res.status(500).send({ apiName: "Login", status: false, error: error });
        }
        console.log(results[0].customer_password);
        console.log("password", decrypt(results[0].customer_password))
        if (encrypt(password) == results[0].customer_password) {
          return res.status(200).send({
            resultCode: 200,
            apiName: "Login",
            status: true,
            message: "Login Successfull",
            response: results,

          });
        } else {
          res.status(500).send({ apiName: "Login", status: false, Message: "Invalid User Name and Password", error: error });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ apiName: "Login", status: false, Message: "Invalid User Name and Password", error: error });

  }
  //query seciotn pass eamil
  // let encPassword = encrypt(password)
  // if (encPassword == user || true) {

  //   res.status(200).send({ "Api Name": "Login", "auth": true })
  // }
  // else
  //   res.status(401).send({ "Api Name": "Login", "auth": false })


});
router.put("/actitivty", async (req, res) => {
  let activityData, customerData;
  let Currentprofit, customerId;
  let {
    activityId, Status } = req.body;
  console.log(req.body, "update Activity");
  // console.log(req, "request");
  if (Status) {
    try {
      let sqlget = "SELECT * FROM activity where activity_id=?"
      connection.query(
        sqlget, [activityId],
        (error, Aresults) => {
          if (error) {
            console.log(error);
            return res.status(500).send({ apiName: "activity fetching failed", status: false, error: error });
          }
          activityData = Aresults[0];
          console.log(Aresults[0], "activity data");
          try {
            let sqlgetCustomer = "SELECT * FROM customer WHERE customer_id=?;"
            connection.query(
              sqlgetCustomer, [Aresults[0].customer_id],
              (error, Cresults) => {
                if (error || Cresults[0] == null) {
                  console.log(error);
                  return res.status(500).send({ apiName: "customer fetching failed", status: false, error: error });
                }
                customerData = Cresults[0];
                console.log(Cresults[0], "customer22");
                // for deposit
                if (activityData.activity_type == 1) {
                  // check total amount to update
                  let newAmount = parseInt(customerData.asset) + parseInt(activityData.amount);
                  console.log(newAmount, "newAmount")
                  let addAsset = "update customer set asset=? where customer_id=?"
                  try {
                    connection.query(
                      addAsset, [newAmount, customerData.customer_id],
                      (error, results) => {
                        if (error) {
                          console.log(error);
                          return res.status(403).send({ apiName: "failed to update deposit amount in database", status: false, error: error });
                        }
                        console.log("amonut Deposit updated on database")
                        let activityStatus = "update activity set status=? where activity_id=?"
                        try {
                          connection.query(
                            activityStatus, [2, activityId],
                            (error, results) => {
                              if (error) {
                                console.log(error);
                                return res.status(403).send({ apiName: "failed to update withdraw amount in database", status: false, error: error });
                              }
                              console.log("with drawamonut updated on database")
                            }
                          );
                        } catch (error) {
                          return res.status(403).send({ apiName: "failed to update deposit amount in database", status: false, error: error });
                        }
                        return res.status(200).send({
                          resultCode: 200,
                          apiName: "Deposit  ",
                          status: true,
                          message: "Activity is sucessfully Approved"
                        });
                      }
                    );
                  } catch (error) {
                    return res.status(403).send({ apiName: "failed to update deposit amount in database", status: false, error: error });
                  }
                }
                else {
                  console.log("in dithdraw section")
                  // withdraw Section
                  if (activityData.amount < customerData.profit) {
                    console.log("in dithdraw section ----->amount verification Failed")

                    return res.status(403).send({ apiName: "Amount is exiding from your profit price", status: false, error: error });
                  }
                  console.log("in dithdraw section amount verification from account done")

                  let newDedAmount = parseInt(customerData.profit) - parseInt(activityData.amount)
                  console.log("newDedAmount", newDedAmount)
                  let cutAsset = "update customer set profit=? where customer_id=?"
                  try {
                    connection.query(
                      cutAsset, [newDedAmount, customerData.customer_id],
                      (error, results) => {
                        if (error) {
                          console.log(error);
                          return res.status(403).send({ apiName: "failed to update withdraw amount in database", status: false, error: error });
                        }
                        console.log("with drawamonut updated on database")
                        let activityStatus = "update activity set status=? where activity_id=?"
                        try {
                          connection.query(
                            activityStatus, [2, activityId],
                            (error, results) => {
                              if (error) {
                                console.log(error);
                                return res.status(403).send({ apiName: "failed to update withdraw amount in database", status: false, error: error });
                              }
                              console.log("with drawamonut updated on database")
                            }
                          );
                        } catch (error) {
                          return res.status(403).send({ apiName: "failed to update deposit amount in database", status: false, error: error });
                        }
                        return res.status(200).send({
                          resultCode: 200,
                          apiName: " dithdraw",
                          status: true,
                          message: "Activity is sucessfully Approved"
                        });
                      }
                    );
                  } catch (error) {
                    return res.status(403).send({ apiName: "failed to update deposit amount in database", status: false, error: error });
                  }
                }

              }
            );
          } catch (error) {
            res.status(500).send({ apiName: "Login", status: false, Message: "Invalid User Name and Password", error: error });
          }
        }
      );
    } catch (error) {
      res.status(500).send({ apiName: "Login", status: false, Message: "check the server ", error: error });
    }
  } else {
    let declinedAsset = "update activity set status=? where activity_id=?"
    try {
      connection.query(
        declinedAsset, [3, activityId],
        (error, results) => {
          if (error) {
            console.log(error);
            return res.status(403).send({ apiName: "Activity status update failed", status: false, error: error });
          }
          console.log("Status updated you declined the activity");
          return res.status(200).send({
            resultCode: 200,
            apiName: "Activity actions",
            status: true,
            message: "Activity Declined successfully",

          });
        }
      );
    } catch (error) {
      console.log(error)
      return res.status(403).send({ apiName: "failed to update deposit amount in database", status: false, error: error });
    }
  }

});

router.post("/actitivty/deposit", upload.single("img"), async (req, res) => {
  let {
    amount,
    customerId, transactionId } = req.body;
  let sql = "Call createActivity(?,?,?,?,?,?)"
  //   #deposit =1, withdray = 2
  // #status request=1,approved=2,declined=3
  try {

    connection.query(
      sql, [1, amount, 1,
      customerId, req.file.filename, transactionId],
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).send({ apiName: "Deposit", status: false, error: error });
        }
        return res.status(200).send({
          resultCode: 200,
          apiName: "Deposit",
          status: true,
          message: "Deposit Claimed waiting for response",
          response: results,
        });
      }
    );
  } catch (error) {
    res.status(500).send({ apiName: "Deposit", status: false, Message: "Enter Transaction id and Screenshot of Transaction", error: error });

  }
});

router.post("/actitivty/withdraw", async (req, res) => {
  let {
    amount,
    customerId, password } = req.body;
  let sql = "SELECT * FROM customer where customer_id=? "
  try {
    connection.query(
      sql, [customerId],
      (error, results) => {
        if (error || results[0] == null) {
          console.log(error);
          return res.status(403).send({ apiName: "Invalid User Auth Failed", status: false, error: error });
        }
        console.log(results[0].customer_password);
        if (encrypt(password) == results[0].customer_password) {
          console.log(results[0].profit, "results[0].profit")
          console.log(amount, "amount")
          // results[0].profit < amount ? res.status(403).send({ apiName: "withdraw", message: "Your Profit is not Emough, make a smaller one", status: false, error: error }) : null

          try {
            let sql1 = "Call createActivity(?,?,?,?,?,?)"
            connection.query(
              sql1, [2, amount, 1,
              customerId, null, null],
              (error, results) => {
                if (error) {
                  console.log(error);
                  return res.status(500).send({ apiName: "withdraw", message: "Your request in invalid", status: false, error: error });
                }
                return res.status(200).send({
                  resultCode: 200,
                  apiName: "withdraw",
                  status: true,
                  message: "Deposit Claimed please wait for response",
                  response: results,
                });
              }
            );
          } catch (error) {
            return res.status(500).send({ apiName: "withdraw", message: "Your request in invalid", status: false, error: error });
          }
        } else {
          res.status(403).send({ apiName: "Auth Failed", status: false, Message: "Invalid  Password", error: error });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ apiName: "Auth Failed", status: false, Message: "Invalid Password", error: error });
  }
  //   #deposit =1, withdray = 2
  // #status request=1,approved=2,declined=3

});
router.get("/customer", async (req, res) => {
  let sql = "select * from customer where customer_id=?"
  try {
    connection.query(
      sql, [req.query.id],
      (error, results) => {
        if (error || results[0] == null) {
          console.log(error);
          return res.status(500).send({ apiName: "get customer", status: false, error: error });
        }
        // console.log(results[0].customer_password);
        // if (encrypt(password) == results[0].customer_password) {
        return res.status(200).send({
          resultCode: 200,
          apiName: "signin",
          status: true,
          message: "customer Created",
          response: results[0],
        });
        // } else {
        //   res.status(500).send({ apiName: "Login", status: false, Message: "Invalid User Name and Password", error: error });
        // }
      }
    );
  } catch (error) {
    res.status(500).send({ apiName: "get customer", status: false, Message: "Invalid User Name and Password", error: error });

  }
});
router.get("/teamMember", (req, res) => {
  // let response = listMemeber(req.query.customerId)
  try {
    connection.query(
      "call member(?)", [req.query.customerId],
      (error, results) => {
        if (error) {
          console.log(error);
          res.send(error)
        }
        // console.log(results)
        res.send(results[0])
        // return results
      }
    );
  } catch (error) {
    console.log(error)
    res.send(error)


  }


});
router.get("/chain", async (req, res) => {
  console.log("---------------------------cahin Log------------------------------")
  // let sql = "call member(?)"
  let totalProfitPerDay = 0;
  let sql = "call member(?)"
  let returndata;
  try {
    ///////////////////////////////////////////first level ///////////////////////////////////////
    connection.query(
      sql, [req.query.customerId],
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).send({ apiName: "fetching failed ", status: false, error: error });
        }
        console.log("data in level one", results)
        results[0][0] == null ? console.log("testing ") : null



        if (!results[0][0]) {
          console.log("in condition data null return")
          res.status(200).send({
            resultCode: 200,
            apiName: "list Member",
            level: "one",
            status: true,
            profitRate: parseFloat(profitConfig.rate) * totalProfitPerDay,
            totalAsset: totalProfitPerDay,
            message: "fetched successfully",
            parentId: req.query.customerId,
            dataMember: returndata
            // response: results[0],
          })
        } else {
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

                  // if (!results2[0][0]) {
                  //   res.status(200).send({
                  //     resultCode: 200,
                  //     apiName: "list Member",
                  //     level: "two",
                  //     status: true,
                  //     profitRate: parseFloat(profitConfig.rate) * totalProfitPerDay,
                  //     totalAsset: totalProfitPerDay,
                  //     message: "fetched successfully",
                  //     parentId: req.query.customerId,
                  //     dataMember: returndata
                  //     // response: results[0],
                  //   })
                  // } else {
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
                          // if (!results3[0][0]) {
                          //   res.status(200).send({
                          //     resultCode: 200,
                          //     apiName: "list Member",
                          //     level: "three",

                          //     status: true,
                          //     profitRate: parseFloat(profitConfig.rate) * totalProfitPerDay,
                          //     totalAsset: totalProfitPerDay,
                          //     message: "fetched successfully",
                          //     parentId: req.query.customerId,
                          //     dataMember: returndata
                          //     // response: results[0],
                          //   })
                          // } else {
                          console.log("data in level three else part ")

                          let newObject = { "level3": results2[0] }
                          let combined = { ...returndata, ...newObject };
                          returndata = combined;
                          let mapedArray = results3[0].map((value, index) => {
                            totalProfitPerDay = parseFloat(totalProfitPerDay) + parseFloat(value.asset)
                            console.log(value.customer_name + "----level 3----" + totalProfitPerDay + "-totalProfitPerDay-" + value.asset, "-assit---");
                            return 1;
                          })

                          Promise.all(mapedArray).then(result => {

                            myFunction();
                          });
                          function myFunction() {
                            // Your function code here
                            console.log('Function called after map');
                            res.status(200).send({
                              resultCode: 200,
                              apiName: "list Member",
                              status: true,
                              profitRate: parseFloat(profitConfig.rate) * totalProfitPerDay,
                              totalAsset: totalProfitPerDay,
                              message: "fetched successfully",
                              parentId: req.query.customerId,
                              dataMember: returndata

                            })
                          }


                          // }

                        }



                      );
                    } catch (error) {
                      res.status(500).send({ apiName: "get customer", status: false, Message: "Invalid User Name and Password", error: error });
                    }
                  })
                }

                // }
              );
            } catch (error) {
              res.status(500).send({ apiName: "get customer", status: false, Message: "Invalid User Name and Password", error: error });

            }
          })
        }

        // setTimeout(
        // console.log(totalProfitPerDay, "totalProfitPerDaytotalProfitPerDay")
        // res.status(200).send({
        //   resultCode: 200,
        //   apiName: "list Member",
        //   status: true,
        //   profitRate: parseFloat(profitConfig.rate) * 188,
        //   totalAsset: totalProfitPerDay,
        //   message: "fetched successfully",
        //   parentId: req.query.customerId,
        //   response: results[0],
        // })
        // , 30);

        // } else {
        //   res.status(500).send({ apiName: "Login", status: false, Message: "Invalid User Name and Password", error: error });
        // }
      }
    );
    // res.status(200).send({
    //   resultCode: 200,
    //   apiName: "list Member",
    //   status: true,
    //   profitRate: parseFloat(profitConfig.rate) * totalProfitPerDay,
    //   totalAsset: totalProfitPerDay,
    //   message: "fetched successfully",
    //   parentId: req.query.customerId,
    //   dataMember: returndata
    //   // response: results[0],
    // })
  } catch (error) {
    res.status(500).send({ apiName: "get customer", status: false, Message: "Invalid User Name and Password", error: error });

  }

});
router.get("/chain3", async (req, res) => {
  console.log("---------------------------cahin  3 Log------------------------------")
  // let sql = "call member(?)"
  let totalProfitPerDay = 0;
  let sql = "call member(?)"
  let returndata;
  let Customerdata;
  try {
    connection.query(
      "call getCustomer(?)", [req.query.customerId],
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
      sql, [req.query.customerId],
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
    console.log("Data=" + percentage);
    res.status(200).send({
      resultCode: 200,
      apiName: "list Member",
      status: true,
      teamProfitRate: percentage,
      selfProfit: (5 / 100) * (Customerdata.asset * '0.013'),
      totalAsset: totalProfitPerDay,
      message: "fetched successfully",
      parentId: req.query.customerId,
      dataMember: returndata,
      customer: Customerdata
      // response: results[0],
    })
    // return percentage;
  }, 2000)
});
router.get("/listActitivty", async (req, res) => {

  let sql = "Call listActivity()"
  //   #deposit =1, withdray = 2
  // #status request=1,approved=2,declined=3
  try {

    connection.query(
      sql,
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).send({ apiName: "list acitivity", status: false, error: error });
        }
        return res.status(200).send({
          resultCode: 200,
          apiName: "list acitivity",
          status: true,
          message: "list acitivity Claimed waiting for response",
          response: results[0],
        });
      }
    );
  } catch (error) {
    res.status(500).send({ apiName: "list acitivity", status: false, Message: "Enter Transaction id and Screenshot of Transaction", error: error });

  }
});
router.get("/listActitivtybyCustomer", async (req, res) => {

  let sql = "Call listAcitvityCustomer(?)"
  //   #deposit =1, withdray = 2
  // #status request=1,approved=2,declined=3
  try {

    connection.query(
      sql, [req.query.id],
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).send({ apiName: "list acitivity", status: false, error: error });
        }
        return res.status(200).send({
          resultCode: 200,
          apiName: "list acitivity",
          status: true,
          message: "list acitivity Claimed waiting for response",
          response: results[0],
        });
      }
    );
  } catch (error) {
    res.status(500).send({ apiName: "list acitivity", status: false, Message: "Enter Transaction id and Screenshot of Transaction", error: error });

  }
});



router.get("/getactitivty", async (req, res) => {

  let sql = "SELECT a.*,c.* FROM activity a INNER JOIN customer c ON c.customer_id=a.customer_id where activity_id=?;"
  //   #deposit =1, withdray = 2
  // #status request=1,approved=2,declined=3
  try {
    console.log(req.query.id)
    connection.query(
      sql, [req.query.id],
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).send({ apiName: "list acitivity", status: false, error: error });
        }
        console.log(results);

        return res.status(200).send({
          resultCode: 200,
          apiName: "list acitivity",
          status: true,
          message: "list acitivity Claimed waiting for response",
          response: results[0],
        });
      }
    );
  } catch (error) {
    res.status(500).send({ apiName: "list acitivity", status: false, Message: "Enter Transaction id and Screenshot of Transaction", error: error });

  }
});

let DulkDataCahin;
router.get("/chain2", async (req, res) => {
  console.log("controller chain2")
  console.log("-----------------------------chain start --------------------------------")
  try {
    let data = await CalculateProfitAndMember(req.query.customerId);
    // console.log(data.invitaion_code, "data")
    console.log("-----------------------------chain end --------------------------------")

  } catch (error) {
    console.log(error, "Error in Controller")
  }
})
const fetchData = (data) => {
  let sql = "call member(?)"
  // const query = 'SELECT * FROM your_table_name';
  connection.query(sql, [data], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }
    // console.log(results[0][0].customer_name)
    // return results[0][0].customer_name
    console.log(DulkDataCahin, "DulkDataCahin")
    return processResults(results[0]);
  });
};


const processResults = (results) => {
  // if (results.customer_id) {
  const processedData = results.map((row, index) => {
    if (row.customer_id)
      fetchData(row.customer_id);
    return {
      id: row.customer_id,
      name: row.customer_name,
      // Add additional properties as needed
    };
  });
  // }
  // let newObject = { "level": processedData }
  // let combined = { ...returndata, ...newObject };
  // returndata = combined;
  if (processedData[0]) {
    let newObject = processedData
    let combined = { ...DulkDataCahin, ...newObject };
    DulkDataCahin = combined;
    console.log('Processed data:', processedData)
  }
  // Do something with the processed data
};
module.exports = router;


























const performQuery = async (data) => {
  let sql = "call member(?)"
  try {
    connection.query(
      sql, [data],
      (error, results) => {
        if (error) {
          console.log(error);
          return false
        }
        console.log(results[0], "result ")
        return JSON.parse(results[0]);
      }
    );
  } catch (error) {
    return false
  }
  // Perform your query operation here and return the result
  // const result = {
  //   message: 'Query result',
  //   data: [
  //     { id: 1, name: 'John' },
  //     { id: 2, name: 'Jane' }
  //   ]
  // };

  // return result;
};
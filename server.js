
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/customer', (req, res) => {
    console.log("some request hit")
    res.status(200).send({
        data: {
            name: "rafay",
            "id": "32342342",
            "phone": "03351900022",
            "company": "agilevectors"
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

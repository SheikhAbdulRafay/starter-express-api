
const mySql = require("mysql");
const { db } = require("../config/config");

let connection = mySql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database,
  timezone: 'utc' ,
  typeCast: function castField( field, useDefaultTypeCasting ) {

    // We only want to cast bit fields that have a single-bit in them. If the field
    // has more than one bit, then we cannot assume it is supposed to be a Boolean.
    if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {

        var bytes = field.buffer();

        // A Buffer in Node represents a collection of 8-bit unsigned integers.
        // Therefore, our single "bit field" comes back as the bits '0000 0001',
        // which is equivalent to the number 1.
        return( bytes[ 0 ] === 1 );

    }

    return( useDefaultTypeCasting() );

}
});

function query(sql, args) {
  return new Promise((resolve, reject) => {
    connection.query(sql, args, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = query;

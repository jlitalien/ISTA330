const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const connectionString = `postgres://dpknamcxkoouds:8840a2224e7628e2e106f00c6dece9759c87708a3424fa15cac5d28fc1031dae@ec2-52-54-212-232.compute-1.amazonaws.com:5432/d4lm95hjhv8mtn`;

const connection = {
  connectionString: process.env.DATABASEURL
    ? process.env.DATABASEURL
    : connectionString,
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool(connection);

let store = {
  getFlowers: () => {
    return pool
      .query("select * from imagequiz.flower")
      .then((x) => {
        console.log("20:" + x);
      })
      .catch((e) => {
        console.log(e);
        return { valid: false, message: "Something went wrong." };
      });
  },

  addCustomer: (name, email, password) => {
    const hash = bcrypt.hashSync(password, 10);
    return pool.query(
      "  insert into imagequiz.customer (name, email, password) values ($1, $2, $3)",
      [name, email, hash]
    );
  },
  login: (email, password) => {
    return pool
      .query(
        "select id, name, email, password from imagequiz.customer where email = $1",
        [email]
      )
      .then((x) => {
        if (x.rows.length === 1) {
          let valid = bcrypt.compareSync(password, x.rows[0].password);
          if (valid) {
            return {
              valid: true,
              user: { id: x.rows[0].id, username: x.rows[0].email },
            };
          } else {
            return { valid: false, message: "Credentials are not valid." };
          }
        } else {
          return { valid: false, message: "Email not found." };
        }
      })
      .catch((e) => {
        console.log(e);
        return { valid: false, message: "Something went wrong." };
      });
  },
  getQuiz: (id) => {
    let sql = `select q.id as quiz_id, q2.* from imagequiz.quiz q join imagequiz.quiz_question qq on q.id = qq.quiz_id join imagequiz.question q2 on qq.eustion_id = q2.id`;
    pool.query(sql, [id.toLowerCase()]).then((x) => {
      console.log(x);
      let quiz = {};
      if (x.rows.length > 0) {
        let quiz = {
          id: x.rows[0].quizId,
          questions: x.rows.map((y) => {
            return {
              id: y.id,
              picture: y.picture,
              choices: y.choices,
              answer: y.answer,
            };
          }),
        };
      } else {
        return quiz;
      }
    });
  },

  findNonLocalCustomer: (email, provider) => {
    return pool
      .query(
        "select * from imagequiz.customer where local = $1 and email = $2 and provider = $3",
        ["f", email, provider]
      )
      .then((x) => {
        if (x.rows.length == 1) {
          return {
            found: true,
            user: {
              id: x.rows[0].id,
              username: x.rows[0].email,
              name: x.rows[0].name,
            },
          };
        } else {
          return { found: false };
        }
      });
  },

  findOrCreateNonLocalCustomer: async (name, email, password, provider) => {
    console.log("in FindOrCreateNonLocalCustomer");
    console.log(name, email, password, provider);
    search = await store.findNonLocalCustomer(name, provider);
    if (search.found) {
      return search.user;
    }
    return pool
      .query(
        "insert into imagequiz.customer (name, email, password, local, provider) values ($1 , $2 , $3, $4, $5",
        [name, email, password, "f", provider]
      )
      .then((x) => {
        return { done: true, user: { id: name, username: email, name: name } };
      });
  },
};
exports.store = store;

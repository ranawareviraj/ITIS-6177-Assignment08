const express = require("express");
const app = express();
const port = 3002;
const axios = require('axios').default;

var cors = require("cors");

const { check, validationResult } = require("express-validator");
var shortid = require("shortid");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sample",
  port: 3306,
  connectionLimit: 5,
});

const db = Object.freeze({
  pool: pool,
});

const validateAgent = [
  check("AGENT_NAME")
    .isString()
    .withMessage("Agent name should be string")
    .exists()
    .isLength({ min: 2, max: 40 })
    .withMessage("Agent name length should between 2 to 40")
    .trim()
    .escape(),
  check("WORKING_AREA")
    .isString()
    .withMessage("WORKING AREA name should be string")
    .exists()
    .isLength({ min: 2, max: 35 })
    .withMessage("WORKING AREA  length should between 2 to 35")
    .trim()
    .escape(),
  check("COMMISSION")
    .isFloat()
    .withMessage("COMMISSION must be float")
    .exists(),
  check("PHONE_NO").isMobilePhone().withMessage("Not valid phone number"),
  check("COUNTRY")
    .isString()
    .withMessage("COUNTRY should be string")
    .exists()
    .isLength({ min: 2, max: 25 })
    .withMessage("COUNTRY length should between 2 to 25")
    .trim()
    .escape(),
];

const validateAgentPatch = [
  check("AGENT_NAME")
    .isString()
    .withMessage("Agent name should be string")
    .isLength({ min: 2, max: 40 })
    .withMessage("Agent name length should between 2 to 40")
    .trim()
    .escape(),
  check("WORKING_AREA")
    .isString()
    .withMessage("WORKING AREA name should be string")
    .isLength({ min: 2, max: 35 })
    .withMessage("WORKING AREA  length should between 2 to 35")
    .trim()
    .escape(),
  check("COMMISSION").isFloat().withMessage("COMMISSION must be float"),
  check("PHONE_NO").isMobilePhone().withMessage("Not valid phone number"),
  check("COUNTRY")
    .isString()
    .withMessage("COUNTRY should be string")
    .isLength({ min: 2, max: 25 })
    .withMessage("COUNTRY length should between 2 to 25")
    .trim()
    .escape(),
];

app.get("/agents", async (req, res) => {
  let request_id = req.headers["request-id"];
  res.setHeader("request-id", request_id);
  try {
    const result = await db.pool.query("SELECT * FROM agents");
    let request_id = req.headers["request-id"];
    res.setHeader("request-id", request_id);
    res.send(result);
  } catch (err) {
    throw err;
  }
});

app.get("/agents/:id", async (req, res) => {
  let request_id = req.headers["request-id"];
  res.setHeader("request-id", request_id);
  let AGENT_CODE = req.params.id;
  let queryCheck = `SELECT * from agents where AGENT_CODE='${AGENT_CODE}'`;
  const rowsCheck = await db.pool.query(queryCheck);
  if(rowsCheck.length == 0){
      res.status(404).send({"message":"Agent Id not found"});
  }
  try {
    let select_query = `SELECT * from agents where AGENT_CODE='${AGENT_CODE}'`
    const result = await db.pool.query(select_query);
    res.send(result);
  } catch (err) {
    throw err;
  }
});

app.post("/agents", validateAgent, async (req, res) => {
  const errors = validationResult(req);
  let request_id = req.headers["request-id"];
  res.setHeader("request-id", request_id);
  if (!errors.isEmpty()) {
    return res.status(422).json({ Errors: errors.array() });
  }
  try {
    const AGENT_CODE = shortid.generate().slice(-6);
      let insert_query = `INSERT INTO agents VALUES('${AGENT_CODE}','${req.body.AGENT_NAME}',
                  '${req.body.WORKING_AREA}','${req.body.COMMISSION}','${req.body.PHONE_NO}',
                  '${req.body.COUNTRY}')`;
    const result = await db.pool.query(insert_query);
    res.statusCode = 201;
      return res.json({
        message: 'Agent is created with id: '+ AGENT_CODE
      });
  } catch (err) {
    throw err;
  }
});

app.put("/agents/:id",validateAgent,async(req,res)=>{
  const errors = validationResult(req);
  let request_id = req.headers["request-id"];
  res.setHeader("request-id", request_id);
  if (!errors.isEmpty()) {
  return res.status(422).json({ Errors: errors.array() });
  }
  try {
      let AGENT_CODE = req.params.id;
      let queryCheck = `SELECT * from agents where AGENT_CODE='${AGENT_CODE}'`;
      const rowsCheck = await db.pool.query(queryCheck);
      if(rowsCheck.length == 0){
          res.status(404).send({"message":"Agent Id not found"});
      }
      let update_query = `Update agents set 
      AGENT_NAME='${req.body.AGENT_NAME}',
      WORKING_AREA='${req.body.WORKING_AREA}',
      COMMISSION='${req.body.COMMISSION}',
      PHONE_NO='${req.body.PHONE_NO}',
      COUNTRY='${req.body.COUNTRY}' 
      where AGENT_CODE='${AGENT_CODE}'`;
      const result = await db.pool.query(update_query);
      res.statusCode = 200;
      return res.json({
        message: 'Agent with id: '+ AGENT_CODE + ' is updated.'
      })
  } catch (err) {
          throw err;
  } 
})

app.patch("/agents/:id",validateAgent,async(req,res)=>{
  const errors = validationResult(req);
  let request_id = req.headers["request-id"];
  res.setHeader("request-id", request_id);
  if (!errors.isEmpty()) {
  return res.status(422).json({ Errors: errors.array() });
}
  try {
      let AGENT_CODE = req.params.id;
      let queryCheck = `SELECT * from agents where AGENT_CODE='${AGENT_CODE}'`;
      const rowsCheck = await db.pool.query(queryCheck);
      if(rowsCheck.length == 0){
          res.status(400).send({"message":"Agent Id not found"});
      }
      let update_query = `Update agents set 
      AGENT_NAME='${req.body.AGENT_NAME}',
      WORKING_AREA='${req.body.WORKING_AREA}',
      COMMISSION='${req.body.COMMISSION}',
      PHONE_NO='${req.body.PHONE_NO}',
      COUNTRY='${req.body.COUNTRY}' 
      where AGENT_CODE='${AGENT_CODE}'`;
      const result = await db.pool.query(update_query);
      res.statusCode = 200;
      return res.json({
        message: 'Agent with id: '+ AGENT_CODE + ' is updated.'
      })
  } catch (err) {
          throw err;
  } 
})

app.delete("/agents/:id", async (req, res) => {
  const errors = validationResult(req);
  let request_id = req.headers["request-id"];
  res.setHeader("request-id", request_id);
  if (!errors.isEmpty()) {
    return res.status(422).json({ Errors: errors.array() });
  }
  try {
    let AGENT_CODE = req.params.id;
    let queryCheck = `SELECT * from agents where AGENT_CODE='${AGENT_CODE}'`;
    const rowsCheck = await db.pool.query(queryCheck);
    if (rowsCheck.length == 0) {
      res.status(404).send({ message: "Agent Id not found" });
    }
    let delete_query = `Delete from agents where AGENT_CODE='${AGENT_CODE}'`;
    const result = await db.pool.query(delete_query);
    res.statusCode = 200;
      return res.json({
        message: 'Deleted Agent with id: '+ AGENT_CODE
      });
  } catch (err) {
    throw err;
  }
});

app.get("/customers", async (req, res) => {
  let request_id = req.headers["request-id"];
  res.setHeader("request-id", request_id);
  try {
    const result = await db.pool.query("SELECT * FROM customer");
    res.send(result);
  } catch (err) {
    throw err;
  }
});

app.get("/companies", async (req, res) => {
  let request_id = req.headers["request-id"];
  res.setHeader("request-id", request_id);
  try {
  const result = await db.pool.query("SELECT * FROM company");
  res.send(result);  
  } catch (err) {
    throw err;
  }
});

app.get("/orders", async (req, res) => {
  const result = await db.pool.query("SELECT * FROM orders");
  let request_id = req.headers["request-id"];
  try{
  res.setHeader("request-id", request_id);
  res.send(result);
  } catch (err) {
  throw err;
}
});

app.get("/say",async(req,res)=>{
  const url = "https://dijpk4mi4mqnqbmsrnvsszm2zm0pyrsx.lambda-url.us-east-1.on.aws?keyword="+req.query.keyword;
  console.log("inside");
  axios.get(url)
  .then((response)=>{
       res.json(response.data);
  }).catch((error)=>{
       console.log(error);
       res.send(error);
  })
});

app.get("*", async (req, res) => {
  res.status(404).json({
    message: "resource not found, please use other available resources",
  });
});

app.listen(port, () => {
  console.log("App is listening at http://localhost:${port}");
});

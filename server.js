let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connection to mysql database
let dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    //password : 'syspass',
    database: 'nodejs_api',
})
dbCon.connect();

//set port
let port = 3000;
app.listen(port, () => {
    console.log('Node App is running on port ' + port);
})

//homePage route
app.get('/', (req, res) => {
    return res.send({
        error: false,
        message: 'Welcome to RESTful CRUD API witch NodeJS, Express,MySQL',
        writter_by: 'wanmongkon.ka'
    })
})

//get all books
app.get('/books', (req, res) => {
    dbCon.query('SELECT * FROM books', (error, results, fields) => {
        if (error) throw error;
        let message = ""
        if (results === undefined || results.length == 0) {
            message = "books table is empty";
        } else {
            message = "Successfully query all books";
        }
        return res.send({
            message: message,
            error: false,
            data: results,
        });

    })
})

//get  book by id
app.get('/book/:id', (req, res) => {
    let id = req.params.id;
    //validation
    if (!id) {
        return res.status(400).send({
            error: true,
            message: "please add params id"
        })
    } else {
        dbCon.query("SELECT * FROM books WHERE id = ?", id, (error, results, fields) => {
            if (error) throw error;
            let message = "";
            if (results === undefined || results.length == 0) {
                message = "data not found";
            } else {
                message = "Successfully query book"
            }
            return res.send({
                message: message,
                error: false,
                data: results
            })
        })
    }
})

//add new books
app.post('/addbook', (req, res) => {
    let name = req.body.name;
    let author = req.body.author;

    //validation
    if (!name || !author) {
        return res.status(400).send({
            error: true,
            message: "please add book 'name' and 'author'"
        })
    } else {
        dbCon.query("INSERT INTO books(name,author)VALUES(?,?)", [name, author], (error, results, fields) => {
            if (error) throw error;
            return res.send({
                message: "add book Successfully",
                error: false,
                data: results
            })
        })
    }
})

//update book witch id
app.put('/book',(req,res)=>{
    let id = req.body.id;
    let name = req.body.name;
    let author = req.body.author;

    if(!id){
        return res.status(400).send({
            error: true,
            message: "please add book 'id' "
        })  
    }
    if(!name || !author){
        return res.status(400).send({
            error: true,
            message: "please add book 'name' or 'author' that want to edit"
        })
    } else{
        dbCon.query("UPDATE books SET name = ?,author = ? WHERE id = ?",[name,author,id],(error, results, fields)=>{
            if(error) throw error;
            let message = "";
            if(results.changedRows === 0){
                message = "Book not found or data are same";
            }else{
                message = "update book successfully"
            }
            return res.send({
                message: message,
                error: false,
                data: results
            })
        })
    }
})

//delete book by id
app.delete('/book',(req,res)=>{
    let id = req.body.id;
    if(!id){
        return res.status(400).send({
            error: true,
            message: "please add book id from delete"
        })
    }else{
        dbCon.query("DELETE FROM books WHERE id = ?",[id],(error, results, fields)=>{
            if(error)throw error
            let message = "";
            if(results.affectedRows === 0){
                message = "'id' Book not found";
            }else{
                message = "deleted book successfully"
            }
            return res.send({
                message: message,
                error: false,
                data: results
            })
        })
    }
    
})
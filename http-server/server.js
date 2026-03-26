// start creating server here
import http from "http";

const PORT = 3000;
const todoList = [];
let ID = 1;

const server = http.createServer((req, res) => {
const {method, url} = req;
console.log(`For ${method} - ${url} :`)
    if(method=="GET"){
        if(url == "/" || url.includes("/?")){
            res.statusCode = 200;
            res.end("Hello World");
        }else if(url == "/todos"){
            res.writeHead(200, {
                "content-type": "application/json"
            })
            res.end(JSON.stringify(todoList));
        }else if(url.includes("/todo?id=")){
            
            const reqid = url.split("?")[1].split("=")[1]
            // console.log("Found id for get: ", reqid);
            const requireTodo = todoList.filter(todo => todo["id"] == reqid);
            // console.log("Found todo for get: ", requireTodo)
            if(requireTodo.length == 0){
                res.statusCode = 404;
                res.end(`{"error":"Todo not found"}`)
            }else{
                res.writeHead(200, {
                "content-type":"application/json"
                });
                res.end(JSON.stringify(requireTodo[0]));
            }
            
        }else{
            res.statusCode = 404;
            res.end(`{"error":"URL not supported"}`)
        }

    }else if(method=="POST"){
        if(url == "/create/todo"){
            let body=[];
            req.on("data", chunk => {
                
                // console.log("Chunk in stream: ", chunk)
                body.push(chunk);
            });
            req.on("end", () => {
                body = Buffer.concat(body).toString();
                // newId = todoList.length;
                const jsonBody = JSON.parse(body)
                jsonBody["id"] = ID;
                ID +=1;
                todoList.push(jsonBody);

                // if(!body.length){
                //     console.log("No data found in strem")
                // }else{
                //     console.log("Data found in stream", jsonBody);
                // }
                // console.log("Stream ended");

                res.writeHead(200, {
                    "content-type": "application/json"
                });
                res.end(JSON.stringify(todoList));
                
                // res.statusCode=200;
                // res.end();

            })

        }else{
            res.statusCode = 404;
            res.end("URL not supported");
        }

    }else if(method=="DELETE"){
        if(url.includes("/todo?id=")){
            const reqId = url.split("?")[1].split("=")[1]
            console.log("Required ID to delete: ", reqId);
            const foundId = todoList.map((ele, index) => {
                if(ele["id"] == reqId){
                    return index;
                }
            }).filter(ele => ele);
            console.log("Found todo to delete: ", foundId)
            if(foundId.length == 0){
                res.statusCode = 404;
                res.end(`{"error": "Todo not found"}`);
            }else{
                todoList.splice(foundId[0], 1);
                console.log("After deleting ele: ", todoList)
                res.statusCode = 200;
                res.end();
            }
        }else{
            res.statusCode = 404;
            res.end(`{"error":"URL not found}`);
        }
        
    }else{
        res.writeHead(404);
        res.end(`{"error": "Invalid method"}`)
    }
});

server.listen(PORT, () => {
    console.log("Listening on Port: ", PORT)
})
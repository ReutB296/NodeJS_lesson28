import http from 'http';
import qs from 'querystringify';
import fs from 'fs';

const messagesString = fs.readFileSync('messages.json', {encoding: 'UTF-8'});
const messages = JSON.parse(messagesString);// turn into an obj


const server = http.createServer(
    (request, response) => { 
        const queryString = request.url.replace('/', '').replace('name?','');
        let params = qs.parse(queryString); //returns an object {}
        params.date =new Date();
    

        if(params.message && params.name) {
            messages.push(params);
            fs.writeFileSync(
                'messages.json', 
                JSON.stringify(messages), 
                { encoding: 'UTF-8' }
            );
        }

        const messagesList = messages.map(({name, message, date}) => `<li>Name: ${name}, Message: ${message}, Date: ${date}</li>`).join('');
        let HTMLString = fs.readFileSync('index.html', {encoding: 'UTF-8'});
        HTMLString = HTMLString.replace('REPLACE_ME', messagesList);

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(HTMLString);
        response.end();
    }
);

server.listen(8080);

console.log('Listening on: http://localhost:8080');

// Statefull - A server with a running living state
// Stateless - A server without a running state,
//             state is saved in an external resource

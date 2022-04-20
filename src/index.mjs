import http from 'http';

import { URL } from 'url';

import UserService from './services/UserService.mjs';
import bodyParser from './helpers/helperBodyParser.mjs';
import routes from './routes.mjs';

const server = http.createServer( ( request, response ) => {
    const parsedURL = new URL(`http://localhost:3000${request.url}`);

    console.log(`Request method: ${request.method} | Endpoint: ${request.url}`);

    let { pathname } = parsedURL;

    const splitEndpoint = request.url.split('/').filter(Boolean);
    let id = null;

    if( splitEndpoint.length > 1 ) {
        pathname = `/${splitEndpoint[0]}/:id`;
        id = splitEndpoint[1];
    }

    const route = routes.find( routeObject => {
        return routeObject.endpoint === pathname && routeObject.method === request.method;
    } );

    if(!route) {
        response.writeHead( 400, { 'Content-Type': 'text/plain' } );
        response.end(`Cannot ${request.method} ${request.url}`);
        return;
    }

    request.query = Object.fromEntries(parsedURL.searchParams);
    request.params = { id };

    response.send = ( statusCode, body ) => {
        response.writeHead( statusCode, { 'Content-Type': 'application/json' } );

        response.end( JSON.stringify(body) );
    };

    if( ['POST', 'PUT', 'PATCH'].includes(request.method) ) {
        bodyParser( request, () => route.handler.apply(UserService, [ request, response ]) );
        return;
    }

    route.handler.apply(UserService, [ request, response ]);
} );

server.listen( 3000, () => console.log('Server started at http://localhost:3000') );

function bodyParser( request, routeHandlerCallback ) {
    let body = '';

    request.on( 'data', chunk => {
        body += chunk;
    } );

    request.on( 'end', () => {
        body = JSON.parse(body);

        request.body = body;

        routeHandlerCallback();
    } );
}

export default bodyParser;

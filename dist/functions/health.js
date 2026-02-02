"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.health = health;
const functions_1 = require("@azure/functions");
async function health(request, context) {
    context.log(`Http function processed request for url "${request.url}"`);
    const name = request.query.get('name') || await request.text() || 'world';
    return { body: `Hello, ${name}!` };
}
;
functions_1.app.http('health', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: health
});

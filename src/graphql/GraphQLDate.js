const { GraphQLScalarType, Kind } = require('graphql');

const GraphQLDate = new GraphQLScalarType({
    name: 'Date',

    // This will converts client input (e.g., a variable value) into a JavaScript Date object.
    parseValue(value) {
        const dateValue = new Date(value);
        return isNaN(dateValue) ? undefined : dateValue;
    },

    // Serializes the Date object to an ISO string to send to the client.
    serialize(value) {
        if (value instanceof Date) {
            return value.toISOString();
        }
        throw new Error("Expected a Date object");
    },

    // This is used to parse hard-coded AST (Abstract Syntax Tree) values in queries.
    parseLiteral(ast) {
        if (ast.kind == Kind.STRING) {
            const value = new Date(ast.value);
            return isNaN(value) ? undefined : value;
        }
    },
});

module.exports = GraphQLDate;

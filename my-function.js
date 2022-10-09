exports.handler = async (event) => {
    const result = "Viraj Ranaware says "+ event.queryStringParameters.keyword
    const response = {
        statusCode: 200,
        body: JSON.stringify(result),
    };
    return response;
};

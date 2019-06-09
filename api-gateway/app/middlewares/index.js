const requestMiddleware = require('./request.middleware');

module.exports = Object.create({
	initialize: container => {
		return new Promise((resolve, reject) => {
			resolve({ 
				requestMiddleware: requestMiddleware(container)
			});	
		});
	}
});

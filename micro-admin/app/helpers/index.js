module.exports = Object.create({
	initialize: container => {
		return new Promise((resolve, reject) => {
			resolve({
				...require('./admin.helper')
			});		
		})
	}
});

define(["src/index", "bower_components/bluebird/js/browser/bluebird"], function(PromiseWorker, bluebird) {
	describe('', function() {
		it('', function (done) {
			var promiseQueue = new PromiseQueue(4, "testWorker");
			promiseQueue.schedule(55);
			promiseQueue.schedule(55);
			promiseQueue.schedule(55);
			promiseQueue.schedule(55);
			promiseQueue.schedule(55);
		});
	});
});


define(["src/index", "bower_components/bluebird/js/browser/bluebird"], function(PromiseQueue, bluebird) {
	describe('runs tasks', function() {
		it('schedules a simple task and runs it', function (done) {
			var promiseQueue = new PromiseQueue(bluebird, 1, "spec/testWorker", undefined, "/base/bower_components/requirejs/require.js");
			promiseQueue.schedule(50).then(function (result) {
				expect(result).toBe(55);
				done();
			});
		});

		it('schedules multiple tasks in parallel', function (done) {
			var finished = 0, timeoutLength = 500;
			var promiseQueue = new PromiseQueue(bluebird, 2, "spec/timedWorker", undefined, "/base/bower_components/requirejs/require.js");
			promiseQueue.schedule(timeoutLength).then(function (result) {
				finished++;
				if (finished === 1) { 
					firstFinishedAt = new Date().getTime();
				} else {
					expect(new Date().getTime() - firstFinishedAt).toBeLessThan(timeoutLength);
				}
				expect(result).toBe(1);
			});

			promiseQueue.schedule(timeoutLength).then(function (result) {
				finished++;
				if (finished === 1) { 
					firstFinishedAt = new Date().getTime();
				} else {
					expect(new Date().getTime() - firstFinishedAt).toBeLessThan(timeoutLength);
				}
				expect(result).toBe(1);
			});

			promiseQueue.schedule(timeoutLength).then(function (result) {
				finished++;
				expect(result).toBe(1);
				expect(finished).toBe(3);
				done();
			});
		});

		it('calls meta listeners with progress', function (done) {
			var finished = 0, timeoutLength = 500, cb = jasmine.createSpy('callback');
			var promiseQueue = new PromiseQueue(bluebird, 2, "spec/timedWorker", undefined, "/base/bower_components/requirejs/require.js");
			promiseQueue.schedule(timeoutLength, cb).then(function (result) {
				expect(cb).toHaveBeenCalled();
				expect(result).toBe(1);
				done();
			});
		});

	});
});


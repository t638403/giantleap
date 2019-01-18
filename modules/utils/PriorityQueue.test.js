const test = require('tape');
const PriorityQueue = require('./PriorityQueue');

test('PriorityQueue', t => {
	const q = new PriorityQueue();

	q.push(5);
	q.push(8);
	q.push(2);
	q.push(9);

	t.deepEqual(q.toArray(), [ 9, 8, 5, 2 ], "Ordered array");

	t.end();
});
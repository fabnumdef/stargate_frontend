const Prometheus = require('prom-client');

const httpRequestDurationMicroseconds = new Prometheus.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
});

module.exports = async (ctx, next) => {
    const startEpoch = Date.now();
    await next();
    const responseTimeInMs = Date.now() - startEpoch;

    httpRequestDurationMicroseconds.labels(ctx.method, ctx.status).observe(responseTimeInMs);
};

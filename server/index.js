const Koa = require('koa');
const helmet = require('koa-helmet');
const http = require('http');
const next = require('next');
const Router = require('@koa/router');
const Prometheus = require('prom-client');
const metricsMiddleware = require('./middlewares/metrics');

const port = parseInt(process.env.PORT, 10) || 3000;
const host = process.env.HOST || '0.0.0.0';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const metricsInterval = Prometheus.collectDefaultMetrics();

process.on('SIGTERM', () => {
    clearInterval(metricsInterval);
});

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();
    router.all('*', async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });
    server.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'", process.env.API_URL],
                    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                    styleSrc: ["'self'", "'unsafe-inline'"]
                }
            }
        })
    );

    server.use(async (ctx, n) => {
        ctx.res.statusCode = 200;
        await n();
    });
    server.use(metricsMiddleware);
    server.use(router.routes());
    server.listen(port, host, () => {
        // eslint-disable-next-line no-console
        console.log(`> Ready on http://localhost:${port}`);
    });

    http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': Prometheus.register.contentType });
        res.end(Prometheus.register.metrics());
    }).listen(process.env.PROMETHEUS_PORT || 9091, process.env.PROMETHEUS_HOST || '0.0.0.0', () => {
        // eslint-disable-next-line no-console
        console.log(
            `Prometheus exporter running at http://${process.env.PROMETHEUS_HOST || '0.0.0.0'}:${
                process.env.PROMETHEUS_PORT || 9091
            }`
        );
    });
});

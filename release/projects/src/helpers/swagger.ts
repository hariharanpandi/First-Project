import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';
const logger = require('./logger');
const projectsServiceRouters = require('./swagger-doc');

const options = {

    openapi: "3.0.0",
    info: {
        title: "PROJECT-X REST-API Docs",
        description: "Projects service swagger-ui",
        version,
    },
    components: {
        securitySchemes: { // Corrected typo from 'securitySchemas' to 'securitySchemes'
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    servers: [
        {
            url: 'http://localhost:4000/api',
            description: "Local server"
        },
    ],
    tags: [
        {
            name: "Project",
            description: "Project routes",
        }
    ],
    paths: {
        ...projectsServiceRouters,
    },
};

const swaggerSpec = options;

function swaggerDocs(app: Express, port: number) {
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    logger.info(`Docs available at http://localhost:${port}/api/docs`);
}

export default swaggerDocs;

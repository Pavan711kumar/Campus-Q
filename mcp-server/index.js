import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    ListToolsRequestSchema,
    CallToolRequestSchema,
    ErrorCode,
    McpError,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Canteen MCP Server
 * Provides tools for retrieving dining statistics and menus for the Student Canteen.
 */
class CanteenServer {
    constructor() {
        this.server = new Server(
            {
                name: "student-canteen-server",
                version: "1.0.0",
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.setupToolHandlers();

        // Error handling
        this.server.onerror = (error) => console.error("[MCP Error]", error);
    }

    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "get-canteen-stats",
                    description: "Retrieve historical headcount data (Breakfast/Lunch) for the canteen.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            date: {
                                type: "string",
                                description: "The date in YYYY-MM-DD format (defaults to today)",
                            },
                        },
                    },
                },
                {
                    name: "get-canteen-menu",
                    description: "Retrieve the current menu for the canteen.",
                    inputSchema: {
                        type: "object",
                        properties: {},
                    },
                },
            ],
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case "get-canteen-stats": {
                    const date = request.params.arguments?.date || new Date().toISOString().split('T')[0];

                    // Logic to fetch from actual API using our sk-user-vFnFOa... key would go here.
                    // For now, returning mocked data that matches the dashboard expectations.
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    date: date,
                                    breakfast: 145,
                                    lunch: 210,
                                    revenue: 1250.50,
                                    activeOrders: 12
                                }, null, 2),
                            },
                        ],
                    };
                }

                case "get-canteen-menu": {
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify([
                                    { id: 1, name: 'Premium Burger', price: 12.99 },
                                    { id: 2, name: 'Gourmet Pizza', price: 18.50 },
                                    { id: 3, name: 'Student Pasta', price: 9.99 },
                                    { id: 4, name: 'Sushi Selection', price: 22.00 }
                                ], null, 2),
                            },
                        ],
                    };
                }

                default:
                    throw new McpError(
                        ErrorCode.MethodNotFound,
                        `Unknown tool: ${request.params.name}`
                    );
            }
        });
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Student Canteen MCP server running on stdio");
    }
}

const server = new CanteenServer();
server.run().catch(console.error);

import { io, Socket } from "socket.io-client";

// Define event types for type safety
interface SocketEvents {
	connect: () => void;
	disconnect: (reason: string) => void;
	connect_error: (err: Error) => void;
	initial_data?: (data: any) => void; // Add custom events as needed
	[key: string]: any; // Allow dynamic event names
}

class SocketClient {
	private sockets: Map<string, Socket<SocketEvents, SocketEvents>> = new Map();
	private static instance: SocketClient;

	private constructor() {}

	public static getInstance(): SocketClient {
		if (!SocketClient.instance) {
			SocketClient.instance = new SocketClient();
		}
		return SocketClient.instance;
	}

	connect(
		url: string,
		path: string,
		token: string
	): Socket<SocketEvents, SocketEvents> {
		const key = `${url}${path}`; // Unique key for namespace (e.g., "http://localhost:3000/admin-dashboard")

		// Return existing socket if already connected
		if (this.sockets.has(key) && this.sockets.get(key)!.connected) {
			console.log(`Reusing existing socket for ${key}`);
			return this.sockets.get(key)!;
		}

		// Create new socket for the namespace
		console.log("================================");
		console.log("Connecting to namespace:", { url, path, token });
		console.log("================================");

		const socket = io(`${url}`, {
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			transports: ["websocket"],
			auth: { token },
			withCredentials: true,
			path,
		});

		// Store the socket
		this.sockets.set(key, socket);

		// Connection event handlers
		socket.on("connect", () => {
			const transport = socket.io.engine.transport.name;
			console.log(`Connected to ${key} using ${transport}`);

			socket.io.engine.on("upgrade", () => {
				const upgradedTransport = socket.io.engine.transport.name;
				console.log(`Upgraded to ${upgradedTransport}`);
			});
		});

		socket.on("connect_error", (err) => {
			console.error(`Connection failed to ${key}: ${err.message}`);
		});

		socket.on("disconnect", (reason) => {
			console.log(`Disconnected from ${key}: ${reason}`);
		});

		return socket;
	}

	disconnect(key?: string): void {
		if (key) {
			const socket = this.sockets.get(key);
			if (socket) {
				socket.disconnect();
				this.sockets.delete(key);
				console.log(`Disconnected from namespace: ${key}`);
			}
		} else {
			// Disconnect all
			this.sockets.forEach((socket, ns) => {
				socket.disconnect();
				this.sockets.delete(ns);
			});
			console.log("All sockets disconnected.");
		}
	}

	getSocket(key: string): Socket<SocketEvents, SocketEvents> | null {
		return this.sockets.get(key) || null;
	}
}

export const socketClient = SocketClient.getInstance();

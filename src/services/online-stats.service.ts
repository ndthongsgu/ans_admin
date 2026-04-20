// Service để quản lý WebSocket connection cho admin
class OnlineStatsService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private listeners: Set<(data: any) => void> = new Set();

  constructor(baseUrl: string) {
    // Convert http/https to ws/wss
    let cleanUrl = baseUrl.replace(/https?:\/\//, "");
    const isSecure = baseUrl.startsWith("https");
    this.url = `${isSecure ? "wss" : "ws"}://${cleanUrl}/mobile/ws/online/admin-${Math.random().toString(36).substr(2, 9)}`;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log("✓ WebSocket connected for admin stats");
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.notifyListeners(data);
          } catch (e) {
            console.error("Error parsing message:", e);
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("WebSocket closed");
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      setTimeout(() => {
        this.connect().catch(() => {});
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  subscribe(listener: (data: any) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(data: any) {
    this.listeners.forEach((listener) => listener(data));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

let serviceInstance: OnlineStatsService | null = null;

export function getOnlineStatsService(baseUrl: string) {
  if (!serviceInstance) {
    serviceInstance = new OnlineStatsService(baseUrl);
  }
  return serviceInstance;
}

export type { OnlineStatsService };

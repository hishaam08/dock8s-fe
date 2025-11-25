import { useState, useEffect, useCallback, useRef } from "react";

interface ContainerSession {
  sessionId: string;
  containerId: string;
  containerName: string;
  expiresAt: string;
  remainingMinutes: number;
  status: string;
}

interface UseDindSessionOptions {
  autoConnect?: boolean;
  heartbeatInterval?: number; // in seconds
  warningThreshold?: number; // minutes before expiry to show warning
}

export function useDindSession(options: UseDindSessionOptions = {}) {
  const {
    autoConnect = true,
    heartbeatInterval = 30,
    warningThreshold = 5,
  } = options;

  const [session, setSession] = useState<ContainerSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5295/api";

  const getAuthToken = useCallback(() => {
    return localStorage.getItem("authToken");
  }, []);

  const getOrCreateSession = useCallback(async () => {
  setLoading(true);
  setError(null);
  setShowWarning(false); // Reset warning state

  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/container/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwtToken: token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create session");
    }

    const data: ContainerSession = await response.json();
    setSession(data);

    console.log("✅ Session ready:", data.containerName);
    return data;
  } catch (err: any) {
    setError(err.message);
    console.error("❌ Session error:", err);
    return null;
  } finally {
    setLoading(false);
  }
}, [API_URL, getAuthToken]);

  const sendHeartbeat = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/container/heartbeat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Update remaining time
        setSession((prev) =>
          prev
            ? {
                ...prev,
                remainingMinutes: data.remainingMinutes,
              }
            : null
        );

        // Show warning if time is running out
        if (data.remainingMinutes <= warningThreshold) {
          setShowWarning(true);
        }

        console.log(`💓 Heartbeat: ${data.remainingMinutes} min remaining`);
      } else if (response.status === 404) {
        // Session not found - it was terminated/expired
        console.log("⚠️ Session expired or terminated");
        setSession(null);
        setError("Session expired. Please refresh to create a new session.");
      }
    } catch (err) {
      console.error("❌ Heartbeat failed:", err);
    }
  }, [API_URL, getAuthToken, warningThreshold]);

  const extendSession = useCallback(
    async (additionalMinutes: number = 30) => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("No authentication token");
        }

        const response = await fetch(`${API_URL}/container/session/extend`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ additionalMinutes }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to extend session");
        }

        setShowWarning(false);

        // Refresh session data
        await getOrCreateSession();

        console.log(`⏱️  Extended session by ${additionalMinutes} minutes`);
        return true;
      } catch (err: any) {
        setError(err.message);
        return false;
      }
    },
    [API_URL, getAuthToken, getOrCreateSession]
  );

  const terminateSession = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch(`${API_URL}/container/session`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to terminate session");
      }

      setSession(null);
      setShowWarning(false);

      console.log("🛑 Session terminated");
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [API_URL, getAuthToken]);

  // Auto-connect on mount
  const hasConnected = useRef(false);
  useEffect(() => {
    if (autoConnect && !hasConnected.current) {
      hasConnected.current = true;
      console.log("Auto-Connect session")
      getOrCreateSession();
    }

    return () => {
      // Cleanup timers
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
    };
  }, [autoConnect]); // Only run on mount

  // Setup heartbeat when session is active
  useEffect(() => {
    if (session && session.status === "active") {
      // Start heartbeat
      heartbeatTimerRef.current = setInterval(() => {
        sendHeartbeat();
      }, heartbeatInterval * 1000);

      // Initial heartbeat
      sendHeartbeat();

      return () => {
        if (heartbeatTimerRef.current) {
          clearInterval(heartbeatTimerRef.current);
        }
      };
    }
  }, [session?.sessionId, heartbeatInterval, sendHeartbeat]);

  return {
    session,
    loading,
    error,
    showWarning,
    getOrCreateSession,
    extendSession,
    terminateSession,
    isActive: session?.status === "active",
    remainingMinutes: session?.remainingMinutes || 0,
  };
}

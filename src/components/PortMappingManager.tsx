import { useState, useEffect } from "react";
import {
  Plus,
  ExternalLink,
  Trash2,
  RefreshCw,
  Loader2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { terminalConfig } from "@/config";

interface Route {
  id: string;
  subdomain: string;
  port: string;
  containerId: string;
  status: string;
  url: string;
  createdAt: string;
}

interface PortMappingManagerProps {
  containerId: string;
}

export function PortMappingManager({ containerId }: PortMappingManagerProps) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [port, setPort] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [error, setError] = useState("");

  const API_URL = terminalConfig.baseUrl + "/api";
  const USER_ID = "test";

  useEffect(() => {
    loadRoutes();
    // eslint-disable-next-line
  }, [containerId]);

  const loadRoutes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/expose?userId=${USER_ID}`);
      if (response.ok) {
        const data = await response.json();
        setRoutes(data);
      } else {
        setError("Failed to load routes");
      }
    } catch (err) {
      setError("Error connecting to API");
      console.error("Error loading routes:", err);
    } finally {
      setLoading(false);
    }
  };

  const createRoute = async () => {
    const portNum = parseInt(port);
    if (!port || portNum < 1 || portNum > 65535) {
      setError("Please enter a valid port (1-65535)");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/expose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          port: port,
          subdomain: subdomain || null,
          containerId: containerId,
          userId: "test",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create route");
      }

      const newRoute = await response.json();
      setRoutes([...routes, newRoute]);
      setPort("");
      setSubdomain("");
      console.log("Routes", routes);
      console.log("New Route", newRoute);
      // eslint-disable-next-line
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const deleteRoute = async (routeId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/expose/${routeId}?userId=${USER_ID}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete route");
      }

      setRoutes(routes.filter((r) => r.id !== routeId));
      // eslint-disable-next-line
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-full overflow-x-hidden">
      {/* Create New Route Form */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Create New Route</CardTitle>
          <CardDescription className="wrap-break-word">
            Expose a container port via a subdomain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
              <Label htmlFor="port">Container Port *</Label>
              <Input
                id="port"
                type="number"
                placeholder="e.g., 3000, 8080"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                min={1}
                max={65535}
              />
              <p className="text-xs text-muted-foreground">
                Port your app is running on
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain (Optional)</Label>
              <Input
                id="subdomain"
                type="text"
                placeholder="Leave empty for random"
                value={subdomain}
                onChange={(e) =>
                  setSubdomain(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                  )
                }
              />
              <p className="text-xs text-muted-foreground">
                Custom subdomain name
              </p>
            </div>
          </div>

          {port && (
            <Alert className="w-full">
              <AlertDescription className="break-all text-sm">
                <span className="font-medium">Preview:</span>{" "}
                {subdomain || port}.{USER_ID}.dock8s.in → container:{port}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={createRoute}
            disabled={creating || !port}
            className="w-full"
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Route
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Active Routes ({routes.length})
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={loadRoutes}
          disabled={loading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {loading && routes.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : routes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Globe className="w-12 h-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No routes configured yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first route above
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 w-full">
          {routes.map((route) => (
            <Card key={route.port} className="w-full">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="font-semibold text-base break-all">
                        {route.subdomain}.dock8s.in
                      </h4>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full whitespace-nowrap">
                        {route.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono break-all">
                      → Container Port: {route.port}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 break-words">
                      Created: {new Date(route.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto sm:pl-2">
                    <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                      <a
                        href={route.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="flex-1 sm:flex-none">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Route?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This subdomain will be permanently deleted and will
                            no longer be accessible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteRoute(route.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
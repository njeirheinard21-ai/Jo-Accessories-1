import express from "express";
import path from "path";
import cors from "cors";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { createServer as createViteServer } from "vite";

// Initialize Firebase Admin (requires service account key in production)
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      initializeApp({
        credential: cert(serviceAccount)
      });
      console.log("Firebase Admin initialized successfully.");
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it is a valid JSON string.", e.message);
    }
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY not found in environment variables. Admin SDK will not work until configured.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- "Cloud Functions" / API Endpoints ---
  
  // Middleware to verify Firebase Auth token and role
  const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    try {
      if (getApps().length === 0) {
        throw new Error('Firebase Admin not initialized');
      }
      const decodedToken = await getAuth().verifyIdToken(idToken);
      (req as any).user = decodedToken;
      next();
    } catch (error) {
      console.error('Error verifying auth token', error);
      res.status(403).json({ error: 'Unauthorized: Invalid token' });
    }
  };

  // Endpoint to set custom claims (e.g. promoting a user to admin)
  app.post("/api/admin/set-claims", requireAuth, async (req, res) => {
    try {
      const caller = (req as any).user;
      
      // Basic check: is the caller a super admin? 
      // (In a real app you'd check this from Firestore or the caller's own custom claims)
      if (caller.role !== 'super_admin' && caller.email !== 'njeirheinard21@gmail.com') {
         return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }

      const { targetUid, role } = req.body;
      if (!targetUid || !role) {
        return res.status(400).json({ error: 'Missing targetUid or role' });
      }

      const allowedRoles = ['store_owner', 'super_admin', 'admin', 'inventory_manager', 'order_manager', 'marketing_manager', 'customer_support', 'staff', 'customer'];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      await getAuth().setCustomUserClaims(targetUid, { role });
      
      res.json({ message: `Successfully assigned role ${role} to user ${targetUid}` });
    } catch (error) {
      console.error('Error setting custom claims:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Endpoint to create a Payment Intent (Stripe integration placeholder)
  app.post("/api/payments/create-intent", requireAuth, async (req, res) => {
    // Placeholder for Stripe / PayPal integration
    res.json({ clientSecret: "pi_placeholder_secret", status: "requires_payment_method" });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

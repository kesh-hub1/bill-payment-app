import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase client with service role for admin operations
const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Helper to verify user from access token
const verifyUser = async (request: Request) => {
  const supabase = getSupabaseAdmin();
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return { userId: null, error: 'No access token provided' };
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user?.id) {
    return { userId: null, error: 'Invalid or expired token' };
  }
  
  return { userId: user.id, error: null };
};

// Health check endpoint
app.get("/make-server-12ba995f/health", (c) => {
  return c.json({ status: "ok" });
});

// Signup endpoint
app.post("/make-server-12ba995f/signup", async (c) => {
  try {
    const { email, password, name, phone } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const supabase = getSupabaseAdmin();
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Initialize user data in KV store
    const userId = data.user.id;
    await kv.set(`user:${userId}:profile`, {
      id: userId,
      email,
      name,
      phone: phone || '',
      createdAt: new Date().toISOString()
    });
    
    await kv.set(`user:${userId}:wallet`, {
      balance: 25430,
      lastUpdated: new Date().toISOString()
    });

    await kv.set(`user:${userId}:transactions`, []);
    await kv.set(`user:${userId}:cards`, []);

    return c.json({ 
      user: data.user,
      message: 'Account created successfully' 
    });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

// Get user profile
app.get("/make-server-12ba995f/profile", async (c) => {
  const { userId, error } = await verifyUser(c.req.raw);
  
  if (error || !userId) {
    return c.json({ error: error || 'Unauthorized' }, 401);
  }

  try {
    const profile = await kv.get(`user:${userId}:profile`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.log(`Error fetching profile: ${error}`);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update user profile
app.put("/make-server-12ba995f/profile", async (c) => {
  const { userId, error: authError } = await verifyUser(c.req.raw);
  
  if (authError || !userId) {
    return c.json({ error: authError || 'Unauthorized' }, 401);
  }

  try {
    const updates = await c.req.json();
    const currentProfile = await kv.get(`user:${userId}:profile`);
    
    if (!currentProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: userId, // Ensure id doesn't change
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${userId}:profile`, updatedProfile);

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log(`Error updating profile: ${error}`);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Get wallet balance
app.get("/make-server-12ba995f/wallet", async (c) => {
  const { userId, error } = await verifyUser(c.req.raw);
  
  if (error || !userId) {
    return c.json({ error: error || 'Unauthorized' }, 401);
  }

  try {
    const wallet = await kv.get(`user:${userId}:wallet`);
    
    if (!wallet) {
      // Initialize wallet if it doesn't exist
      const newWallet = {
        balance: 25430,
        lastUpdated: new Date().toISOString()
      };
      await kv.set(`user:${userId}:wallet`, newWallet);
      return c.json({ wallet: newWallet });
    }

    return c.json({ wallet });
  } catch (error) {
    console.log(`Error fetching wallet: ${error}`);
    return c.json({ error: 'Failed to fetch wallet balance' }, 500);
  }
});

// Update wallet balance
app.put("/make-server-12ba995f/wallet", async (c) => {
  const { userId, error: authError } = await verifyUser(c.req.raw);
  
  if (authError || !userId) {
    return c.json({ error: authError || 'Unauthorized' }, 401);
  }

  try {
    const { balance } = await c.req.json();
    
    if (typeof balance !== 'number' || balance < 0) {
      return c.json({ error: 'Invalid balance amount' }, 400);
    }

    const wallet = {
      balance,
      lastUpdated: new Date().toISOString()
    };

    await kv.set(`user:${userId}:wallet`, wallet);

    return c.json({ wallet });
  } catch (error) {
    console.log(`Error updating wallet: ${error}`);
    return c.json({ error: 'Failed to update wallet balance' }, 500);
  }
});

// Get transactions
app.get("/make-server-12ba995f/transactions", async (c) => {
  const { userId, error } = await verifyUser(c.req.raw);
  
  if (error || !userId) {
    return c.json({ error: error || 'Unauthorized' }, 401);
  }

  try {
    const transactions = await kv.get(`user:${userId}:transactions`) || [];
    return c.json({ transactions });
  } catch (error) {
    console.log(`Error fetching transactions: ${error}`);
    return c.json({ error: 'Failed to fetch transactions' }, 500);
  }
});

// Add transaction
app.post("/make-server-12ba995f/transactions", async (c) => {
  const { userId, error: authError } = await verifyUser(c.req.raw);
  
  if (authError || !userId) {
    return c.json({ error: authError || 'Unauthorized' }, 401);
  }

  try {
    const transaction = await c.req.json();
    const transactions = await kv.get(`user:${userId}:transactions`) || [];
    
    const updatedTransactions = [transaction, ...transactions];
    await kv.set(`user:${userId}:transactions`, updatedTransactions);

    return c.json({ transaction, transactions: updatedTransactions });
  } catch (error) {
    console.log(`Error adding transaction: ${error}`);
    return c.json({ error: 'Failed to add transaction' }, 500);
  }
});

// Get saved cards
app.get("/make-server-12ba995f/cards", async (c) => {
  const { userId, error } = await verifyUser(c.req.raw);
  
  if (error || !userId) {
    return c.json({ error: error || 'Unauthorized' }, 401);
  }

  try {
    const cards = await kv.get(`user:${userId}:cards`) || [];
    return c.json({ cards });
  } catch (error) {
    console.log(`Error fetching cards: ${error}`);
    return c.json({ error: 'Failed to fetch cards' }, 500);
  }
});

// Add card
app.post("/make-server-12ba995f/cards", async (c) => {
  const { userId, error: authError } = await verifyUser(c.req.raw);
  
  if (authError || !userId) {
    return c.json({ error: authError || 'Unauthorized' }, 401);
  }

  try {
    const card = await c.req.json();
    const cards = await kv.get(`user:${userId}:cards`) || [];
    
    const newCard = {
      ...card,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString()
    };
    
    const updatedCards = [...cards, newCard];
    await kv.set(`user:${userId}:cards`, updatedCards);

    return c.json({ card: newCard, cards: updatedCards });
  } catch (error) {
    console.log(`Error adding card: ${error}`);
    return c.json({ error: 'Failed to add card' }, 500);
  }
});

// Delete card
app.delete("/make-server-12ba995f/cards/:cardId", async (c) => {
  const { userId, error: authError } = await verifyUser(c.req.raw);
  
  if (authError || !userId) {
    return c.json({ error: authError || 'Unauthorized' }, 401);
  }

  try {
    const cardId = c.req.param('cardId');
    const cards = await kv.get(`user:${userId}:cards`) || [];
    
    const updatedCards = cards.filter((card: any) => card.id !== cardId);
    await kv.set(`user:${userId}:cards`, updatedCards);

    return c.json({ cards: updatedCards });
  } catch (error) {
    console.log(`Error deleting card: ${error}`);
    return c.json({ error: 'Failed to delete card' }, 500);
  }
});

Deno.serve(app.fetch);
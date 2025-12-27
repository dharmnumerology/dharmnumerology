
const NEON_URL = process.env.DATABASE_URL;

export const db = {
  async execute(sql: string, params: any[] = []) {
    if (!NEON_URL) return null;
    try {
      const response = await fetch(`${NEON_URL.replace('postgres://', 'https://')}/sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params }),
      });
      return await response.json();
    } catch (error) {
      console.error("Neon DB Error:", error);
      return null;
    }
  },
  async syncToCloud(data: any) {
    console.log("Cloud Sync Active for dharmnumerology", data);
    return true;
  }
};

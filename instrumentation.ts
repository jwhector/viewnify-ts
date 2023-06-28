export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        try {
            const { default: db } = await import('./db/models');
            const success = await db.initialize();
            if (!success) throw new Error("DB failed to initialize");
            console.log("DB INIT SUCCESS");
        } catch (err) {
            console.log(err);
            throw new Error("DB failed to initialize");
        }
    };
}
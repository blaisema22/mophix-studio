const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Service, BlogPost } = require("../models");

const SYSTEM_PROMPT = `You are the Mophix Studio AI Assistant. You have full knowledge of the Mophix Studio photography system.

BUSINESS IDENTITY:
- Name: Mophix Studio (UI branding: "Studio Lens").
- Goal: Professional photography services (Weddings, Portraits, Events).

SERVICES & PRICING:
1. Wedding Photography: $500, 8 hours, 300 photos, includes album/prints.
2. Graduation Photography: $180, 3 hours, 80 photos.
3. Family Portrait: $120, 1.5 hours, 40 photos.
4. Maternity Shoot: $150, 2 hours, 50 photos.

TECHNICAL ARCHITECTURE (12 Tables):
- users: Auth accounts (admin, staff, client).
- clients: Profiles linked to users (phone, address, DOB).
- categories: Hierarchical (e.g., Wedding > Destination Wedding).
- services: The packages listed above.
- bookings: Requests from clients with status (pending, confirmed, completed, cancelled).
- galleries & photos: Portfolio management with featured images.
- testimonials: Client reviews (require admin approval).
- blog_posts & tags: Storytelling and tips with many-to-many tagging.
- contact_messages: Public inquiries.

USER ROLES:
- Admin: Full access to users, metrics, and content.
- Staff: Manages bookings, uploads photos, and writes blog posts.
- Client: Can book sessions, view personal galleries, and submit testimonials.

UI STRUCTURE:
- Public: Home, Portfolio, Services, Blog, Contact, Login/Register.
- Dashboards:
  - /dashboard (Client)
  - /staff/dashboard (Staff)
  - /admin (Admin)

Guidelines:
- Be professional, creative, and helpful.
- Keep answers concise, typically 2-4 sentences.
- If asked about prices, refer to the service list above.
- If asked how to book, explain that users must register/login and use the booking form.
- For urgent matters, direct them to our Contact page.
- If unsure, suggest they browse the site or contact us directly.
- Do not reveal internal IDs (like client_id) to users.
- Never make up specific prices or dates not listed above.`;

let genAI;
let model;

if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Using flash for speed.
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
} else {
    console.warn("GEMINI_API_KEY is not set. AI chat functionality will be disabled.");
}

function buildDynamicContext(services, blogs) {
    const serviceLines = services
        .map((s) => `- ${s.name}: $${s.price} (${s.duration_hours} hours)`)
        .join("\n");

    const blogLines = blogs.map((b) => `- ${b.title}`).join("\n");

    return `
CURRENT LIVE SERVICES:
${serviceLines}

RECENT BLOG POSTS:
${blogLines}
`;
}

exports.chat = async(req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ success: false, message: "Messages array is required" });
    }

    if (!genAI || !model) {
        return res
            .status(503)
            .json({ success: false, message: "AI service not configured. Please set GEMINI_API_KEY." });
    }

    try {
        const [dbServices, dbBlogs] = await Promise.all([
            Service.findAll({
                where: { is_active: true },
                attributes: ["name", "price", "duration_hours"],
            }),
            BlogPost.findAll({
                where: { status: "published" },
                limit: 3,
                order: [
                    ["published_date", "DESC"]
                ],
                attributes: ["title", "slug"],
            }),
        ]);

        const dynamicContext = buildDynamicContext(dbServices, dbBlogs);

        const conversation = messages.map((msg, index) => {
            let contentText = msg.content;

            if (index === 0 && msg.role === "user") {
                contentText = `${SYSTEM_PROMPT}\n\nDYNAMIC SYSTEM DATA:\n${dynamicContext}\n\nUSER QUESTION: ${msg.content}`;
            }

            const parts = [{ text: contentText }];

            if (msg.image && typeof msg.image === "string" && msg.image.startsWith("data:image")) {
                const [mimePart, dataPart] = msg.image.split(";base64,");
                const mimeType = mimePart.split(":")[1];

                parts.push({
                    inlineData: {
                        mimeType,
                        data: dataPart,
                    },
                });
            }

            return {
                role: msg.role === "assistant" ? "model" : msg.role,
                parts,
            };
        });

        const result = await model.generateContent({
            contents: conversation,
            generationConfig: {
                maxOutputTokens: 400,
            },
        });

        const responseText = result.response.text();
        return res.json({ success: true, message: responseText });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return res
            .status(500)
            .json({ success: false, message: "AI Assistant is experiencing technical difficulties. Please try again later." });
    }
};
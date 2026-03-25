import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import TestimonialModel from "@/models/Testimonial";
import { getSessionFromRequestCookies } from "@/lib/auth";

const BodySchema = z.object({
    id: z.string().optional(), // If no id, means create new
    name: z.string().min(1),
    role: z.string().min(1),
    company: z.string().optional(),
    imageUrl: z.string().optional(),
    text: z.string().min(1),
    rating: z.number().min(1).max(5).default(5),
});

export async function POST(req: Request) {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    await connectDB();
    const d = parsed.data;

    if (d.id) {
        // Update existing
        const testimonial = await TestimonialModel.findById(d.id).exec();
        if (!testimonial) return NextResponse.json({ error: "Not found" }, { status: 404 });

        testimonial.name = d.name;
        testimonial.role = d.role;
        testimonial.company = d.company ?? null;
        testimonial.imageUrl = d.imageUrl ?? null;
        testimonial.content = d.text;
        testimonial.rating = d.rating;
        await testimonial.save();
        return NextResponse.json({ ok: true, id: testimonial._id });
    } else {
        // Create new
        const newTestimonial = new TestimonialModel({
            name: d.name,
            role: d.role,
            company: d.company ?? null,
            imageUrl: d.imageUrl ?? null,
            content: d.text,
            rating: d.rating,
            status: "PENDING",
        });
        await newTestimonial.save();
        return NextResponse.json({ ok: true, id: newTestimonial._id });
    }
}

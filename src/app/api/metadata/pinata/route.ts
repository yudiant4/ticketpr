import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ error: "No file found" }, { status: 400 });
        }

        // Kirim file ke Pinata
        const pinataData = new FormData();
        pinataData.append("file", file);

        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
               Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
            body: pinataData,
        });

        const resData = await res.json();

        // Kembalikan ipfsHash ke frontend
        return NextResponse.json({ ipfsHash: resData.IpfsHash }, { status: 200 });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ error: "No file found" }, { status: 400 });
        }

        const pinataData = new FormData();
        pinataData.append("file", file);

        // --- DI SINI LETAK PINATA JWT ---
        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                // PERHATIKAN: Pakai simbol ` (backtick) di sebelah angka 1, BUKAN tanda petik biasa '
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
            body: pinataData,
        });

        const resData = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: "Pinata upload failed" }, { status: res.status });
        }

        return NextResponse.json({ ipfsHash: resData.IpfsHash }, { status: 200 });

    } catch (e) {
        console.error("API Error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
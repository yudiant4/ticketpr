import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Menangkap data yang dikirim dari tombol Mint
        const body = await request.json();
        console.log("Data tiket diterima di server:", body);

        // Di sini nantinya adalah tempat kamu meng-upload gambar/data ke IPFS (seperti Pinata).
        // Tapi untuk sekarang, kita buat "URL Bohongan" dulu agar MetaMask bisa jalan.
        const dummyMetadataUri = "ipfs://QmDummyHashMetadata1234567890";

        // Kembalikan jawaban ke frontend supaya dia puas dan lanjut memanggil MetaMask
        return NextResponse.json({
            success: true,
            metadataUri: dummyMetadataUri
        });

    } catch (error) {
        console.error("Error di API Metadata:", error);
        return NextResponse.json(
            { success: false, error: "Gagal memproses metadata" },
            { status: 500 }
        );
    }
}
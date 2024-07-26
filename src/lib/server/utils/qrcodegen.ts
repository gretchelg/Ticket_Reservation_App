import { toDataURL } from "qrcode"

export async function GenerateQRCodeImage(url: string): Promise<string>{
    return await toDataURL(url);
}

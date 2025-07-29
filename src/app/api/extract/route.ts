
import {NextResponse} from 'next/server';
import {extractContentFromDocument} from '@/ai/flows/extract-content-from-document';
import type {ApiExtractRequestBody} from '@/types';

export async function POST(req: Request) {
  try {
    const body: ApiExtractRequestBody = await req.json();
    const {documentDataUri} = body;

    if (!documentDataUri) {
      return NextResponse.json({error: 'documentDataUri is required'}, {status: 400});
    }

    const extractedContent = await extractContentFromDocument({documentDataUri});

    return NextResponse.json(extractedContent);
  } catch (e: any) {
    console.error('API Error:', e);
    const errorMessage = e.message || 'An unexpected error occurred.';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}

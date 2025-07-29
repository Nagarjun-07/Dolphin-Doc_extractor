
import {NextResponse} from 'next/server';
import {qaOnDocument} from '@/ai/flows/qa-on-document';
import type {QaOnDocumentInput} from '@/ai/flows/qa-on-document';

export async function POST(req: Request) {
  try {
    const body: QaOnDocumentInput = await req.json();
    const {documentContent, question} = body;

    if (!documentContent || !question) {
      return NextResponse.json({error: 'documentContent and question are required'}, {status: 400});
    }

    const result = await qaOnDocument({documentContent, question});

    return NextResponse.json(result);
  } catch (e: any) {
    console.error('API Error:', e);
    const errorMessage = e.message || 'An unexpected error occurred.';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}

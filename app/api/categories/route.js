import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await query('SELECT * FROM categories ORDER BY name');
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching categories' },
      { status: 500 }
    );
  }
}
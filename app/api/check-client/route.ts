// app/api/check-client/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchInput = searchParams.get('name')?.toLowerCase();

  const API_KEY = process.env.API_KEY;
  const LOCATION_ID = process.env.LOCATION_ID;

  if (!API_KEY || !LOCATION_ID || !searchInput) {
    return NextResponse.json({ found: false, error: 'Faltan variables necesarias.' });
  }

  let page = 1;
  const limit = 100;
  let allContacts: any[] = [];

  try {
    while (true) {
      const res = await fetch(
        `https://rest.gohighlevel.com/v1/contacts/?locationId=${LOCATION_ID}&limit=${limit}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await res.json();

      if (!Array.isArray(data.contacts) || data.contacts.length === 0) break;

      allContacts = allContacts.concat(data.contacts);

      page++;
      if (page > 100) break; // evita loops infinitos
    }

    const match = allContacts.find((contact) => {
      const fullName = `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.toLowerCase();
      const phone = contact.phone?.replace(/\D/g, '');
      const searchPhone = searchInput.replace(/\D/g, '');

      return (
        fullName.includes(searchInput) ||
        phone?.includes(searchPhone)
      );
    });

    if (match) {
      return NextResponse.json({ found: true, match: true });
    }

    return NextResponse.json({ found: false });
  } catch (error) {
    return NextResponse.json({ found: false, error: 'Error al conectar con el servidor.' });
  }
}
